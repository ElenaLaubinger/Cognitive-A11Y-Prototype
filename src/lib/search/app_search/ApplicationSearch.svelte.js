/**
 * This file contains functions for the application-wide search.
 *
 * Public functions:
 * - searchApp(): Main function of the application-wide search.
 * - getAppSuggestions(): Updates search suggestions for UI-responsiveness.
 *
 * Remark: The basic structure of this file except for the lines 1 to 43 was created by GitHub Copilot.
 * Afterward the whole file was refactored by the author. Functions entirely done by the AI are highlighted below.
 */

import {sanitizeValue, modifyHistory, getSuggestions} from "../SearchShared.svelte.js";
import {loadSearchHistory} from "../../management/Persistence.svelte.js";
import dashboardLayoutSource from "../../../routes/DashboardLayout.svelte?raw";
import moduleLayoutSource from "../../../routes/ModuleLayout.svelte?raw";
import settingsLayoutSource from "../../../routes/SettingsLayout.svelte?raw";

export const appSearchHistory = $state([]);
export const appSearchText = $state({text: ""});
export const appSearchSum = $state([]);
export const appSearchSugg = $state([]);

// Load search history from session storage if available.
loadSearchHistory("application", appSearchHistory);

// Define route targets for application-wide search.
const routeConfigs = [
    {
        route: "#/",
        source: dashboardLayoutSource,
        baseLabels: ["dashboard"],
    },
    {
        route: "/modulkatalog",
        source: moduleLayoutSource,
        baseLabels: ["module"],
    },
    {
        route: "/einstellungen",
        source: settingsLayoutSource,
        baseLabels: ["einstellungen"],
    },
];
const searchable = routeConfigs.map((config) => {
    const h1Titles = extractH1(config.source);
    const title = h1Titles[0] || config.baseLabels[0] || config.route;

    return {
        route: config.route,
        title,
        labels: [config.baseLabels, h1Titles],
    };
});

/**
 * Extracts all h1 texts from a component.
 * Remark: This function was created by GitHub Copilot except for function and variable naming.
 * @param {string} source - The component source.
 * @returns {string[]} Extracted h1 texts.
 */
function extractH1(source) {
    const matches = [...source.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)];

    return matches
        .map((match) =>
            match[1].replaceAll(/<[^>]+>/g, "").replaceAll(/\s+/g, " ").trim(),
        )
        .filter(Boolean);
}

/**
 * Main application-wide search function.
 * @param {string} searchTerm - Value from the search input.
 */
export function searchApp(searchTerm) {
    if (!searchTerm) {
        appSearchText.text = "";
        appSearchSum.length = 0;
        return;
    }

    const safeHistory = sanitizeValue(searchTerm, false);
    modifyHistory(safeHistory, appSearchHistory, "application");

    const sanitized = sanitizeValue(searchTerm, true);
    const targets = matchPages(sanitized);
    appSearchSum.length = 0;
    appSearchSum.push(...targets);
    if (targets.length === 0) {
        appSearchText.text = "Keine Suchergebnisse gefunden.";
        return;
    }

    appSearchText.text = `${targets.length} mögliche${targets.length === 1 ? "s" : ""} Ziel${targets.length === 1 ? "" : "e"} gefunden:`;
}

/**
 * Finds matching pages for a given search term.
 * @param {string} searchTerm - Search term in lowercase.
 * @returns {Array<{route: string, title: string}>} Matching pages.
 */
function matchPages(searchTerm) {
    const matches = [];

    searchable.forEach((page) => {
        const match = page.labels.some((label) =>
            sanitizeValue(label, true).includes(searchTerm),
        );

        if (match) {
            matches.push(page);
        }
    });

    return [...matches].map((page) => ({
        route: page.route,
        title: page.title,
    }));
}

/**
 * Updates application-wide search suggestions.
 * @param {string} searchTerm - Value from the search input.
 */
export function getAppSuggestions(searchTerm) {
    const allLabels = searchable.flatMap((page) => page.labels);
    const suggestions = getSuggestions(allLabels, searchTerm);

    appSearchSugg.length = 0;
    appSearchSugg.push(...suggestions);
}