<!-- 
 @component ## UnderstoodBtn

 A component that provides a button to mark an information box as understood. Using this component ensures a consistent
 design and behavior across all boxes of the application.

 The component accepts the following props:
    - onUnderstood: A required function that will be called when the button is clicked.
 -->

<script>
    export let onUnderstood = () => {
    };
</script>

<div>
    <button class="btn" on:click={onUnderstood}>
        <i class="bi bi-hand-thumbs-up ms-1"></i>
        Verstanden
    </button>
</div>
