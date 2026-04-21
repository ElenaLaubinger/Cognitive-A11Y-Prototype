/**
 * This file contains functions that are used by more than one search modules.
 */

import {saveSearchHistory} from "../management/Persistence.svelte";

/**
 * Sanitizes a given string.
 * @param {string} rawValue - The string to be sanitized.
 * @param {boolean} lowerCase - Whether to convert the sanitized string to lowercase.
 * @returns {string} The sanitized string.
 */
export function sanitizeValue(rawValue, lowerCase) {
    if (lowerCase) {
        return String(rawValue).toLowerCase().replaceAll(/[^a-z0-9\s]/g, "").trim();
    } else {
        return String(rawValue).replaceAll(/[^a-zA-Z0-9\s]/g, "").trim();
    }
}

/**
 * Modifies the provided history array by adding the given search term.
 * @param {string} searchTerm - The search term to be added.
 * @param {string[]} history - The history array.
 * @param {string} scope - The scope of the search (e.g., "module").
 */
export function modifyHistory(searchTerm, history, scope) {

    if (history.includes(searchTerm)) return;

    if (history.length >= 5) {
        history.shift();
    }

    history.push(searchTerm);
    saveSearchHistory(scope, history);
}

/**
 * Builds suggestions from candidate values.
 * Remark: This function was created by GitHub Copilot and refactored by the author.
 * @param {(string)[]} candidates - Candidates to evaluate as suggestions.
 * @param {string} searchTerm - Current user input.
 * @returns {string[]} Suggestion list.
 */
export function getSuggestions(candidates, searchTerm) {
    const sanitized = sanitizeValue(searchTerm, true);

    if (!sanitized) return [];

    const maxSuggestions = 5;
    const matches = [];

    candidates.forEach((value) => {
        const trimmedVal = String(value ?? "").trim();
        const displayed = sanitizeValue(trimmedVal, true);

        if (displayed.includes(sanitized)) {
            matches.push(trimmedVal);
        }
    });

    return matches.slice(0, maxSuggestions);
}