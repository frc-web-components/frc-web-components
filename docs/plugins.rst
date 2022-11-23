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

Note: You'll need both `node` installed to run the above command: https://nodejs.org/en/download/

Custom Components
=================