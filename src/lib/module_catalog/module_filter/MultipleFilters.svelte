<script>
    import Hoverable from "../../helper_modules/Hoverable.svelte";
    import {filterModules, isArrayGroupActive} from "./Filter.svelte.js";

    const summerTerms = ["term: 'SS, jährlich'", "term: 'WS, SS'"];
    const winterTerms = ["term: 'WS, jährlich'", "term: 'WS, SS'"];
</script>

<h5>Mehere wählbar</h5>
<div class="fs-6 text-break my-2">
    Angebotssemester
    <div class="row">
        <div class="col">
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs={summerTerms}
                    isArrayActive={isArrayGroupActive(summerTerms)}
                    addClass="chip chip-interactive"
            >
                Sommer
            </Hoverable>
        </div>
        <div class="col">
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs={winterTerms}
                    isArrayActive={isArrayGroupActive(winterTerms)}
                    addClass="chip chip-interactive"
            >
                Winter
            </Hoverable>
        </div>
    </div>
    <div class="mt-2">Modulart</div>
    <div class="row">
        <div class="col">
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs="compulsory: 'Pflichtmodul'"
                    addClass="chip chip-interactive"
            >
                Pflichtmodul
            </Hoverable>
        </div>
        <div class="col">
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs="compulsory: 'Wahlmodul'"
                    addClass="chip chip-interactive"
            >
                Wahlmodul
            </Hoverable>
        </div>
    </div>
    <div class="mt-2">Sonstiges</div>
    <div class="row">
        <div class="col">
            <Hoverable
                    interactionFunction={filterModules}
                    functionArgs="hide in-progress and completed"
                    addClass="chip chip-interactive"
            >
                Belegte und bestandene verstecken
            </Hoverable>
        </div>
    </div>
</div>
