<script>
    import {
        activeFilters,
        filterActive,
        filterVisible,
    } from "../../management/StateManager.svelte.js";
</script>

<div class="mt-1">
    <button
            class="btn position-relative"
            on:click={() => (filterVisible.state = !filterVisible.state)}
    >
        <!-- Icon set for small viewports -->
        <span class="d-inline d-lg-none">
            <i
                    class={"ms-1 bi " +
                    (filterVisible.state
                        ? "bi-chevron-double-up"
                        : "bi-chevron-double-down")}
            ></i>
        </span>
        <!-- Icon set for large viewports -->
        <span class="d-none d-lg-inline">
            <i
                    class={"ms-1 bi " +
                    (filterVisible.state
                        ? "bi-chevron-double-left"
                        : "bi-chevron-double-right")}
            ></i>
        </span>
        Filter
        {#if filterActive.state}
            <span
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn-red"
            >{activeFilters.filters.length}</span
            >
        {/if}
    </button>
</div>
