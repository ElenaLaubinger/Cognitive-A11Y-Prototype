<script>
    import NavTabs from "./NavTabs.svelte";
    import SearchBar from "../search/SearchBar.svelte";
    import {location} from "svelte-spa-router";
    import {derived} from "svelte/store";
    import {switchRoute} from "../management/SharedFunctions.svelte.js";
    import Hoverable from "../helper_modules/Hoverable.svelte";

    const currentPath = location;
    let searchOpen = $state(false);
    let settingsOpen = $state(false);

    function toggleProfile() {
        settingsOpen = !settingsOpen;
    }

    function handleSettingsClick() {
        toggleProfile();
        switchRoute("/einstellungen");
    }

    function handleLogout() {
        toggleProfile();
        // Placeholder for logout functionality, out of scope for now
    }

    const isSettingsActive = derived(
        currentPath,
        ($currentPath) => $currentPath === "/einstellungen",
    );

    $effect(() => {
        if (settingsOpen) {
            document.querySelector(".profile-btn").classList.add("profileOpen");
        } else {
            document.querySelector(".profile-btn").classList.remove("profileOpen");
        }
    });
</script>

<nav
        class="navbar bg-blue my-0 p-0 px-3 d-flex align-items-center justify-content-between"
>
    <!-- Aligned left: Baula icon -->
    <div class="d-flex">
        <a href="#/">
            <img src="/assets/baulaIcon.png" alt="Baula Logo" id="baula-logo"/>
        </a>
    </div>
    <!-- Centered: Keyfunction tabs -->
    <div class="d-flex justify-content-center flex-grow-0 mx-auto">
        <NavTabs/>
    </div>
    <!-- Aligned right: Buttons for app search and profile -->
    <div class="d-flex gap-3">
        <SearchBar variant="icon-only" bind:isOpen={searchOpen}/>
        <button
                class="btn nav-btn profile-btn"
                onclick={() => toggleProfile()}
                class:is-active={$isSettingsActive}
        >
            <i
                    class={"bi " +
          (settingsOpen ? "bi-chevron-down" : "bi-chevron-right")}
            ></i>
            Einstellungen
        </button>
        {#if settingsOpen}
            <div class="card p-4 rounded profile-dropdown">
                <Hoverable interactionFunction={handleSettingsClick}>
                    Einstellungen
                </Hoverable>
                <hr/>
                <Hoverable interactionFunction={handleLogout}>Logout</Hoverable>
            </div>
        {/if}
    </div>
</nav>

<style>
    #baula-logo {
        width: 2.8em;
    }

    .btn.is-active {
        border: 2px solid white !important;
        font-weight: 800;
    }

    .profile-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        width: 180px;
    }
</style>
