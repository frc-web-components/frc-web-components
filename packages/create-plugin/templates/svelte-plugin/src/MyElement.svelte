<svelte:options customElement="my-svelte-element" />

<script lang="ts">
  import { getAssetUrl } from  '@frc-web-components/app';
  let { count = 0, setProperty } = $props();
</script>

<button onclick={() => setProperty('count', count + 1)}>
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
    width: 100%;
    height: 100%;
  }
</style>