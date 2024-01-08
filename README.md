# FRC Web Components

FRC Web Components (FWC) is a web-based dashboard used for the [FIRST Robotics Competition (FRC)](https://www.firstinspires.org/robotics/frc).

![dashboard image](./docs/images/dashboard.png)

FWC can be either installed as a standalone application, or as a javascript package for custom dashboard solutions.

## Installation

The standalone Tauri application that wraps around FWC can be installed here: [https://github.com/frc-web-components/app/releases](https://github.com/frc-web-components/app/releases)

To install using npm:

```bash
npm i @frc-web-components/fwc@latest
```

FWC can also be installed as a script and included directly into an HTML page. Script can be downloaded from the [releases](https://github.com/frc-web-components/frc-web-components/releases) page.

## Try it out!

A live version of the application can be viewed here: [https://frc-web-components.github.io/dashboard/](https://frc-web-components.github.io/dashboard/)

## Documentation

- [Component documentation](https://frc-web-components.github.io/storybook) - Component examples and documentation
- [Dashboard Interface](/docs/dashboard.md) - Learn how to use the FWC dashboard app
- [Plugin Development](/docs/plugins.md) - Documentation on FWC dashboard plugin development.
- [Lit plugin example](/examples/lit-plugin/README.md) - An example plugin using the lit template from the `create-fwc` cli tool.
- [React plugin example](/examples/react-plugin/README.md) - An example plugin using the react template from the `create-fwc` cli tool.
- [Svelte plugin example](/examples/svelte-plugin/README.md) - An example plugin using the svelte template from the `create-fwc` cli tool.
