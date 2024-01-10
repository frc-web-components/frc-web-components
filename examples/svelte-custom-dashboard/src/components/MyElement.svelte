<script lang="ts">
  import "@frc-web-components/fwc/components";
  export let count = 0;
  export let onIncrement = (value: number) => {};

  const svgPath = 'm80-80 200-560 360 360L80-80Zm132-132 282-100-182-182-100 282Zm370-246-42-42 224-224q32-32 77-32t77 32l24 24-42 42-24-24q-14-14-35-14t-35 14L582-458ZM422-618l-42-42 24-24q14-14 14-34t-14-34l-26-26 42-42 26 26q32 32 32 76t-32 76l-24 24Zm80 80-42-42 144-144q14-14 14-35t-14-35l-64-64 42-42 64 64q32 32 32 77t-32 77L502-538Zm160 160-42-42 64-64q32-32 77-32t77 32l64 64-42 42-64-64q-14-14-35-14t-35 14l-64 64ZM212-212Z';

  const increment = () => {
    count += 1;
    onIncrement(count);
  };

</script>

<button on:click={increment}>
  <frc-icon color="pink" view-box="0 -960 960 960" svg-path={svgPath}  />
  Party Guests: {count}
</button>

<style>
  button {
    background: var(--my-element-background, cadetblue);
    color: var(--my-element-color, black);
    border: none;
    border-radius: 3px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>
