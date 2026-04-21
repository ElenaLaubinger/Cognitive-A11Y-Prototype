<script>
    let links = ["Webseite der Uni Bamberg", "VC", "FlexNow"];
</script>

<div class="container">
    <h1>Quick Links</h1>
    <div class="card mb-2 p-3 rounded">
        {#each links as link (link)}
            <a href="#/links">{link}</a>
        {/each}
    </div>
</div>