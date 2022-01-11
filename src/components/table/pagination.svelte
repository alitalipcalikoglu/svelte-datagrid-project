<script>
  import { createEventDispatcher } from 'svelte';
  export let activePerPage;
  export let activePage;
  export let pages;
  export let table;
  export let show;
  export let bottom = undefined;

  const dispatch = createEventDispatcher();
</script>

{#if show}
  <div class="tools" class:bottom>
    <div class="show-per-page">
      <label>
        Her sayfada
        <select
          name="per-page"
          on:change={(e) => dispatch('changePerPage', e)}
          bind:value={activePerPage}
        >
          {#each table.pagination.perPageSelectOptions as option}
            <option value={option}>
              {option}
            </option>
          {/each}
        </select>
        kayıt göster
      </label>
    </div>
    {#if pages.length > 1}
      <div class="pagination">
        <label>
          Sayfa :
          <select
            name="page"
            on:change={(e) => dispatch('changePage', e)}
            bind:value={activePage}
          >
            {#each pages as option}
              <option value={option}>
                {option}
              </option>
            {/each}
          </select>
        </label>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @import './_pagination.scss';
</style>
