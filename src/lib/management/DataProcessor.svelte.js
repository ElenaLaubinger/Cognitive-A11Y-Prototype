/**
 * This file is responsible for processing the raw module data from the JSON file and transforming it into a format that can
 * be easily used by the rest of the application. It flattens the hierarchical structure of the module data, resolves profile
 * inheritance based on predefined rules, and provides utility functions for filtering and grouping the data.
 *
 * Public variables:
 * const flattenedData: The flattened dataset. Contains a handbook-Object, a groupECTS-Array and a modules-Array.
 *
 * Public functions:
 * groupModuleSections(): Groups sections and subsections to be able to show them as filters.
 * getUniqueGroup(): Filters given data according to the desired field, e.g. "profile" for all profile strings.
 * getProfileAddition(): Filters data based on the selected profile.
 *
 * Remark: GitHub Copilot was used for trobuleshooting of data processing functionality bugs. The AI was also used
 * to refactor large functions. Code that was solely done by GitHub Copilot is marked below.
 */

import {SvelteMap, SvelteSet} from "svelte/reactivity";
import data from "../../dummy_data.json";
import statusData from "../../module_status.json";
import DOMPurify from "isomorphic-dompurify";

const moduleStatus = getModuleStatus(statusData);
export const flattenedData = flattenData(data);

/**
 * Maps the module status from a given JSON file.
 * @param {Object} statusData - The data from module_status.json.
 * @returns {Map<string, Map<string, string>>} The mapped module status.
 */
function getModuleStatus(statusData) {
    const status = new SvelteMap();

    statusData.children.forEach((profile) => {
        const moduleStatus = new SvelteMap();

        profile.children.forEach((statusGroup) => {
            statusGroup.children.forEach((module) => {
                moduleStatus.set(String(module.mId), statusGroup.status);
            });
        });

        status.set(profile.name, moduleStatus);
    });

    return status;
}

/**
 * Entry point for data flattening from a given JSON file.
 * @param {Object} data - The data object from module_data.json.
 * @returns {Object} The flattened object containing handbook name, modules and group ECTS information.
 */
function flattenData(data) {
    const name = {name: data.name};
    const flatModules = [];
    const groupEcts = [];
    const ectsKeys = new SvelteSet();
    const profileNames = ["Profil 1", "Profil 2", "Profil 3"];
    const profileModuleIds = {
        "Profil 1": new SvelteSet(),
        "Profil 2": new SvelteSet(),
        "Profil 3": new SvelteSet()
    };
    const flatObj = {
        flatModules,
        groupEcts,
        ectsKeys,
        profileNames,
        profileModuleIds
    };

    for (const modGrp of data.mgs) {
        traverseData(modGrp, flatObj);
    }

    const achievedEcts = addAchievedEcts(groupEcts, flatModules);

    return {handbook: name, groupECTS: achievedEcts, modules: flatModules};
}

/**
 * Traverses a given data structure and coordinates module processing.
 * @param {Object} modGrp - Data structure to traverse.
 * @param {Object} target - Flat object for saving modules.
 */
function traverseData(modGrp, target) {
    const section = modGrp.name || null;

    // Iterate subsections (modSec) of the module group
    if (Array.isArray(modGrp.children)) {
        for (const modSec of modGrp.children) {
            const subsection = modSec.name || null;

            // For each profile in the subsection, process it with modSec passed in
            if (Array.isArray(modSec.children)) {
                for (const profile of modSec.children) {
                    processProfile(modSec, profile, section, subsection, target);
                }
            }

            if (Array.isArray(modSec.modules)) {
                addProfileModules(modSec, section, subsection, target);
            }
        }
    }

    if (Array.isArray(modGrp.modules)) {
        addProfileModules(modGrp, section, section, target);
    }
}

/**
 * Processes a profile node.
 * @param {Object} modSec - The module section/group object.
 * @param {Object} profile - The profile object to process.
 * @param {String|null} section - Name of the section (or null if not available).
 * @param {String|null} subsection - Name of the subsection (or null if not available).
 * @param {Object} target - Flat object for saving modules.
 */
function processProfile(modSec, profile, section, subsection, target) {
    const profileName = profile.name;

    flattenEcts(profile, profileName, section, subsection, target.groupEcts, target.ectsKeys);

    if (Array.isArray(profile.children)) {
        for (const childGroup of profile.children) {
            flattenEcts(
                childGroup,
                profileName,
                section,
                childGroup.name || subsection,
                target.groupEcts,
                target.ectsKeys
            );
        }
    }

    const modules = resolveInheritance(modSec, profile, modSec.mgId);
    flattenModules(
        modules,
        profileName,
        section,
        subsection,
        target.flatModules,
        target.profileModuleIds,
        moduleStatus
    );
}

