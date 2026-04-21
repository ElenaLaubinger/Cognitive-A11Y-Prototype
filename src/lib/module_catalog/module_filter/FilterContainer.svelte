<script>
    import FilterButton from "./FilterButton.svelte";
    import GroupedFilters from "./GroupedFilters.svelte";
    import MultipleFilters from "./MultipleFilters.svelte";
    import {filterActive} from "../../management/StateManager.svelte.js";
    import {resetFilters} from "./Filter.svelte.js";
</script>

<div class="card p-4 mb-4">
    <div class="row">
        <div class="col">
            <h2>Filter</h2>
        </div>
        <div class="col text-end">
            <div class="filter-actions flex-column">
                <div class="d-none d-lg-inline">
                    <FilterButton/>
                </div>
                {#if filterActive.state}
                    <button class="btn mt-2" onclick={resetFilters}>
                        <i class="bi bi-x-lg ms-1"></i> Alle Filter zurücksetzen
                    </button>
                {/if}
            </div>
        </div>
    </div>
    <MultipleFilters/>
    <hr/>
    <GroupedFilters/>
    <div class="d-inline d-lg-none">
        <div class="col text-center">
            <FilterButton/>
        </div>
    </div>
</div>

<style>
    .filter-actions :global(.btn) {
        width: 100%;
    }
</style>
