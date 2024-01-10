<script lang="ts">
  import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
  import { customDarkTheme, customLightTheme } from "../themes";

  const themes = new DashboardThemes();
  themes.addThemeRules("dark", { ...darkTheme, ...customDarkTheme });
  themes.addThemeRules("light", customLightTheme);

  let theme = "light";

  function updateTheme(newTheme: string) {
    theme = newTheme;
    themes.setTheme(document.body, theme);
  }

  updateTheme("light");
</script>

<div class="theme-chooser">
  <label>
    <input
      type="radio"
      name="theme-chooser"
      on:click={() => {
        updateTheme("light");
      }}
      checked={theme === "light"}
    />{" "}
    Light Theme
  </label>
  <label>
    <input
      type="radio"
      name="theme-chooser"
      on:click={() => {
        updateTheme("dark");
      }}
      checked={theme === "dark"}
    />{" "}
    Dark Theme
  </label>
</div>
