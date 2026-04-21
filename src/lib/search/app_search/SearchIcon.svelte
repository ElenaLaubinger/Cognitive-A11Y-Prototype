<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";
    import {
        appSearchHistory,
        appSearchText,
        appSearchSum,
        appSearchSugg,
        getAppSuggestions,
    } from "./ApplicationSearch.svelte.js";
    import {switchRoute} from "../../management/SharedFunctions.svelte.js";

    export let searchTerm;
    export let searchFocus;
    export let isOpen;
    export let handleSearch;
    export let repeatSearch;

    function toggleSearch() {
        isOpen = !isOpen;
    }

    function handleSelect(event, route) {
        event.preventDefault();
        switchRoute(route);
        searchFocus = false;
        isOpen = false;
    }

    $: getAppSuggestions(searchTerm);
</script>

{#if isOpen}
    <button class="btn nav-btn isOpen" aria-label="Search Button" onclick={toggleSearch}>
        <i class="bi bi-chevron-down ms-1"></i>
        Suche
    </button>
    <div class="card p-4 rounded search-dropdown search-panel">
        <form
                class="input-group rounded"
                onsubmit={(event) => handleSearch(event, "application")}
        >
            <input
                    type="search"
                    name="search"
                    class="form-control rounded"
                    placeholder="Baula durchsuchen"
                    bind:value={searchTerm}
                    onfocus={() => (searchFocus = true)}
                    onblur={(event) => {
                    const nextFocusedElement = event.relatedTarget;
                    if (
                        nextFocusedElement instanceof HTMLElement &&
                        nextFocusedElement.closest(".search-panel")
                    )
                        return;
                    searchFocus = false;
                }}
            />
            <button class="input-group-text" type="submit">
                <i class="bi bi-search ms-1"></i>
                Suchen
            </button>
        </form>
        {#if searchFocus}
            <div class="mt-3">
                {#if appSearchText.text}
                    <h6>{appSearchText.text}</h6>
                {/if}
                {#each appSearchSum as summary (summary.route)}
                    <a
                            class="search-result-link d-block mb-1"
                            href={`#${summary.route}`}
                            onmousedown={(event) =>
                            handleSelect(event, summary.route)}
                    >
                        {summary.title || summary.route}
                    </a>
                {/each}
                <h6 class="mt-3">Suchvorschläge:</h6>
                {#if appSearchSugg.length === 0}
                    <div class="text-muted">
                        Tippe etwas ein, um Suchvorschläge zu erhalten.
                    </div>
                {:else}
                    {#each appSearchSugg as suggestion (suggestion)}
                        <Hoverable
                                interactionFunction={repeatSearch}
                                functionArgs={[suggestion, "application"]}
                        >{suggestion}
                        </Hoverable>
                    {/each}
                {/if}
                <h6 class="mt-3">Letzte Suchanfragen:</h6>
                {#if appSearchHistory.length === 0}
                    <div class="text-muted">
                        Hier werden deine letzten Suchanfragen angezeigt.
                    </div>
                {:else}
                    {#each appSearchHistory as term (term)}
                        <Hoverable
                                interactionFunction={repeatSearch}
                                functionArgs={[term, "application"]}
                        >{term}
                        </Hoverable>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
{:else}
    <button
            class="btn nav-btn"
            aria-label="Search Button"
            onclick={toggleSearch}
    >
        <i class="bi bi-chevron-right ms-1"></i>
        Suche
    </button>
{/if}

<style>
    .search-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        min-width: 300px;
        margin-top: 0.5rem;
    }

    .search-result-link {
        color: rgb(0, 124.8442408377, 207.35) !important;
        text-decoration: underline !important;
    }

    .isOpen {
        background-color: var(--fc-button-hover-bg-color) !important;
    }
</style>
