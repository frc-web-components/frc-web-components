Plugin Development
==================

FRC Web Components (FWC) can be extended through its plugin system. Plugins are created by making an ES module which exports a function that takes in the dashboard instance as a parameter:

.. code:: javascript

  import { FrcDashboard } from '@frc-web-components/frc-web-components';

  export default function addPlugin(dashboard: FrcDashboard) {
    // Plugin code goes here
  }

FWC provides a cli tool which generates a sample plugin that can be used to help get you started with writing your own plugin:

.. code:: bash
  
  $ npm init @frc-web-components/plugin <name>

Note: You'll need `node` installed to run the above command: https://nodejs.org/en/download/

Creating your first plugin
==========================

To get started, open a terminal and enter in the following command:

.. code:: bash
  
  $ npm init @frc-web-components/plugin my-first-plugin

After being prompted with a few questions to help setup your plugin, the plugin project will be created and installed:

.. image:: ./images/creating-plugin.png

Once installed, a new folder should have been created named after the value you passed into the CLI tool:

.. image:: ./images/installed-plugin.png

To launch the plugin, navigate to the plugin root and run the `npm start` command:

.. code:: bash
  
  $ cd ./my-first-plugin
  $ npm start

You should see something like this in your terminal:

.. image:: ./images/start-plugin.png

If the plugin does not launch automatically, copy the URL and paste it into a browser. You should see a web page that looks like this:

.. image:: ./images/plugin-launched.png

From here you'll be able to test the functionality of your plugin in a browser instance of the FWC Dashboard. By default the plugin CLI tool includes an example component called **My Counter** you can use to get started. The components you create for your plugin can be tested by adding them to the dashboard layout. Elements can be added by dragging them into the layout or clicking the **Prepend** and **Append** buttons:

.. image:: ./images/plugin-dnd-test.gif
  :width: 750

Let's open the plugin source code to see what's inside. I recommend using Visual Studio Code, but you are free to use any editor you wish:

.. image:: ./images/plugin-source-code.png
