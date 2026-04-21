<script lang="ts">
    import Tab, {Icon, Label} from "@smui/tab";
    import TabBar from "@smui/tab-bar";
    import {push, location} from "svelte-spa-router";
    import {derived} from "svelte/store";

    let tabs = [
        {
            icon: "bi-person-vcard",
            label: "Dashboard",
            path: "/",
        },
        {
            icon: "bi-book",
            label: "Module",
            path: "/modulkatalog",
        },
    ];

    let active = $state(tabs[0]);
    const currentPath = location;

    const activeTab = derived(currentPath, ($currentPath) => {
        return tabs.find((tab) => tab.path === $currentPath) ?? null;
    });

    activeTab.subscribe((value) => {
        active = value;
    });

    $effect(() => {
        if (active && active.path && active.path !== $currentPath) {
            push(active.path);
        }
    });
</script>

{#if $activeTab != null}
    <TabBar {tabs} key={(tab) => tab.label} bind:active>
        {#snippet tab(tab)}
            <Tab {tab}>
                <Icon class="bi {tab.icon}"/>
                <Label>{tab.label}</Label>
            </Tab>
        {/snippet}
    </TabBar>
{/if}
{#if $activeTab === null}
    <TabBar {tabs} key={(tab) => tab.label} bind:active>
        {#snippet tab(tab)}
            <Tab
                    {tab}
            >
                <Icon class="bi {tab.icon}"/>
                <Label>{tab.label}</Label>
            </Tab>
        {/snippet}
    </TabBar>
{/if}
