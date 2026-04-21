/**
 * This file enables the application to save data across sessions (guideline XV.2.).
 * It therefore uses browser's `sessionStorage`-feature. Saved data (profile, information boxes,
 * search histories) are validated, read and written.
 *
 * Public functions:
 * - setProfileStates(): Applies profile-dependent global states.
 * - saveProfileValues(): Saves selected handbook/profile values.
 * - loadProfile(): Returns saved handbook/profile values.
 * - loadProfileStates(): Restores profile states from saved data.
 * - saveInfoboxes(): Saves information boxes visibility/acknowledgement state by scope.
 * - loadInfoboxes(): Restores information boxes of the given scope.
 * - saveSearchHistory(): Saves normalized search history by scope.
 * - loadSearchHistory(): Restores normalized search history by scope.
 *
 * Remark: The logic of this file was created with the help of GitHub Copilot. It set up a basic persistence
 * functionality based on an additional schema.json-file. Afterward the whole file was refactored by
 * the author. Finally, the logic around the additional schema-file was removed by the author.
 * Functions entirely done by the AI are highlighted below.
 */

import {
    getProfileAddition,
    getUniqueGroup,
    groupModuleSections,
} from "./DataProcessor.svelte.js";
import {
    profileSetting,
    profileModules,
    profileChair,
    profileSection,
} from "./StateManager.svelte.js";

const STORAGE_KEY = "baula-session";
const schema = {
    "selectedHandbook": null,
    "selectedProfile": null,
    "infoboxes": {},
    "searchHistories": {
        "module": [],
        "application": []
    }
}
let browserStorage = globalThis.window !== undefined && globalThis.sessionStorage !== undefined;

/**
 * Reads saved data from browser's `sessionStorage`.
 * @returns {any} Saved data object.
 */
function readSessionSave() {
    if (!browserStorage) {
        return schema;
    }

    const rawValue = sessionStorage.getItem(STORAGE_KEY);

    try {
        return transformToSchema(JSON.parse(rawValue));
    } catch {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
        return schema;
    }
}

/**
 * Saves the current data to browser's `sessionStorage`.
 * @param { Object | string } data - Data to be saved.
 */
function saveSession(data) {
    const schemaData = transformToSchema(data);

    if (browserStorage) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(schemaData));
    }
}

/**
 * Serves as a safeguard for standardizing data pattern.
 * @param { Object | string } data - Data to be transformed.
 * @returns { Object } Transformed data.
 */
function transformToSchema(data) {
    return {
        selectedProfile: data.selectedProfile ?? null,
        selectedHandbook: data.selectedHandbook ?? null,
        infoboxes: data.infoboxes ?? {},
        searchHistories: data.searchHistories ?? {
            "module": [],
            "application": []
        },
    };
}

/**
 * Saves selected handbook/profile values.
 * @param {string | null | undefined} handbook - Selected handbook.
 * @param {string | null | undefined} profile - Selected profile.
 */
export function saveProfileValues(handbook, profile) {
    let session = readSessionSave();

    session.selectedHandbook = handbook ?? null;
    session.selectedProfile = profile ?? null;

    saveSession(session);
}

/**
 * Loads saved handbook and profile values.
 * @returns {{handbook: string | null, profile: string | null}} Saved handbook/profile values.
 */
export function loadProfile() {
    const session = readSessionSave();
    return {
        handbook: session.selectedHandbook,
        profile: session.selectedProfile,
    };
}


/**
 * Loads global state values from a saved profile.
 */
export function loadProfileStates() {
    const {profile} = loadProfile();
    if (profile) {
        setProfileStates(profile);
    }
}

/**
 * Applies profile data to global state variables.
 * @param {string | null | undefined} profile - Selected profile.
 */
export function setProfileStates(profile) {
    profileSetting.profile = profile;

    if (!profile) {
        profileModules.modules = [];
        profileChair.chairs = [];
        profileSection.sections = {};
        return;
    }

    profileModules.modules = getProfileAddition(profile, "modules");
    profileChair.chairs = getUniqueGroup(profileModules.modules, "chair");
    profileSection.sections = groupModuleSections(profileModules.modules);
}

/**
 * Saves visibility and acknowledgement state of an information box for a given scope.
 * @param {string} scope - Scope of the information box i.e., `settings`, `moduleCatalogue`.
 * @param {Object} stateBatch - Information box state batch.
 */
export function saveInfoboxes(scope, stateBatch) {
    if (!scope || !stateBatch) {
        return;
    }

    const infoboxVisibility = stateBatch.infoboxVisibility;
    let session = readSessionSave();

    session.infoboxes[scope] = {
        showInfobox: Boolean(stateBatch.showInfobox?.state),
        infoboxUnderstood: [...(stateBatch.infoboxUnderstood ?? [])],
        infoboxVisibility,
    };

    saveSession(session);
}

/**
 * Loads saved information boxes for a scope into the provided state batch.
 * Remark: This function was created by GitHub Copilot except for variable namings and the declaration of the const session.
 * @param {string} scope - Scope of information boxes i.e., `settings`, `moduleCatalogue`.
 * @param {Object} stateBatch - Target information box state batch.
 */
export function loadInfoboxes(scope, stateBatch) {
    if (!scope || !stateBatch) {
        return;
    }

    const session = readSessionSave().infoboxes?.[scope];

    if (!session) {
        return;
    }

    stateBatch.infoboxUnderstood.splice(
        0,
        stateBatch.infoboxUnderstood.length,
        ...(session.infoboxUnderstood ?? []),
    );

    Object.keys(stateBatch.infoboxVisibility).forEach((key) => {
        const savedVisibility = session.infoboxVisibility?.[key];
        if (typeof savedVisibility === "boolean") {
            stateBatch.infoboxVisibility[key] = savedVisibility;
        }
    });

    stateBatch.showInfobox.state =
        stateBatch.infoboxUnderstood.length > 0
            ? true
            : Boolean(session.showInfobox);
}

/**
 * Saves the search history for a given scope.
 * @param {string} scope - Scope of search history i.e., "module", "application".
 * @param {string[]} history - Search history to save.
 */
export function saveSearchHistory(scope, history) {
    if (!scope || !history) {
        return;
    }

    const session = readSessionSave();
    session.searchHistories[scope] = history;
    saveSession(session);
}

/**
 * Loads the saved search history for a given scope.
 * @param {string} scope - Scope of search history i.e., `module`, `application`.
 * @param {Array<string>} target - Target state to fill with loaded search history.
 */
export function loadSearchHistory(scope, target) {
    if (!scope || !target) {
        return;
    }

    const savedHistory = readSessionSave().searchHistories?.[scope];

    target.splice(0, target.length, ...savedHistory);
}