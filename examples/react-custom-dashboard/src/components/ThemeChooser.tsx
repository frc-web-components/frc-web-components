import { useEffect, useState } from "react";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import { customDarkTheme, customLightTheme } from "../themes";

const themes = new DashboardThemes();
themes.addThemeRules("dark", { ...darkTheme, ...customDarkTheme });
themes.addThemeRules("light", customLightTheme);

function App() {
  const [theme, setTheme] = useState("light");

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    themes.setTheme(document.body, newTheme);
  };

  useEffect(() => {
    themes.setTheme(document.body, 'light');
  }, []);

  return (
    <div className="theme-chooser">
      <label>
        <input
          type="radio"
          name="theme-chooser"
          onClick={() => updateTheme("light")}
          checked={theme === "light"}
        />{" "}
        Light Theme
      </label>
      <label>
        <input
          type="radio"
          name="theme-chooser"
          onClick={() => updateTheme("dark")}
          checked={theme === "dark"}
        />{" "}
        Dark Theme
      </label>
    </div>
  );
}

export default App;
