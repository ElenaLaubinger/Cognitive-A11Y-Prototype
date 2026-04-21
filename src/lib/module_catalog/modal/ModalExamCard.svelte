<script>
    export let exam;
</script>

<div class="card card-highlighter s-text p-3 mt-3">
    <div class="row my-2">
        <div class="col">{exam.name}</div>
        <div class="col">
            {exam.description}
        </div>
    </div>
    <div class="row my-2">
        <div class="col"></div>
        <div class="col">
            <div class="row">
                <div class="col">
                    Prüfungsdauer: {exam.duration}
                </div>
                <div class="col">
                    Anteil an Modulnote: {exam.share}%
                </div>
            </div>
        </div>
    </div>
</div>
