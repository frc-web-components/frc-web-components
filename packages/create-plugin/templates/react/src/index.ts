import "./MyElement.tsx";
import { addElements } from "@frc-web-components/app";

addElements({
  "my-react-element": {
    dashboard: {
      displayName: "My React Element",
    },
    properties: {
      count: { type: "Number" },
    },
  },
});
