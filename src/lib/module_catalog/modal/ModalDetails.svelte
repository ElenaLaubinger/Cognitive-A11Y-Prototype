<script>
    import {selectedModule} from "../../management/StateManager.svelte.js";
</script>

<div class="row my-4">
    <div class="col-4">Inhalte</div>
    <div class="col">{@html selectedModule.module.topics}</div>
</div>
<div class="row my-4">
    <div class="col-4">Lernziele</div>
    <div class="col">{@html selectedModule.module.goals}</div>
</div>
<div class="row my-4">
    <div class="col-4">Zusatzinformationen</div>
    <div class="col">{@html selectedModule.module.additionalInfo}</div>
</div>
<div class="row my-4">
    <div class="col-4">Arbeitsaufwand</div>
    <div class="col">{@html selectedModule.module.workload}</div>
</div>
{#if selectedModule.module.knowledge}
    <div class="row my-4">
        <div class="col-4">Vorkenntnisse</div>
        <div class="col">
            {#each selectedModule.module.knowledge as knowledge (knowledge.kId)}
                <div class="chip chip-interactive" role="button"
                     tabindex="0">{knowledge.name}</div>
            {/each}
        </div>
    </div>
{/if}
<div class="row my-4">
    <div class="col-4">Empfohlene Vorkenntnisse</div>
    <div class="col">{@html selectedModule.module.recKnowledge}</div>
</div>