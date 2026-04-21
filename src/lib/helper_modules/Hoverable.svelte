<!-- 
 @component ## Hoverable

 A component that provides hoverable functionality to its child elements.
 Every hoverable element is clickable and keyboard accessible, allowing users to interact with it using both mouse and keyboard.
 
 The component accepts the following props:
    - interactionFunction: A required function that will be called when the element is clicked or activated via keyboard
    - functionArgs: Optional argument(s) that will be passed to the interactionFunction
    - isArrayActive: Optional indicator used to determine if the element should be highlighted as active
    - addClass: Optional string that adds additional CSS classes to the hoverable element
 -->

<script lang="ts">
    import type {Snippet} from "svelte";
    import {activeFilters} from "../management/StateManager.svelte.js";
    import {decideSameVal} from "../module_catalog/module_filter/Filter.svelte.js";

    // TypeScript is needed here because of runes-mode activated by $derived.
    let {
        interactionFunction,
        functionArgs,
        isArrayActive,
        addClass,
        children,
    }: {
        interactionFunction: (args?: string | string[]) => void;
        functionArgs?: string | string[];
        isArrayActive?: boolean;
        addClass?: string;
        children?: Snippet;
    } = $props();

    // Reactive variable to check if the element is currently active and thus to be highlighted
    let isRegularActive = $derived(
        (activeFilters.filters || []).some((filter) => {
            if (
                typeof filter === "string" &&
                typeof functionArgs === "string"
            ) {
                return filter === functionArgs;
            }
            if (Array.isArray(filter) && Array.isArray(functionArgs)) {
                return decideSameVal(filter, functionArgs);
            }
            return false;
        }),
    );

    // This is used for correctly highlighting array-based filters.
    let isActive = $derived(
        typeof isArrayActive === "boolean" ? isArrayActive : isRegularActive,
    );
</script>

<div
        class="hoverable {isActive ? 'isActive' : ''} {addClass}"
        role="button"
        tabindex="0"
        onclick={(e) => {
        e.preventDefault();
        interactionFunction(functionArgs);
    }}
        onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            interactionFunction(functionArgs);
        }
    }}
>
    {@render children?.()}
</div>
