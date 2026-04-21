/**
 * This file contains the logic for filtering modules based on user input through filter buttons.
 *
 * Public functions:
 * - filterModules(): Filter coordinator.
 * - applyFilters(): Main filter function.
 * - resetFilters(): Resets all active filters without resetting the search.
 * - decideSameVal(): Helper function for array-based filters and UI chip highlighting.
 * - isArrayGroupActive(): UI helper for array-based chip highlighting.
 *
 * Remark: This file was created with the help of GitHub Copilot. The author created the initial filter functionality
 * for single and multifilters (lines 29 - 85), splitFilterTerm(), setFilterStatus() and resetFilters(). For array
 * filter functionality GitHub Copilot was used to create the basic code. The author then refactored the whole file.
 * Functions entirely or mostly done by the AI are highlighted below.
 */

import {SvelteSet} from "svelte/reactivity";
import {
    activeArrayFilters,
    activeFilters,
    activeTerms,
    filterActive,
    filteredModules,
    profileModules,
    searchActive
} from "../../management/StateManager.svelte.js";
import {searchModules} from "../../search/module_search/ModuleSearch.svelte.js";

/**
 * Coordinates filtering based on the provided filter term(s).
 * @param {string | string[]} filterTerm - A single filter term string or an array of terms.
 */
export function filterModules(filterTerm) {
    if (!filterTerm) return;

    // ["WS, SS", "WS, jährlich"], ["WS, SS", "SS, jährlich"] filters
    if (Array.isArray(filterTerm)) {
        handleArrayFilterTerms(filterTerm);
        setFilterStatus();
        return;
    }

    const singleFilters = new SvelteSet(["chair: ", "section: ", "subsection: "]);
    if (Array.from(singleFilters).some(prefix => filterTerm.startsWith(prefix))) {
        // Modulegroup or section/ subsection filters
        setSingleFilter(filterTerm, singleFilters);
    } else {
        setMultiFilter(filterTerm);
    }

    setFilterStatus();
}

/**
 * Toggles a single-select filter term.
 * @param {string} filterTerm - New single-select filter term.
 * @param {SvelteSet} singleFilters - Prefix definition of single filters.
 */
function setSingleFilter(filterTerm, singleFilters) {
    if (activeFilters.filters.includes(filterTerm)) {
        activeFilters.filters = activeFilters.filters.filter(activeItem => activeItem !== filterTerm);
        return;
    }

    const activeFilter = activeFilters.filters.find(
        activeItem => typeof activeItem === 'string' && Array.from(singleFilters).some(prefix => activeItem.startsWith(prefix))
    );
    if (activeFilter) {
        activeFilters.filters = activeFilters.filters.filter(activeItem => activeItem !== activeFilter);
    }

    activeFilters.filters = [...activeFilters.filters, filterTerm];
}

/**
 * Toggles a multi-select filter term.
 * @param {string} filterTerm - The term to toggle.
 */
function setMultiFilter(filterTerm) {
    if (activeFilters.filters.includes(filterTerm)) {
        activeFilters.filters = activeFilters.filters.filter(activeItem => activeItem !== filterTerm);
    } else {
        activeFilters.filters = [...activeFilters.filters, filterTerm];
    }
}

/**
 * Handles an incoming array of filter terms.
 * Remark: This function was mostly done by GitHub Copilot.
 * @param {string[]} filterTerms - Incoming filter term array.
 */
function handleArrayFilterTerms(filterTerms) {
    const filterType = splitFilterTerm(filterTerms[0], "type");
    const currentGroups = activeArrayFilters.groups[filterType] || [];
    const existingGroupIndex = currentGroups.findIndex(group =>
        decideSameVal(group, filterTerms)
    );
    const nextGroups = [...currentGroups];

    if (existingGroupIndex === -1) {
        nextGroups.push(filterTerms);
    } else {
        nextGroups.splice(existingGroupIndex, 1);
    }

    if (nextGroups.length === 0) {
        {
            const remainingGroups = {...activeArrayFilters.groups};
            delete remainingGroups[filterType];
            activeArrayFilters.groups = remainingGroups;
        }

        activeFilters.filters = activeFilters.filters.filter(activeItem => {
            if (!Array.isArray(activeItem) || activeItem.length === 0) return true;
            return splitFilterTerm(activeItem[0], "type") !== filterType;
        });
        return;
    }

    activeArrayFilters.groups = {
        ...activeArrayFilters.groups,
        [filterType]: nextGroups
    };

    const effectiveTerms = intersectArrays(nextGroups);
    updateArrayFilter(filterType, effectiveTerms);
}

/**
 * Splits a filter term into type and value parts.
 * @param {string} filterTerm - Raw filter term string.
 * @param {string | null} field - Part to be returned i.e., "type" or "value". Both if null.
 * @returns {{ type: string, value: string } | String} Splitted term parts.
 */
function splitFilterTerm(filterTerm, field = null) {
    let splitTerm = filterTerm.split(": ");

    switch (field) {
        case "type":
            return splitTerm[0];
        case "value":
            // "term: 'WS, SS'" -> "WS, SS"
            return splitTerm[1].replaceAll("'", "").trim();
        default:
            return {
                type: splitTerm[0],
                value: splitTerm[1]
            };
    }
}

