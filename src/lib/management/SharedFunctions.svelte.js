/**
 * This file contains functions that are used by components that aren't directly related to each other.
 */

import {push} from "svelte-spa-router";

/**
 * Navigates to the specified route.
 * @param {string} targetRoute - The route to navigate to.
 */
export function switchRoute(targetRoute) {
    push(targetRoute);
}

/**
 * Handles an information box that is marked as understood by the user.
 * @param {string} name - The name of the information box that is being marked as understood.
 * @param {string} visibilityKey - The key that is used to store the visibility of the information box in the stateBatch.
 * @param {object} stateBatch - The stateBatch object that is used to store the information about which information boxes have been marked as understood.
 */
export function handleUnderstood(name, visibilityKey, stateBatch) {
    stateBatch.infoboxVisibility[visibilityKey] = false;
    stateBatch.infoboxUnderstood.push({name, key: visibilityKey});
    stateBatch.showInfobox.state = true;
}

/**
 * Reopens an information box that has been previously marked as understood by the user.
 * The box will be displayed again and its visibility will be set to true.
 * If no other boxes had been marked as understood, the information box space will be hidden again.
 * @param {string} name - The name of the information box that is being reopened.
 * @param {object} stateBatch - An object that contains all relevant states related to visibility and management of the information box.
 */
export function reopenInfoBox(name, stateBatch) {
    const infoKey = stateBatch.infoboxUnderstood.find(item => item.name === name)?.key;
    const index = stateBatch.infoboxUnderstood.findIndex(item => item.name === name);

    stateBatch.infoboxVisibility[infoKey] = true;

    if (index > -1) {
        stateBatch.infoboxUnderstood.splice(index, 1);
    }
    if (stateBatch.infoboxUnderstood.length === 0) {
        stateBatch.showInfobox.state = false;
    }
}