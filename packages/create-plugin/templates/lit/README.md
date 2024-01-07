# FWC Plugin with Lit + TypeScript + Vite

This template should help you get started developing a FWC plugin with Lit + Typescript + Vite.

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