/**
 * Compares two filter-term arrays for equal values.
 * @param {string[]} firstTerms - First filter term array.
 * @param {string[]} secondTerms - Second filter term array.
 * @returns {boolean} True if both arrays represent the same filter value set.
 */
export function decideSameVal(firstTerms, secondTerms) {
    if (firstTerms.length !== secondTerms.length) return false;
    if (splitFilterTerm(firstTerms[0], "type") !== splitFilterTerm(secondTerms[0], "type")) return false;

    const firstValues = new SvelteSet(firstTerms.map(term => splitFilterTerm(term, "value")));
    const secondValues = new SvelteSet(secondTerms.map(term => splitFilterTerm(term, "value")));
    if (firstValues.size !== secondValues.size) return false;

    return [...firstValues].every(value => secondValues.has(value));
}

/**
 * Intersects multiple arrays of same-type filter terms.
 * Remark: This function was mostly done by GitHub Copilot.
 * @param {string[][]} filterTermGroups - Array of same-type filter term arrays.
 * @returns {string[]} Intersected terms.
 */
function intersectArrays(filterTermGroups) {
    if (filterTermGroups.length === 0) return [];

    return filterTermGroups.slice(1).reduce((currentIntersection, nextGroup) => {
            const filterType = splitFilterTerm(currentIntersection[0] ?? nextGroup[0] ?? "", "type");

            const existingValues = new Set(currentIntersection.map(current => splitFilterTerm(current, "value")));
            const incomingValues = new Set(nextGroup.map(group => splitFilterTerm(group, "value")));

            const intersectedValues = [...existingValues].filter(value => incomingValues.has(value));
            return intersectedValues.map(value => `${filterType}: '${value}'`);
        },

        filterTermGroups[0]
    );
}

/**
 * Inserts or updates the active array-filter entry of a given type.
 * Remark: This function was mostly done by GitHub Copilot.
 * @param {string} filterType - Filter type to update.
 * @param {string[]} filterTerms - Effective terms for this type.
 */
function updateArrayFilter(filterType, filterTerms) {
    const existingArrayIndex = activeFilters.filters.findIndex(activeItem => {
        if (!Array.isArray(activeItem) || activeItem.length === 0) return false;
        return splitFilterTerm(activeItem[0], "type") === filterType;
    });

    if (existingArrayIndex === -1) {
        activeFilters.filters = [...activeFilters.filters, filterTerms];
        return;
    }

    activeFilters.filters = [
        ...activeFilters.filters.slice(0, existingArrayIndex),
        filterTerms,
        ...activeFilters.filters.slice(existingArrayIndex + 1)
    ];
}

/**
 * Sets up basic states and sources for filtering.
 */
function setFilterStatus() {
    if (activeFilters.filters.length === 0) {
        filteredModules.modules = [];
        filterActive.state = false;
        return;
    }

    const sourceModules = searchActive.state
        ? searchModules(activeTerms.term, "return", profileModules.modules)
        : profileModules.modules;

    filteredModules.modules = applyFilters(sourceModules);
    filterActive.state = true;
}

/**
 * Adds filters to given module data.
 * @param {Object[]} modules - Modules to be filtered.
 * @returns {Object[]} Filtered modules based on activeFilters.filters.
 */
export function applyFilters(modules) {
    if (!Array.isArray(activeFilters.filters) || activeFilters.filters.length === 0) {
        return modules;
    }

    let filtered = modules;

    activeFilters.filters.forEach(filter => {
        if (Array.isArray(filter)) {
            if (filter.length === 0) {
                filtered = [];
                return;
            }

            const filterType = splitFilterTerm(filter[0], "type");
            const filterValues = new SvelteSet(filter.map(value => splitFilterTerm(value, "value")));
            filtered = filtered.filter(module => filterValues.has(module[filterType]));
            return;
        }

        if (filter === "hide in-progress and completed") {
            filtered = filtered.filter(module =>
                module.status !== "in-progress" && module.status !== "completed"
            );
            return;
        }

        const filterType = splitFilterTerm(filter, "type");
        const filterValue = splitFilterTerm(filter, "value");
        filtered = filtered.filter(module => module[filterType] === filterValue);
    });

    return filtered;
}

/**
 * Returns whether a specific array-filter group is currently active.
 * @param {string[]} filterTerms - Array-filter group to check.
 * @returns {boolean} True if this exact group is selected.
 */
export function isArrayGroupActive(filterTerms) {
    if (!Array.isArray(filterTerms) || filterTerms.length === 0) return false;

    const filterType = splitFilterTerm(filterTerms[0], "type");
    const currentGroups = activeArrayFilters.groups[filterType] || [];

    return currentGroups.some(group => decideSameVal(group, filterTerms));
}

/**
 * Resets filters without resetting module search.
 */
export function resetFilters() {
    filterActive.state = false;
    activeArrayFilters.groups = {};
    activeFilters.filters = [];

    if (searchActive.state) {
        searchModules(activeTerms.term, "filter", profileModules.modules);
    } else {
        filteredModules.modules = [];
    }
}