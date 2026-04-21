/**
 * This file contains global states to be used across the whole application.
 * These states are not defined in the form of $state(value) to distinguish them from local states.
 * To read these states use variableName.stateName, e.g. profileSetting.profile.
 * To modify these states use variableName.stateName = newValue, e.g. profileSetting.profile = "Profil 1".
 */

// Control profile data
export const profileSetting = $state({profile: null});

// Data based on the selected profile
export const profileModules = $state({modules: []});
export const profileChair = $state({chairs: []});
export const profileSection = $state({sections: {}});

// Control filter mechanism
export const filterVisible = $state({state: true});
export const filterActive = $state({state: false});
export const activeFilters = $state({filters: []});
export const activeArrayFilters = $state({groups: {}});
export const filteredModules = $state({modules: []});

// Control search mechanism
export const searchActive = $state({state: false});
export const activeTerms = $state({term: ""});

// Control visibility of module modal
export const modalOpen = $state({state: false});

// Control the chosen module for the module modal
export const selectedModule = $state({module: null});