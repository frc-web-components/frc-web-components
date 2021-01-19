Running the Dashboard
=====================

These are the steps you need to perform to run the dashboard:

#. To run the dashboard you must launch the app that was installed using a browser such as chrome, edge or firefox. Steps for each browser can be found below.
#. Most components use NetworkTables to communicate information between the dashboard and the robot. Communicating over NetworkTables between a webpage and the robot requires a python package called **pynetworktables2js** be installed and run. To learn more follow the steps here: :ref:`pynetworktables2js`
#. (optional) If you want to simulate your robot code using the FWC Dashboard as a front-end, follow the steps here: :ref:`HALSim Websocket`

To run the dashboard you must launch the PWA that was installed using a browser such as chrome, edge or firefox. Most components generally use NetworkTables to communicate information between the dashboard and the robot. To 

Chrome Dashboard App
--------------------

On macs the app should be installed in the home directory under **Applications** -> **Chrome Apps**:

.. image:: ../images/install-chrome-mac4.png

You can then launch it from the "Chrome Apps" folder or by searching for "FWC Dashboard" using `Splotlight
<https://www.macobserver.com/tips/high-sierra-check-flight-status-spotlight/>`_:

.. image:: ../images/install-chrome-mac5.png

or by searching for it using the `Launchpad <https://support.apple.com/en-us/HT202635>`_:

.. image:: ../images/install-chrome-mac6.png

Clicking/double clicking on the dashboard icon should launch it:

.. image:: ../images/running-chrome-mac.png

To launch multiple dashboard windows, go to the **File** menu and click **New Window**:

.. image:: ../images/running-chrome-mac2.png

On windows the app should be installed in the "Chrome Apps" folder as well:

.. image:: ../images/install-chrome-windows.png

You can then launch it from the "Chrome Apps" folder or by searching for "FWC Dashboard" in the searchbar:

.. image:: ../images/install-chrome-windows2.png

You can also create a shortcut of the app and launch it from your desktop:

.. image:: ../images/install-chrome-windows3.png

Clicking/double clicking on the dashboard icon should launch it:

.. image:: ../images/running-chrome-windows.png

To launch multiple dashboard windows, right click the dashboard icon in the taskbar and click **FWC Dashboard**:

.. image:: ../images/running-chrome-windows2.png

Edge Dashboard App
------------------

On macs the app should be installed in the home directory under **Applications** -> **Edge Apps**:

.. image:: ../images/install-edge-mac4.png

You can then launch it from the "Edge Apps" folder or by searching for "FWC Dashboard" using `Splotlight
<https://www.macobserver.com/tips/high-sierra-check-flight-status-spotlight/>`_:

.. image:: ../images/install-edge-mac5.png

or by searching for it using the `Launchpad <https://support.apple.com/en-us/HT202635>`_:

.. image:: ../images/install-edge-mac6.png

Clicking/double clicking on the dashboard icon should launch it:

.. image:: ../images/running-edge-mac.png

To launch multiple dashboard windows, go to the **File** menu and click **New Window**:

.. image:: ../images/running-edge-mac2.png

On windows the app should be installed in the "Programs" folder:

.. image:: ../images/install-edge-windows.png

You can then launch it from the "Programs" folder or by searching for "FWC Dashboard" in the searchbar:

.. image:: ../images/install-edge-windows2.png

You can also create a shortcut of the app and launch it from your desktop:

.. image:: ../images/install-edge-windows3.png

Clicking/double clicking on the dashboard icon should launch it:

.. image:: ../images/running-edge-windows.png

To launch multiple dashboard windows, right click the dashboard icon in the taskbar and click **FWC Dashboard**:

.. image:: ../images/running-edge-windows2.png

Firefox Dashboard App
---------------------

First open firefox. The dashboard can then be launched from the firefox hamburger menu:

.. image:: ../images/install-firefox-mac8.png

Click on the "Sites in App Mode" menu item and you should see "FWC Dashboard" listed:

.. image:: ../images/install-firefox-mac9.png

Click on this and the dashboard will launch. The dashboard can be launched multiple times using the same method.

Safari Dashboard App
--------------------

PWAs currently can’t be installed using Safari on desktop computers.


.. _pynetworktables2js:

pynetworktables2js
------------------

To install, follow the pynetworktables2js documentation here: https://robotpy.readthedocs.io/projects/pynetworktables2js/en/stable/#installation

**Note:** 

FRC Web Components requires the latest version of pynetworktables2js to be installed. If you are running pynetworktables2js with the windows executable, make sure you have installed the executable with the latest release: https://github.com/robotpy/pynetworktables2js/releases/latest

If you are running pynetworktables2js using the python package make sure to upgrade to the latest version. On windows you can upgrade using the following command::

    py -3 -m pip install pynetworktables2js --upgrade
    
And on Linux/OSX you can execute::

    pip install pynetworktables2js --upgrade


To run, follow the pynetworktables2js documentation here: https://robotpy.readthedocs.io/projects/pynetworktables2js/en/stable/#usage

.. _HALSim Websocket:

HALSim Websocket
----------------

To simulate robot code using the FWC Dashboard, first read the official documentation here: https://docs.wpilib.org/en/stable/docs/software/wpilib-tools/robot-simulation/introduction.html

To simulate robot code using the HALSim Websocket requires an addition to the robot project's **build.gradle** file:

.. image:: ../images/running-halsim.png

Add the following line at the end of the dependencies in the build.gradle file::

  simulation "edu.wpi.first.halsim:halsim_ws_server:${wpi.wpilibVersion}:${wpi.platforms.desktop}@zip"

Next, run the simulation using VS Code’s command palette:

.. image:: ../images/running-halsim2.png

Next, check the **limhalsim_ws_server.dylib** extension to run:

.. image:: ../images/running-halsim3.png

Your dashboard should now be able to connect to the HALSim Websocket.