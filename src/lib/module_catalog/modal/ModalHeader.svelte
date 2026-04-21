<script>
    import {selectedModule} from "../../management/StateManager.svelte.js";

    export let closeModal;
</script>

<div class="d-flex justify-content-between align-items-center mb-2">
    <div class="justify-content-start">
        <h4 class="modal-title">
            {selectedModule.module.moduleAlias}: {selectedModule.module
            .moduleName}
        </h4>
        <div class="d-flex flex-row mb-2">
            <div class="chip ects ms-1">{selectedModule.module.ects} ETCS</div>
            {#if selectedModule.module.termInfo}
                <div class="chip additional">
                    {selectedModule.module.termInfo}
                </div>
            {/if}
        </div>
    </div>
    <button class="btn-close" aria-label="Close" on:click={closeModal}></button>
</div>
