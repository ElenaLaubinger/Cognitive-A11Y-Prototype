<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";
    import {getProfileAddition} from "../../management/DataProcessor.svelte";
    import {
        profileSection,
        profileSetting,
    } from "../../management/StateManager.svelte.js";
    import {filterModules} from "./Filter.svelte.js";

    let openSection = {};
    let profileEcts = getProfileAddition(profileSetting.profile, "ects");

    function toggleSection(section) {
        openSection = {
            [section]: !openSection[section],
        };
        if (Object.values(openSection).includes(true)) {
            const keys = Object.keys(openSection);
            for (const key of keys) {
                if (key !== section && openSection[key]) {
                    openSection[key] = false;
                }
            }
        }
    }
</script>

{#each Object.entries(profileSection.sections) as [section, subsections] (section)}
    <div class="fs-6 text-break">
        {#if subsections.length > 0}
            <Hoverable
                    addClass="row"
                    interactionFunction={toggleSection}
                    functionArgs={section}
            >
                <div class="col">
                    <i
                            class={"bi " +
                            (openSection[section]
                                ? "bi-chevron-down"
                                : "bi-chevron-right")}
                    ></i>
                    {section}
                </div>
            </Hoverable>
            {#if openSection[section]}
                {#each subsections as subsection (subsection)}
                    <Hoverable
                            addClass="row px-5 my-1"
                            interactionFunction={filterModules}
                            functionArgs={`subsection: '${subsection}'`}
                    >
                        {subsection}
                        {#each profileEcts as ects (ects)}
                            {#if ects.subsection === subsection}
                                <div class="row">
                                    <div class="col">
                                        {#if ects.ectsMin === ects.ectsMax}
                                            <div>
                                                <div class="chip ects">
                                                    {ects.ectsMin} ECTS
                                                </div>
                                            </div>
                                        {:else}
                                            <div>
                                                <div class="chip ects">
                                                    {ects.ectsMin} ECTS - {ects.ectsMax}
                                                    ECTS
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                    {#if ects.achievedEcts > 0}
                                        <div class="col">
                                            <div>
                                                <div class="chip ects-achieved">
                                                    {ects.achievedEcts} ECTS erreicht
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                    </Hoverable>
                {/each}
            {/if}
        {:else}
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs={`section: '${section}'`}
            >
                {section}
                {#each profileEcts as ects (ects)}
                    {#if ects.section === section && ects.subsection === section}
                        <div class="row">
                            <div class="col">
                                {#if ects.ectsMin === ects.ectsMax}
                                    <div>
                                        <div class="chip ects">
                                            {ects.ectsMin} ECTS
                                        </div>
                                    </div>
                                {:else}
                                    <div>
                                        <div class="chip ects">
                                            {ects.ectsMin} ECTS - {ects.ectsMax}
                                            ECTS
                                        </div>
                                    </div>
                                {/if}
                            </div>
                            {#if ects.achievedEcts > 0}
                                <div class="col">
                                    <div>
                                        <div class="chip ects-achieved">
                                            {ects.achievedEcts} ECTS erreicht
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </Hoverable>
        {/if}
        <hr/>
    </div>
{/each}