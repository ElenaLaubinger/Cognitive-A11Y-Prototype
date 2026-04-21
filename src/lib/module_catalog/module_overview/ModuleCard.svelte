<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";

    export let data;
    export let onSelect;
</script>

<Hoverable
        interactionFunction={onSelect}
        functionArgs={data}
        addClass="card mb-2 my-0 py-3 px-2"
>
    <div class="container text-center">
        <div class="row align-items-center">
            <!-- status icons -->
            <div class="col-1">
                <!-- Curstor style 'help' is used because native tooltips don't render instandly after hovering -->
                {#if data.status === "completed"}
                    <i
                            class="bi bi-check text-success"
                            title="Modul ist abgeschlossen"
                            style="cursor: help;"
                    ></i>
                {:else if data.status === "in-progress"}
                    <i
                            class="bi bi-dash text-muted"
                            title="Modul ist belegt"
                            style="cursor: help;"
                    ></i>
                {:else if data.status === "not-started"}
                    <i
                            class="bi bi-question-circle text-dark"
                            title="Modul ist nicht belegt"
                            style="cursor: help;"
                    ></i>
                {/if}
            </div>
            <!-- main module information -->
            <div class="col text-start">
                <div class="module-info-line">
                    {data.moduleAlias}: {data.moduleName}
                </div>
                <div class="chip additional">{data.subsection}</div>
                {#if data.compulsory === "Pflichtmodul"}
                    <div class="chip compulsory">Pflichtmodul</div>
                {/if}
            </div>
            <!-- side module information -->
            <div class="col-2 text-end">
                <div class="text-muted s-text">{data.term}</div>
                <div class="chip ects">{data.ects} ECTS</div>
            </div>
        </div>
    </div>
</Hoverable>

<style>
    .module-info-line {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        word-break: break-word;
    }
</style>
