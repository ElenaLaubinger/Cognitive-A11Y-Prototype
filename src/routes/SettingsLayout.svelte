<script>
    import Select, {Option} from "@smui/select";
    import UnderstoodBtn from "../lib/helper_modules/UnderstoodBtn.svelte";
    import {
        filterActive,
        searchActive,
    } from "../lib/management/StateManager.svelte.js";
    import {
        flattenedData,
        getUniqueGroup,
    } from "../lib/management/DataProcessor.svelte.js";
    import {resetFilters} from "../lib/module_catalog/module_filter/Filter.svelte";
    import {resetSearch} from "../lib/search/module_search/ModuleSearch.svelte.js";
    import {onMount} from "svelte";
    import InfoboxSpace from "../lib/helper_modules/InfoboxSpace.svelte";
    import {handleUnderstood} from "../lib/management/SharedFunctions.svelte.js";
    import Hoverable from "../lib/helper_modules/Hoverable.svelte";
    import {
        setProfileStates,
        loadInfoboxes,
        loadProfile,
        saveInfoboxes,
        saveProfileValues,
    } from "../lib/management/Persistence.svelte.js";

    // Local states and variables for settings view and data management
    let settingsView = $state("settingOne");
    let handbookData = [flattenedData.handbook];
    let profileData = getUniqueGroup(flattenedData.modules, "profile");
    let dataLoaded = $state(false);
    let handbook = $state([]);
    let handbookValue = $state("");
    let profiles = $state([]);
    let profileValue = $state("");
    let success = $state(false);

    // Information box state management
    let showInfobox = $state({state: false});
    let infoboxUnderstood = $state([]);
    let infoboxVisibility = $state({
        introduction: true,
    });
    const batch = {
        showInfobox,
        infoboxUnderstood,
        infoboxVisibility,
    };

    function changeSettingsView(view) {
        settingsView = view;
    }

    function setHandbook(data) {
        handbook = data.map((element) => element.name);
        dataLoaded = true;
    }

    function setProfile(data) {
        profiles = data;
    }

    function updateProfile() {
        if (profileValue && handbookValue) {
            setProfileStates(profileValue);
            saveProfileValues(handbookValue, profileValue);

            if (filterActive.state || searchActive.state) {
                // If filters or search are still active, reset them
                resetFilters();
                resetSearch();
            }

            success = true;
        }
    }

    onMount(() => {
        // Initially set handbook data when the component mounts
        setHandbook(handbookData);

        // Load saved profile data and information box state if available.
        const savedProfile = loadProfile();
        if (savedProfile.handbook) {
            handbookValue = savedProfile.handbook;
        }
        if (savedProfile.profile) {
            profileValue = savedProfile.profile;
            setProfileStates(savedProfile.profile);
        }
        loadInfoboxes("settings", batch);
    });

    $effect(() => {
        // If a handbook is selected, set profile data for that handbook
        if (handbookValue) {
            setProfile(profileData);
        }

        // Save information box state whenever it changes
        saveInfoboxes("settings", batch);
    });
</script>

<div class="container">
    <div class="row align-items-center">
        <div class="col">
            <h1>Profileinstellungen</h1>
        </div>
        <div class="col-5">
            {#if showInfobox.state}
                <InfoboxSpace {batch}/>
            {/if}
        </div>
    </div>
    {#if infoboxVisibility.introduction}
        <div class="card info-box text-center">
            <p>
                Hier kannst du deine Nutzerdaten verwalten und deine Angaben
                konkretisieren, indem du beispielsweise Interessen angibst.
                Diese Daten helfen uns passende Module für dich herauszufinden
                und dir vorzuschlagen.
            </p>

            <UnderstoodBtn
                    onUnderstood={() =>
                    handleUnderstood("Einführung", "introduction", batch)}
            />
        </div>
    {/if}
    <div class="container">
        <div class="row">
            <div class="col-4 card p-4">
                <div>
                    <Hoverable
                            interactionFunction={changeSettingsView}
                            functionArgs="settingOne"
                    >
                        Moduleinstellungen
                    </Hoverable>
                    <hr/>
                    <Hoverable
                            interactionFunction={changeSettingsView}
                            functionArgs="settingTwo">Einstellungsblock 2
                    </Hoverable
                    >
                    <hr/>
                    <Hoverable
                            interactionFunction={changeSettingsView}
                            functionArgs="settingThree"
                    >Einstellungsblock 3
                    </Hoverable
                    >
                    <hr/>
                    <div class="d-flex">
                        <button class="btn btn-red m-1">
                            <i class="bi bi-trash ms-1"></i> Account löschen
                        </button>
                        <button class="btn m-1">
                            <i class="bi bi-gear-fill ms-1"></i> Import/ Export
                        </button>
                    </div>
                </div>
            </div>
            <div class="col card p-4">
                {#if settingsView === "settingOne"}
                    <h2>Moduleinstellungen</h2>
                    {#if dataLoaded}
                        <Select
                                class="mb-2"
                                variant="outlined"
                                bind:value={handbookValue}
                                label="Wähle deinen Studiengang"
                        >
                            {#each handbook as book (book)}
                                <Option value={book}>{book}</Option>
                            {/each}
                        </Select>
                        {#if profiles.length > 0}
                            <Select
                                    class="my-2"
                                    variant="outlined"
                                    bind:value={profileValue}
                                    label="Wähle dein Profil"
                            >
                                {#each profiles as profile (profile)}
                                    <Option value={profile}>{profile}</Option>
                                {/each}
                            </Select>
                        {/if}
                        <div class="text-center">
                            <button class="btn my-2" onclick={updateProfile}>
                                <i class="bi bi-floppy ms-1"></i> Speichern
                            </button
                            >
                        </div>
                        {#if success}
                            <div class="card info-box">
                                <p>
                                    Profil erfolgreich aktualisiert! <br/>
                                    Deine Einstellungen sind:<br/>
                                    <strong>{profileValue}</strong>
                                    im Studiengang
                                    <strong>{handbookValue}</strong>.<br/>
                                    Du kannst jetzt die Module deines Studiengangs
                                    im
                                    <a href="#/modulkatalog">Modulkatalog</a> sehen.
                                </p>
                            </div>
                        {/if}
                    {:else}
                        Daten werden geladen ...
                    {/if}
                {:else if settingsView === "settingTwo"}
                    <h2>Einstellungsblock 2</h2>
                {:else if settingsView === "settingThree"}
                    <h2>Einstellungsblock 3</h2>
                {/if}
            </div>
        </div>
    </div>
</div>
