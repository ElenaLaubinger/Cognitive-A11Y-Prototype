<script>
    import ModalHeader from "../lib/module_catalog/modal/ModalHeader.svelte";
    import ModalTabs from "../lib/module_catalog/modal/ModalTabs.svelte";
    import ModalDetails from "../lib/module_catalog/modal/ModalDetails.svelte";
    import ModalOverview from "../lib/module_catalog/modal/ModalOverview.svelte";
    import ModalExamCard from "../lib/module_catalog/modal/ModalExamCard.svelte";
    import {
        modalOpen,
        selectedModule,
    } from "../lib/management/StateManager.svelte.js";
    import Hoverable from "../lib/helper_modules/Hoverable.svelte";
    import Select, {Option} from "@smui/select";

    let examOpen = $state(false);
    let plan = ["Studienplan 1", "Studienplan 2"];
    let value = $state("Studienplan 1");

    function toggleExam() {
        examOpen = !examOpen;
    }

    function closeModal() {
        modalOpen.state = false;
    }
</script>

{#if modalOpen.state}
    <div
            class="modal fade show d-block modal-style"
            tabindex="-1"
            role="dialog"
            onclick={() => (modalOpen.state = false)}
            onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                modalOpen.state = false;
            }
        }}
    >
        <div
                class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                role="dialog"
                tabindex="0"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
        >
            <div class="modal-content p-3">
                <div class="modal-body text-start">
                    <ModalHeader {closeModal}/>
                    <ModalTabs/>
                    <ModalOverview/>
                    <ModalDetails/>
                    <Hoverable
                            interactionFunction={toggleExam}
                            addClass="col-4 my-4"
                    >
                        {#if examOpen}
                            <i class="bi bi-chevron-down"></i>
                        {:else}
                            <i class="bi bi-chevron-right"></i>
                        {/if}
                        Prüfungen
                    </Hoverable>
                    {#if examOpen}
                        {#each selectedModule.module.exams as exam (exam.eId)}
                            <ModalExamCard {exam}/>
                        {/each}
                    {/if}
                    <div class="row mt-4">
                        <div class="col-4">
                            <Select
                                    variant="outlined"
                                    bind:value
                                    label="Einplanen in..."
                            >
                                {#each plan as p (p)}
                                    <Option value={p}>{p}</Option>
                                {/each}
                            </Select>
                        </div>
                        <div class="col">
                            <button class="btn">Einplanen</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-style {
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
