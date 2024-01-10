import "./MyElement.tsx";
import { addElements, addThemeRules } from "@frc-web-components/app";

addElements({
  "my-react-element": {
    dashboard: {
      displayName: "My React Element",
    },
    properties: {
      count: { type: "Number" },
    },
  },
}, 'My Plugin');

addThemeRules('dark', {
  '--my-react-element-background': 'cadetblue',
  '--my-react-element-color': 'black',
});

addThemeRules('light', {
  '--my-react-element-background': 'cornflowerblue',
  '--my-react-element-color': 'white',
});