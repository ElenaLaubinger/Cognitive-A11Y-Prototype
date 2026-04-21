<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";
    import {profileChair} from "../../management/StateManager.svelte.js";
    import {filterModules} from "./Filter.svelte.js";
</script>

{#each profileChair.chairs as chair (chair)}
    <div class="fs-6 text-break">
        <Hoverable interactionFunction={filterModules} functionArgs={`chair: '${chair}'`}>{chair}</Hoverable>
        <hr>
    </div>
{/each}
