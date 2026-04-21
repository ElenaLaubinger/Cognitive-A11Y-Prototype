<script>
    import {selectedModule} from "../../management/StateManager.svelte.js";
</script>

<div class="card card-highlighter s-text p-3 mt-3">
    <div class="row my-2">
        <div class="col">Modulverantwortl.</div>
        <div class="col">
            {#each selectedModule.module.responsible as teacher (teacher)}
                {Object.values(teacher).join(" ")}
            {/each}
        </div>
        <div class="col">Lehrstuhl</div>
        <div class="col">
            {selectedModule.module.chair}
        </div>
    </div>
    <div class="row my-2">
        <div class="col">Angebotshäufigkeit</div>
        <div class="col">
            {selectedModule.module.term}
        </div>
        <div class="col">Moduldauer</div>
        <div class="col">
            {selectedModule.module.duration} Semester
        </div>
    </div>
    <div class="row my-2">
        <div class="col">Empfohlenes Semester</div>
        <div class="col">
            {selectedModule.module.recTerm}
        </div>
        <div class="col">Modulart</div>
        <div class="col">
            {#if selectedModule.module.compulsory === "Pflichtmodul"}
                <div class="chip compulsory">Pflichtmodul</div>
            {:else}
                <div class="chip additional">Wahlmodul</div>
            {/if}
        </div>
    </div>
    <div class="row my-2">
        <div class="col">Modulgruppe</div>
        <div class="col">
            {selectedModule.module.subsection}
        </div>
        <div class="col"></div>
        <div class="col"></div>
    </div>
</div>