/**
 * Adds modules that are not assigned to a specific profile to all profiles.
 * @param {Object} modules - The modules object.
 * @param {String|null} section - Name of the section (or null if not available).
 * @param {String|null} subsection - Name of the subsection (or null if not available).
 * @param {Object} target - Flat object for saving modules.
 */
function addProfileModules(modules, section, subsection, target) {
    for (const profileName of target.profileNames) {
        flattenEcts(modules, profileName, section, subsection, target.groupEcts, target.ectsKeys);
        flattenModules(
            modules.modules,
            profileName,
            section,
            subsection,
            target.flatModules,
            target.profileModuleIds,
            moduleStatus
        );
    }
}

/**
 * Adds all modules from the given list to the flatModules array.
 * Remark: This function was done by GitHub Copilot.
 * @param {Object[]} modules - The list of modules to add.
 * @param {String} profileName - The name of the profile.
 * @param {String} section - The section of the module.
 * @param {String} subsection - The subsection of the module.
 * @param {Object[]} flatModules - The list of modules to add to.
 * @param {Object} moduleIds - An object containing the IDs of modules added to each profile.
 * @param {Map<string, Map<string, string>>} statusLookup - Status lookup by profile and module ID.
 */
function flattenModules(modules, profileName, section, subsection, flatModules, moduleIds, statusLookup) {
    modules.forEach((module) => {
        if (moduleIds[profileName]?.has(module.mId)) {
            return;
        }
        moduleIds[profileName]?.add(module.mId);

        const status = statusLookup
            ?.get(profileName)
            ?.get(String(module.mId)) ?? module.status;

        flatModules.push(createModuleObject(module, profileName, section, subsection, status));
    });
}

/**
 * Adds a new entry to the flatEcts array containing the ECTS information from the given group.
 * Remark: This function was done by GitHub Copilot.
 * @param {Object} group - The group containing the ECTS information.
 * @param {string} profileName - The name of the profile.
 * @param {string} section - The section of the module.
 * @param {string} subsection - The subsection of the module.
 * @param {Array<Object>} flatEcts - The list of ECTS information to add to.
 * @param {Set<string>} keys - A set of keys that have already been added to the flatEcts array.
 */
function flattenEcts(group, profileName, section, subsection, flatEcts, keys) {
    if (!group?.mgId || !profileName) return;

    const ectsMin = group.ectsMin ?? 0;
    const ectsMax = group.ectsMax ?? 0;
    if (ectsMin === 0 && ectsMax === 0) return;

    const key = `${profileName}|${group.mgId}`;
    if (keys.has(key)) return;
    keys.add(key);

    flatEcts.push({
        profile: profileName,
        section,
        subsection,
        ectsMin,
        ectsMax
    });
}

/**
 * Resolves profile module inheritance based on configuration rules.
 * Remark: Except for ruleConfig, this function was mostly done by GitHub Copilot.
 * @param {Object} modSec - The module section (e.g., WP-2 Wahlpflichtbereich)
 * @param {Object} profile - The profile (Profil 1, 2, 3)
 * @param {String} modSecId - The mgId of the module section
 * @returns {Array} - The resolved modules for this profile
 */
function resolveInheritance(modSec, profile, modSecId) {
    // Inheritance rules of modules.
    const ruleConfig = {
        // Modulegroup MG2
        "49802": {
            // Profile 1
            "49803": {
                inheritsFrom: "49807", // Profile 3
                include: ["49808"], // Suplementary area of profile 3
                exclude: ["UXUrwj-BZUXmcij-B"]
            },
            // Profile 2
            "49804": {
                inheritsFrom: "49807", // Profile 3
                include: ["49808"], // Suplementary area of profile 3
            }
        }
    };

    const rule = ruleConfig[modSecId]?.[profile.mgId];
    const baseModules = [];
    if (Array.isArray(profile.modules)) baseModules.push(...profile.modules);
    if (Array.isArray(profile.children)) {
        for (const child of profile.children) {
            if (Array.isArray(child.modules)) baseModules.push(...child.modules);
        }
    }
    if (!rule) return baseModules;

    const parent = modSec.children?.find(p => p.mgId === rule.inheritsFrom);
    let modules = [];
    if (parent) {
        if (Array.isArray(parent.modules)) modules.push(...parent.modules);
        if (Array.isArray(parent.children)) {
            for (const child of parent.children) {
                if (Array.isArray(child.modules)) modules.push(...child.modules);
            }
        }
    }

    if (rule.include && parent) {
        rule.include.forEach(childId => {
            const child = parent.children?.find(c => c.mgId === childId);
            if (child?.modules) {
                modules.push(...child.modules);
            }
        });
    }
    if (rule.exclude) {
        modules = modules.filter(m => !rule.exclude.includes(m.acronym));
    }

    return modules;
}

