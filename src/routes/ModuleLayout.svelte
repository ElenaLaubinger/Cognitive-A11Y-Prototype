<script>
    import {onMount} from "svelte";
    import Introduction from "../lib/module_catalog/Introduction.svelte";
    import SearchBar from "../lib/search/SearchBar.svelte";
    import ModuleCardSpace from "../lib/module_catalog/module_overview/ModuleCardSpace.svelte";
    import FilterContainer from "../lib/module_catalog/module_filter/FilterContainer.svelte";
    import FilterButton from "../lib/module_catalog/module_filter/FilterButton.svelte";
    import {
        filterVisible,
        profileSetting,
    } from "../lib/management/StateManager.svelte.js";
    import {handleUnderstood} from "../lib/management/SharedFunctions.svelte.js";
    import InfoboxSpace from "../lib/helper_modules/InfoboxSpace.svelte";
    import {
        loadInfoboxes,
        saveInfoboxes,
    } from "../lib/management/Persistence.svelte.js";

    let showInfobox = $state({state: false});
    let infoboxUnderstood = $state([]);
    let infoboxVisibility = $state({
        introduction: true,
        symbolExplanation: true,
    });
    const batch = {
        showInfobox,
        infoboxUnderstood,
        infoboxVisibility,
    };

    onMount(() => {
        loadInfoboxes("moduleCatalogue", batch);
    });

    $effect(() => {
        saveInfoboxes("moduleCatalogue", batch);
    });
</script>

<div class="container">
    <div class="row align-items-center">
        <div class="col">
            <h1>Modulkatalog</h1>
        </div>
        <div class="col-5">
            {#if showInfobox.state}
                <InfoboxSpace {batch}/>
            {/if}
        </div>
    </div>
</div>
{#if profileSetting.profile}
    <div class="container text-center mb-5">
        <div class="row align-items-center">
            <div class="col">
                <Introduction
                        isVisible={infoboxVisibility.introduction}
                        onUnderstood={() =>
                        handleUnderstood(
                            "Einführung",
                            "introduction",
                            batch,
                        )}
                />
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col">
                <SearchBar variant="full"/>
            </div>
        </div>
        <div class="row">
            {#if filterVisible.state === true}
                <div class="col-lg-4 text-start order-lg-1 order-1">
                    <FilterContainer/>
                </div>
            {:else}
                <div class="col-lg-auto">
                    <FilterButton/>
                </div>
            {/if}
            <div class="col order-lg-3 order-3 m-4">
                <ModuleCardSpace
                        isVisible={infoboxVisibility.symbolExplanation}
                        onUnderstood={() =>
                        handleUnderstood(
                            "Symbolerklärung",
                            "symbolExplanation",
                            batch,
                        )}
                />
            </div>
        </div>
    </div>
{:else}
    <div class="card info-box text-center">
        <p>
            Hier wird der Modulkatalog angezeigt, wenn du angemeldet bist. <br
        />
            Gehe zuerst zu <a href="#/einstellungen">Profil</a>, um deine
            Profildaten einzustellen.
        </p>
    </div>
{/if}
