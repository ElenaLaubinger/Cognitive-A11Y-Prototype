<script lang="ts">
    import Tab, {Icon, Label} from "@smui/tab";
    import TabBar from "@smui/tab-bar";

    let tabs = [
        {
            icon: "bi-info-circle",
            label: "Details",
        },
        {
            icon: "bi-diagram-3",
            label: "Abhängigkeiten",
        },
        {
            icon: "bi-star",
            label: "Feedback",
        },
    ];
    let active = $state(tabs[0]);
</script>

<div class="bg-blue tab-border">
    <TabBar {tabs} key={(tab) => tab.label} bind:active>
        {#snippet tab(tab)}
            <Tab {tab}>
                <Icon class="bi {tab.icon}"/>
                <Label>{tab.label}</Label>
            </Tab>
        {/snippet}
    </TabBar>
</div>

<style>
    .tab-border {
        border-radius: var(--bs-border-radius) !important;
    }
</style>