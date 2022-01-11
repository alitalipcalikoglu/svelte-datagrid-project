<script>
  export let value;
  export let show;
</script>

{#if show}
  <div class="search-wrapper">
    <label for="search"> Tabloda Ara </label>
    <input type="search" id="search" bind:value />
  </div>
{/if}

<style lang="scss">
  @import './_search.scss';
</style>
