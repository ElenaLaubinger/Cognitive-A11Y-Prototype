<script>
    import UnderstoodBtn from "../helper_modules/UnderstoodBtn.svelte";

    export let isVisible = true;
    export let onUnderstood = () => {
    };
</script>

{#if isVisible}
    <div class="card info-box">
        <p>
            Der Modulkatalog enthält das gesamte Modulangebot für deinen
            Studiengang. Die Such- und Filteroptionen helfen dir, gewünschte Module zu finden.
            Die ECTS Angabe bei den Modulgruppen zeigt dir, wie viele Module du für jede Modulgruppe
            tatsächlich belegen musst. Details zu dem jeweiligen Modul erhältst du,
            indem du auf eine Modulkarte klickst.<br/>
            <br/>
            <strong>Mit diesen drei Schritten kannst du ein Modul in deinem Studienplan einplanen:</strong><br/>
        </p>
        <div class="text-center">
            1. <img
                src="/assets/cardClick.png"
                alt="Klicke auf die Modulkarte"
                class="info-image"
        />
        </div>
        <div class="d-flex justify-content-center gap-4 my-3">
            2. <img
                src="/assets/modalScroll.png"
                alt="Scrolle nach unten"
                class="info-image"
        />

            3. <img
                src="/assets/modalPlan.png"
                alt="Plane das Modul"
                class="info-image"
        />
        </div>

        <UnderstoodBtn {onUnderstood}/>
    </div>
{/if}

<style>
    .info-image {
        width: 35%;
    }
</style>
