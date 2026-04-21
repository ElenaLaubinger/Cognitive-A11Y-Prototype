<script>
    import {push} from "svelte-spa-router";

    function goHome() {
        push("/");
    }
</script>

<div class="container fs-6">
    <div class="row flex-column align-items-center text-center">
        <div class="col-md-6">
            <h1>404 - Seite nicht verfügbar</h1>
            <p>
                Upps... Du hast eine Seite aufgerufen, welche nicht vorhanden
                ist.
            </p>
        </div>
        <div class="col-md-6">
            <img
                    src="/assets/not_found.png"
                    alt="Studentin mit fragendem Ausdruck und einem Fenster mit 404 Anzeige."
                    class="w-50"
            />
            <p class="attribution text-center mt-2 s-text">
                Designed by: <a href="https://de.freepik.com/"
            >Freepik</a
            >
            </p>
        </div>
        <div class="col-md-6">
            <button class="btn" aria-label="Settings Button" onclick={goHome} tabindex="0"
            ><i class="bi bi-person-vcard ms-1"></i> Zurück zum Dashboard!
            </button>
        </div>
    </div>
</div>

<style>
    .w-50 {
        width: 50% !important;
    }
</style>
