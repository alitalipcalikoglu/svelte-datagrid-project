<script>
  import { createEventDispatcher } from 'svelte';
  export let menuElement = undefined;
  export let menuItems = undefined;
  export let show = undefined;

  const dispatch = createEventDispatcher();

  const handleItemClick = (eventName) => {
    dispatch('click', eventName);
  };
</script>

{#if menuItems && menuItems.length > 0}
  <div bind:this={menuElement} class:show class="context-menu">
    <ul>
      {#each menuItems as item}
        <li on:click={() => handleItemClick(item.event)}>
          {item.label}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style lang="scss">
  .context-menu {
    position: fixed;
    background-color: #f9f9f9;
    padding: 1em;
    border: 1px solid;
    display: none;
    border-radius: 5px;
    z-index: 5;
    &.show {
      display: block;
    }
    ul {
      display: grid;
      grid-auto-flow: row;
      gap: 1em;
      li {
        cursor: pointer;
        user-select: none;
        &:hover {
          color: rgba(255, 0, 0, 0.719);
        }
      }
    }
  }
</style>
