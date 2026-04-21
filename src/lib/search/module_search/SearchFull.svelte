<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";
    import {searchActive} from "../../management/StateManager.svelte.js";
    import {
        getModuleSuggestions,
        modSearchHistory,
        resetSearch,
    } from "./ModuleSearch.svelte.js";

    export let searchTerm;
    export let searchFocus;
    export let handleSearch;
    export let repeatSearch;

    $: suggestions = getModuleSuggestions(searchTerm);
</script>

<div class="card p-4 rounded search-panel">
    <h2>Modulsuche</h2>
    <form
            class="input-group rounded"
            onsubmit={(event) => handleSearch(event, "module")}
    >
        <input
                type="search"
                name="search"
                class="form-control rounded"
                placeholder="Suche nach Modulen"
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
        <button class="btn input-group-text" type="submit">
            <i class="bi bi-search ms-1"></i>
            Suchen
        </button>
    </form>
    {#if searchActive.state}
        <div class="d-inline mt-3">
            <button class="btn" onclick={resetSearch}>
                <i class="bi bi-x-lg ms-1"></i> Suche zurücksetzen
            </button>
        </div>
    {/if}
    {#if searchFocus}
        <div class="mt-3 search-suggestions">
            <div class="row">
                <div class="col border-end">
                    <h6>Suchvorschläge:</h6>
                    {#if suggestions.length === 0}
                        <div class="text-muted">
                            Tippe etwas ein, um Suchvorschläge zu erhalten.
                        </div>
                    {:else}
                        {#each suggestions as suggestion (suggestion)}
                            <Hoverable
                                    interactionFunction={repeatSearch}
                                    functionArgs={[suggestion, "module"]}
                            >{suggestion}
                            </Hoverable>
                        {/each}
                    {/if}
                </div>
                <div class="col">
                    <h6>Letzte Suchanfragen:</h6>
                    {#if modSearchHistory.length === 0}
                        <div class="text-muted">
                            Hier werden deine letzten Suchanfragen angezeigt.
                        </div>
                    {:else}
                        {#each modSearchHistory as term (term)}
                            <Hoverable
                                    interactionFunction={repeatSearch}
                                    functionArgs={[term, "module"]}
                            >{term}
                            </Hoverable>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