/**
 * Creates an object containing the properties of a module.
 * @param {Object} module - The module object.
 * @param {String} profileName - The name of the profile.
 * @param {String} section - The section of the module.
 * @param {String} subsection - The subsection of the module.
 * @param {String | undefined} status - The raw status value from module_status (if available).
 * @return {Object} - The module object.
 */
function createModuleObject(module, profileName, section, subsection, status) {
    return {
        id: module.mId,
        moduleAlias: module.acronym,
        moduleName: module.name,
        profile: profileName,
        section: section,
        subsection: subsection,
        chair: module.chair,
        responsible: module.respPerson ? [{
            title: module.respPerson.title,
            firstname: module.respPerson.firstname,
            lastname: module.respPerson.lastname
        }] : [],
        term: module.term,
        termInfo: module.offerBegin,
        recTerm: module.recTerm,
        ects: module.ects,
        duration: module.duration,
        status: setStatus(status),
        compulsory: module.type,
        topics: sanitizeHtml(module.content),
        goals: sanitizeHtml(module.skills),
        additionalInfo: sanitizeHtml(module.addInfo),
        recKnowledge: sanitizeHtml(module.priorKnowledge),
        workload: sanitizeHtml(module.workload),
        knowledge: module.prevModules,
        exams: (module.exams || []).map(exam => ({
            eId: exam.meId,
            name: exam.name,
            description: exam.desc,
            duration: exam.duration,
            share: exam.share
        }))
    };
}

/**
 * Adds achieved ECTS for each profile/subsection group.
 * @param {Array<Object>} groupEcts - The flattened ECTS groups.
 * @param {Array<Object>} flatModules - The flattened modules.
 * @returns {Array<Object>} Group ECTS enriched with achievedEcts.
 */
function addAchievedEcts(groupEcts, flatModules) {
    const achieved = new SvelteMap();

    flatModules.forEach((module) => {
        if (module.status !== "completed") {
            return;
        }
        // This part was done by GitHub Copilot.
        const key = `${module.profile}|${module.section}|${module.subsection}`;
        const ects = Number(module.ects);
        achieved.set(key, (achieved.get(key) || 0) + ects);
    });

    // This part was done by GitHub Copilot.
    return groupEcts.map((group) => {
        const key = `${group.profile}|${group.section}|${group.subsection}`;
        return {
            ...group,
            achievedEcts: achieved.get(key) || 0
        };
    });
}

/**
 * Sanitizes a string by removing unwanted HTML tags and attributes.
 * @param {String} input - The raw HTML string to sanitize.
 * @returns {String} - The sanitized HTML string.
 */
function sanitizeHtml(input) {
    if (!input) return "";

    let sanitized = String(input).replaceAll(/\r?\n/g, "<br>");
    sanitized = sanitized.replaceAll(/<\/?body[^>]*>/gi, "").trim();

    return DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ["p", "ul", "ol", "li", "br", "a"],
        ALLOWED_ATTR: ["href", "target", "rel"],
        ALLOW_DATA_ATTR: false
    });
}

/**
 * Translates the status from module_status to a usable status for the application.
 * @param {String} status - The raw status ("abgeschlossen", "belegt").
 * @returns {String} - The translated status ("completed", "in-progress", "not-started").
 */
function setStatus(status) {
    switch (status) {
        case "abgeschlossen":
            return "completed";
        case "belegt":
            return "in-progress";
        default:
            return "not-started";
    }
}

/**
 * Groups the given data by section and subsection.
 * @param {Array<Object>} data - The data to group.
 * @returns {Object<string, Array<string>>} - An object with section as key and an array of subsections as value.
 */
export function groupModuleSections(data) {
    const result = ({});

    data.forEach(item => {
        const section = item.section;
        const subsection = item.subsection;

        if (!result[section]) {
            result[section] = [];
        }

        if (subsection && !result[section].includes(subsection)) {
            result[section].push(subsection);
        }
    });

    return result;
}

/**
 * Filters given data according to the desired field, e.g. "profile" for all profile strings.
 * Remark: This function was done by GitHub Copilot.
 * @param {Array<Object>} data - The working dataset.
 * @param {String} fieldName - The field name for the strings.
 * @returns {Array<String>} - An array of strings with unique strings.
 */
export function getUniqueGroup(data, fieldName) {
    return Array.from(
        new SvelteSet(
            data
                .map(item => item[fieldName])
                .filter(value => value !== undefined && value !== null)
        )
    );
}

/**
 * Filters the flattened module data according to given profile and special parameter.
 * @param {String} profile - The profile to filter by.
 * @param {String} addition - The special parameter to filter the profile.
 * @returns {Array<Object>} - An array of additional data for the given profile.
 */
export function getProfileAddition(profile, addition) {
    if (addition === "modules") {
        return flattenedData.modules.filter(module => module.profile === profile);
    } else if (addition === "ects") {
        return flattenedData.groupECTS.filter(group => group.profile === profile);
    }
}