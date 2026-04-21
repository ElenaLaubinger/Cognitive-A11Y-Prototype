/**
 * This file contains functions for the module search.
 *
 * Public functions:
 * - searchModules(): Main function of the module search.
 * - getModuleSuggestions(): Updates search suggestions for UI-responsiveness.
 * - resetSearch(): Resets module search without resetting filters.
 */

import {
    filteredModules,
    profileModules,
    filterActive,
    searchActive,
    activeTerms
} from "../../management/StateManager.svelte.js";
import {applyFilters} from "../../module_catalog/module_filter/Filter.svelte.js";
import {sanitizeValue, modifyHistory, getSuggestions} from "../SearchShared.svelte.js";
import {loadSearchHistory} from "../../management/Persistence.svelte.js";

export const modSearchHistory = $state([]);
const searchKeys = ["moduleAlias", "moduleName"];

// Load module search history if available.
loadSearchHistory("module", modSearchHistory);

/**
 * Searches modules based on the provided search term.
 * @param {string} searchTerm - The search term to search for.
 * @param {string} option - String of calling function to distinguish from other functions.
 * @param {Object[]} sourceModules - The module source from filters. Null if called from search modules.
 */
export function searchModules(searchTerm, option, sourceModules = null) {
    if (!searchTerm) return;

    if (option === "search") {
        activeTerms.term = searchTerm ?? "";
        searchActive.state = true;
        sourceModules = getSource();
        modifyHistory(sanitizeValue(searchTerm, false), modSearchHistory, "module");
    }

    const sanitizedTerm = sanitizeValue(searchTerm, true);

    // Remark: This part was done by GitHub Copilot.
    const matchTerm = module => {
        const searchableValues = searchKeys.map(searchKey => module?.[searchKey]);
        return searchableValues.some(value => sanitizeValue(value, true).includes(sanitizedTerm));
    };

    if (option === "return") {
        return sourceModules.filter(matchTerm);
    } else {
        filteredModules.modules = sourceModules.filter(matchTerm);
    }
}

/**
 * Returns the dataset for searching based on the current filter state.
 * @returns {Object[]} - The dataset for searching.
 */
function getSource() {
    return filterActive.state
        ? applyFilters(profileModules.modules)
        : profileModules.modules;
}

/**
 * Returns up to five dynamic suggestions based on the current user input.
 * Input constantly updates as the user types.
 * Remark: This function was done by GitHub Copilot.
 * @param {string} searchTerm - Current search input.
 * @returns {string[]} - Up to five suggestions.
 */
export function getModuleSuggestions(searchTerm) {
    const sourceModules = getSource();
    const candidateValues = sourceModules.flatMap((module) =>
        searchKeys.map((searchKey) => module?.[searchKey]),
    );

    return getSuggestions(candidateValues, searchTerm);
}

/**
 * Resets module search without resetting filters.
 */
export function resetSearch() {
    searchActive.state = false;
    activeTerms.term = "";

    if (filterActive.state) {
        filteredModules.modules = applyFilters(profileModules.modules);
    } else {
        filteredModules.modules = [];
    }
}