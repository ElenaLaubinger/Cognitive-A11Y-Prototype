<script>
    import UnderstoodBtn from "../../helper_modules/UnderstoodBtn.svelte";
    import ModuleCard from "./ModuleCard.svelte";
    import {
        profileModules,
        filterActive,
        filteredModules,
        searchActive,
    } from "../../management/StateManager.svelte.js";
    import ModuleModalLayout from "../../../routes/ModuleModalLayout.svelte";
    import {
        modalOpen,
        selectedModule,
    } from "../../management/StateManager.svelte.js";

    export let isVisible = true;
    export let onUnderstood = () => {
    };

    function selectModule(data) {
        modalOpen.state = true;
        selectedModule.module = data;
    }
</script>

<h2>Modulübersicht</h2>
{#if isVisible}
    <div class="card info-box">
        <p class="text-start">
            Symbolerklärung:<br/>
            <i class="bi bi-question-circle text-dark"></i> Modul ist nicht belegt
            <br/>
            <i class="bi bi-dash text-muted"></i> Modul ist belegt <br/>
            <i class="bi bi-check text-success"></i> Modul ist abgeschlossen
        </p>
        <div class="text-center">
            <UnderstoodBtn {onUnderstood}/>
        </div>
    </div>
{/if}
{#if !filterActive.state && !searchActive.state}
    {#each profileModules.modules as data (data.id)}
        <ModuleCard {data} onSelect={selectModule}/>
    {/each}
{:else if filterActive.state || searchActive.state}
    {#if filteredModules.modules.length === 0}
        <p class="text-center">Keine Module gefunden</p>
    {:else}
        {#each filteredModules.modules as data (data.id)}
            <ModuleCard {data} onSelect={selectModule}/>
        {/each}
    {/if}
{/if}
{#if selectedModule.module}
    <ModuleModalLayout/>
{/if}
