<!--
 @component ## Breadcrumbs

 A component that provides up to two clickable Breadcrumb links and the current location.
 -->

<script lang="ts">
    import {writable, derived} from "svelte/store";
    import {location, push} from "svelte-spa-router";

    const pathNames: Record<string, string> = {
        "/": "Dashboard",
        "/dashboard": "Dashboard",
        "/modulkatalog": "Modulkatalog",
        "/einstellungen": "Einstellungen",
        "/links": "Quick Links",
    };

    const visitedPaths = writable<string[]>(["/"]);
    const currentPath = derived(location, ($location) => $location || "/");

    currentPath.subscribe((path) => manageLog(path));

    function handleClick(path: string, event: MouseEvent) {
        event.preventDefault();
        manageLog(path);
        push(path);
    }

    function manageLog(path: string) {
        visitedPaths.update((paths) => {
            const visited = paths.filter((p) => p !== path);
            visited.push(path);
            if (visited.length > 3) {
                visited.shift();
            }
            return visited;
        });
    }
</script>

<div aria-label="Breadcrumb" class="my-0 p-2 px-4 bg-blue s-text">
    <div class="d-flex">
        {#each $visitedPaths as path, i (path)}
            {#if i < $visitedPaths.length - 1}
                <a href={path} onclick={(e) => handleClick(path, e)}>
                    {pathNames[path] || path}
                </a> &nbsp; | &nbsp;
            {:else}
                <span aria-current="page" style="font-weight: bold;">
                    {pathNames[path] || path}
                </span>
            {/if}
        {/each}
    </div>
</div>
