<script>
    import Router from "svelte-spa-router";
    import {onMount} from "svelte";
    import Dashboard from "./routes/DashboardLayout.svelte";
    import ModuleCatalogue from "./routes/ModuleLayout.svelte";
    import Settings from "./routes/SettingsLayout.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import NavBar from "./lib/navbar/NavBar.svelte";
    import Breadcrumbs from "./lib/helper_modules/Breadcrumbs.svelte";
    import {loadProfileStates} from "./lib/management/Persistence.svelte.js";
    import AdditionalLinks from "./routes/AdditionalLinks.svelte";

    const routes = {
        "/": Dashboard,
        "/dashboard": Dashboard,
        "/modulkatalog": ModuleCatalogue,
        "/einstellungen": Settings,
        "/links": AdditionalLinks,
        "*": NotFound,
    };

    onMount(() => {
        // Load profile states if available.
        loadProfileStates();
    });
</script>

<header class="fixed-top">
    <NavBar/>
    <Breadcrumbs/>
</header>
<main class="vh-100-min">
    <Router {routes}/>
</main>
<footer class="bg-blue d-flex justify-content-center justify-content-sm-end pe-3">
    <a href="#/links">Quick Links</a>
</footer>

<style>
    main {
        padding-top: 6em;
    }

    .vh-100-min {
        min-height: 100vh;
    }

    footer {
        position: relative;
        bottom: 0;
        padding: 25px 0;
        font-size: 0.8rem;
    }
</style>
