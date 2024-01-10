# FWC custom dashboard with React + TypeScript + Vite

This template should help get you started developing a custom FWC dashboard with React + Typescript + Vite.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Generating custom dashboard

FWC provides a cli tool which generates a sample custom dashboard that can be used to help get you started with writing your own:

```bash
$ npm init fwc@latest <name>
```

Note: You'll need <span class="title-ref">node</span> installed to run
the above command: <https://nodejs.org/en/download/>

To get started, open a terminal and enter in the following command:

```bash
$ npm init fwc@latest my-custom-dashboard
```

After being prompted with a few questions to help you get setup, the project will be created and installed. The cli tool provides templates to create custom dashboards using [react](https://react.dev/) or [svelte](https://svelte.dev/):

![image](./docs/creating-plugin.png)

## Installing

To install run the following command:

```bash
npm install
```

## Running

To run the dashboard in dev mode run the following command:

```bash
npm run dev
```

You should see the following in the terminal:

![image](./docs/running-in-dev.png)

The dashboard should launch automatically in the browser. If not, open it manually using link shown in the terminal. (http://localhost:5173 for me)

You should see the dashboard in the browser:

![image](./docs/custom-dashboard.png)

## Theming

The recommended way to do theming is using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

As an example suppose we want to back the `button` text color in the `MyElement` component in the `src/components` folder black. We could do this with the following css rule:

```css
color: black;
```

To make this rule themable change it to the following:

```css
color: var(--my-element-color, black);
```

`--my-element-color` is the CSS variable. CSS variables are prefixed with `--`. To ensure uniqueness and to prevent accidentally overwriting existing rules prepend your variable with the element name. `black` is the default value if a theme is not set.

Per theme rules can be added by modifying the `themes.ts` file located in the `src` folder:

```typescript
export const customLightTheme = {
  "--my-element-background": "cornflowerblue",
  "--my-element-color": "white",
};

export const customDarkTheme = {
  "--my-element-background": "cadetblue",
  "--my-element-color": "black",
};
```

## Connecting elements to NetworkTables with svelte stores

One method of connecting HTML and svelte elements to NetworkTables is through the `getEntry` function in the `@frc-web-components/svelte` package:

```typescript
import { getEntry } from "@frc-web-components/svelte";

let pose = getEntry(`/SmartDashboard/Field/Robot`, [0, 0, 0]);
```

`getEntry` returns a svelte writable store which sends and receives updates from an NT4 topic. The first parameter is the topic name and the second parameter is the default value. The above line will subscribe to the `/SmartDashboard/Field/Robot` topic. You can get the value as you would with any svelte store by prefixing it with `$`. For example:

```html
<frc-field-robot pose="{$pose}" />
```

The pose prop will be set to the current value of the `pose` store and will be updated whenever the topic changes.

To send updates call the `.setValue` function on the store. For example:

```typescript
let count = getEntry(`/dashboard/count`, 0);
count.setValue(5);
```

The above will update the `/dashboard/count` topic with the value `5`.

## Connecting elements to NetworkTables using `source` attributes

Elements shipped with FWC are able to be connected to NetworkTables by giving them a `source-key` attribute with a topic to subscribe to. For example:

```html
<frc-sendable-chooser
  source-key="/Shuffleboard/Autonomous/SendableChooser[0]"
/>
<frc-basic-fms-info source-key="/FMSInfo" />
```

This option is often far easier than connecting each element manually through their props/attributes using svelte stores. For example, to connect the Basic FMS Info component manually you would need to do this:

```typescript
<script lang="ts">
  import { getEntry } from "@frc-web-components/svelte";

  let matchType = getEntry(`/FMSInfo/MatchType`, 0);
  let matchNumber = getEntry(`/FMSInfo/MatchNumber`, 0);
  let eventName = getEntry(`/FMSInfo/EventName`, '');
  let fmsControlData = getEntry(`/FMSInfo/FMSControlData`, 0);
</script>

<frc-basic-fms-info
  match-type={$matchType}
  match-number={$matchNumber}
  event-name={$eventName}
  fms-control-data={$fmsControlData}
/>
```

That's a lot more code! Because of this using the `source` attribute approach is great for some components such as `Basic FMS Info` and `Sendable Chooser` where a lot of topics published into NetworkTables need to mapped to the componenent attributes/props.

> [!TIP]
> Using both methods of connecting elements can be used at the same time. For example: `<frc-gyro source-key="/gyro/angle" precision={$precision} />`. If the `/gyro/angle` topic is a number then that topic will be mapped to the `value` attribute on the `<frc-gyro>` element and precision will be connected to whatever topic the `precision` store is assigned.You should see the following in the terminal:

![image](./docs/running-in-dev.png)

The dashboard should launch automatically in the browser. If not, open it manually using link shown in the terminal. (http://localhost:5173 for me)

You should see the dashboard in the browser:

![image](./docs/dashboard.png)

From here you should be able to navigate to your component which you can add and test in the browser:

![image](./docs/nav-to-my-plugin.png)

## Building and importing into dashboard app

Before the plugin can be imported into the dashboard app the plugin must first be built. Run the following command to build

```bash
npm run build
```

A `plugin` folder should be generated:

![image](./docs/build-files.png)


> [!WARNING]  
> This folder should not modified manually since your changes will be overwritten whenever the build command is run.

Within the build file you'll find a few important files and folders:
- `index.js` which is the root javascript file which the dashboard app will import.
- `assets` folder which contains images and other static files that your plugin uses. These are copied over from the `public/assets` folder.
- `plugin.json` which contains metadata like the plugin name, description and version used by the dashboard app for display purposes.

To import the plugin open the app and click the `File > Plugins` menu item:

![image](./docs/plugin-file-menu.png)

This should open the plugins dialog:

![image](./docs/plugin-dialog.png)

Click `Load Plugin` which open up an open folder dialog. Navigate to your plugin and select the `plugin` folder generated with the `npm run build` command:

![image](./docs/select-plugin-folder.png)

You should now see the plugin loaded in the dialog:

![image](./docs/plugin-loaded.png)

The app must be refreshed to view the changes:

![image](./docs/refresh-plugin.png)

The plugin should now be successfully loaded:

![image](./docs/plugin-successfully-loaded.png)

## Theming

Theming in the FWC dashboard app is done using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

As an example take the following style rule for the `my-react-element` component:

```css
color: white;
```

To make this rule themable change it to the following:

```css
color: var(--my-react-element-color, white);
```

`--my-react-element-color` is the CSS variable. CSS variables are prefixed with `--`. To ensure uniqueness and to prevent accidentally overwriting existing rules prepend your variable with the element name. `white` is the default value if a theme is not set.

To add per theme rules add the following code:

```typescript
import { addThemeRules } from '@frc-web-components/app';

addThemeRules('dark', {
  '--my-react-element-color': 'black',
});

addThemeRules('light', {
  '--my-react-element-color': 'white',
});
```

## Including Static Assets

Static assets like such as images should be placed in the `/public/assets` folder. They can be included into the app by calling the `getAssetUrl` function. For example:

```typescript
import { getAssetUrl } from "@frc-web-components/app";

const url: string = getAssetUrl("party.svg");
```

The above URL can then be used as the src of an image element:

```html
<img src={url} />
```