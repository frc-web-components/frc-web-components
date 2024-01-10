<script lang="ts">
  import { setNt4Context, getNt4Context } from "@frc-web-components/svelte";
  import ThemeChooser from "./components/ThemeChooser.svelte";
  import Dashboard from "./components/Dashboard.svelte";

  // Set robot IP address here
  setNt4Context('localhost');
</script>

<div class="App">
  <ThemeChooser />
  <Dashboard />
</div>
