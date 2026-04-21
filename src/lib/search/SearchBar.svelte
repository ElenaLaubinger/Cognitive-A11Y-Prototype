<script>
    import {searchApp} from "./app_search/ApplicationSearch.svelte.js";
    import {searchModules} from "./module_search/ModuleSearch.svelte.js";
    import SearchFull from "./module_search/SearchFull.svelte";
    import SearchIcon from "./app_search/SearchIcon.svelte";

    export let variant; // 'full' for module search or 'icon-only' for application search
    export let isOpen = null; // Only relevant for 'icon-only' variant
    let searchTerm = "";
    let searchFocus = false;

    function handleSearch(event, target) {
        event.preventDefault();
        coordinateScope(target);
    }

    function repeatSearch(searchArgs) {
        const [term, scope] = searchArgs;
        searchTerm = term;
        coordinateScope(scope);
    }

    function coordinateScope(scope) {
        if (scope === "module") {
            searchModules(searchTerm, "search");
        } else if (scope === "application") {
            searchApp(searchTerm);
        }
    }
</script>

{#if variant === "full"}
    <SearchFull
            bind:searchTerm
            bind:searchFocus
            {handleSearch}
            {repeatSearch}
    />
{:else if variant === "icon-only"}
    <SearchIcon
            bind:searchTerm
            bind:searchFocus
            bind:isOpen
            {handleSearch}
            {repeatSearch}
    />
{/if}
