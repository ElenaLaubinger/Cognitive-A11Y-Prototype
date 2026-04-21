<!-- 
 @component ## InfoboxSpace

 A component that provides a space for displaying information boxes that have been understood.
 
 The component accepts the following props:
    - batch: A required object that contains all relevant states related to visibility and management of information boxes
 -->

<script>
    import {reopenInfoBox} from "../management/SharedFunctions.svelte.js";

    export let batch;

    let spaceVisible = false;
</script>

{#if spaceVisible}
    <div class="card info-box">
        <div class="mb-3">
            <button
                    class="btn position-relative"
                    onclick={() => (spaceVisible = !spaceVisible)}
            >
                <i class="ms-1 bi bi-chevron-double-right"></i>
                Infoboxen
                {#if batch.infoboxUnderstood.length > 0}
                    <span
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn-red"
                    >{batch.infoboxUnderstood.length}</span
                    >
                {/if}
            </button>
        </div>

        <p>
            Hier werden bestätigte Infoboxen angezeigt & können bei Bedarf
            erneut angezeigt werden.
        </p>
        {#each batch.infoboxUnderstood as info (info.name)}
            <button
                    class="btn mb-1"
                    onclick={(e) => {
                    e.preventDefault();
                    reopenInfoBox(info.name, batch);
                }}><i class="bi bi-arrow-clockwise ms-1"></i>{info.name}</button
            >
        {/each}
    </div>
{:else}
    <div class="text-end">
        <button
                class="btn position-relative"
                onclick={() => (spaceVisible = !spaceVisible)}
        >
            <i class="ms-1 bi bi-chevron-double-left"></i>
            Infoboxen
            {#if batch.infoboxUnderstood.length > 0}
                <span
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn-red"
                >{batch.infoboxUnderstood.length}</span
                >
            {/if}
        </button>
    </div>
{/if}
