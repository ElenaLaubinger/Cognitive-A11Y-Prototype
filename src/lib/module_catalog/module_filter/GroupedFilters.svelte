<script lang="ts">
    import Select, {Option} from "@smui/select";
    import ModuleGroup from "./ModuleGroup.svelte";
    import Chair from "./Chair.svelte";

    let filterGroup = ["Modulgruppe", "Lehrstuhl"];

    let value = $state("Modulgruppe");
</script>

<div class="row">
    <div class="col">
        <h5>Einer wählbar</h5>
    </div>
    <div class="col">
        <Select variant="outlined" bind:value label="Gruppieren nach...">
            {#each filterGroup as fGroup (fGroup)}
                <Option value={fGroup}>{fGroup}</Option>
            {/each}
        </Select>
    </div>
</div>
<div class="m-2 p-2">
    {#if value === "Modulgruppe"}
        <ModuleGroup/>
    {:else if value === "Lehrstuhl"}
        <Chair/>
    {/if}
</div>