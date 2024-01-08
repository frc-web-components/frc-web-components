<svelte:options customElement="my-svelte-element" />

<script lang="ts">
  import { getAssetUrl } from  '@frc-web-components/app';
  export let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  <img src={getAssetUrl('party.svg')} alt="party time" />
  Party Guests: {count}
</button>

<style>
  button {
    background: var(--my-svelte-element-background, cadetblue);
    color: var(--my-svelte-element-color, black);
    border: none;
    border-radius: 3px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>