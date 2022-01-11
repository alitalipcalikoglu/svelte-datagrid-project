<script>
  export let button;
</script>

<span class="button-wrapper {button.event}" on:click>
  {#if button.icon}
    <span title={button.title || button.event} class="icon-button {button.icon}" />
  {:else}
    <span title={button.title || button.event} class="text-button">
      {button.text || 'unnamed'}
    </span>
  {/if}
</span>

<style lang="scss">
  @import '../../_configs/style/colors.scss';
  @import './_button.scss';
</style>
