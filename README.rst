FRC Web Components
==================

A set of web components to build custom dashboards for the `FIRST Robotics Competition (FRC) <https://www.firstinspires.org/robotics/frc>`_. 

FRC Web Components works with `pynetworktables2js <https://github.com/robotpy/pynetworktables2js>`_ to communicate with your robot over NetworkTables. To use, run **pynetworktables2js** where you're serving your HTML files, include the **frc-web-components.js** file as a script in your HTML page, and wrap your HTML in a **frc-dashboard** tag, and you're ready to go!

.. code:: html

  <html>
    <head>
      <title>My Robot Dashboard!</title>
    </head>
    <body>
      <frc-dashboard>
        <nt-string key="/robotName" value="Dozer"></nt-string>
        <nt-number key="/angle" value="135"></nt-number>
        <h1>
          My robot's name is <frc-label source-key="/robotName"></frc-label>
        </h1>
        <frc-differential-drivebase 
          source-key="/LiveWindow/Ungrouped/DifferentialDrive[1]"
        ></frc-differential-drivebase>
        <frc-gyro source-key="/angle" precision="2"></frc-gyro>
      </frc-dashboard>
      <script src="./frc-web-components.js"></script>
    </body>
  </html>


.. image:: ./images/dashboard.png


Installation
============

- Install `pynetworktables2js <https://github.com/robotpy/pynetworktables2js>`_
- Download the **frc-web-components.js** file from the `releases <https://github.com/frc-web-components/frc-web-components/releases>`_ page and include it in your HTML dashboard.

Examples
========

Usage examples can be found `here <https://frc-web-components.github.io/examples/vanilla/index.html>`_.

How to Use
==========

To use wrap your HTML dashboard code in the **<frc-dashboard></frc-dashboard>** element. This will include the necessary code for your dashboard to run as well as asynchronously load the **pynetworktables2js** script in your page.

Using the NetworkTables API
----------------------------

Since the script is loaded asynchronously, you'll need to use the **frc-dashboard**'s *onload* event.

.. code:: html

  <html>
    <body>
      <frc-dashboard onload="ntLoaded()">
        <!-- Dashboard code goes here -->
      </frc-dashboard>
      <script src="./frc-web-components.js"></script>
      <script>
        function ntLoaded() {
          NetworkTables.addGlobalListener(function(key, value, isNew) {
            // do something with the values as they change
          }, true);

          NetworkTables.putValue('/networktablesLoaded', true);
        }
      </script>
    </body>
  </html>
  
More on the NetworkTables API can be found here: https://robotpy.readthedocs.io/projects/pynetworktables2js/en/stable/api_js.html

Using the components
--------------------

FRC Web Components are used by adding them inside the **<frc-dashboard></frc-dashboard>** component:

.. code:: html

  <frc-dashboard onload="ntLoaded()">
    <frc-number-bar></frc-number-bar>
  </frc-dashboard
  
.. image:: ./images/number-bar1.png

  
They can be changed by setting their attributes:

.. code:: html

  <frc-dashboard onload="ntLoaded()">
    <frc-number-bar value="2" min="-5" max="5"></frc-number-bar>
  </frc-dashboard
  
.. image:: ./images/number-bar2.png
  
You can also set a component's attributes by giving it a NetworkTable key:

.. code:: html

  <frc-dashboard onload="ntLoaded()">
    <nt-number key="/bar/value" value="3"></nt-number>
    <nt-number key="/bar/min" value="0"></nt-number>
    <nt-number key="/bar/max" value="10"></nt-number>
    <!-- Here we pass the subtable "/bar" -->
    <frc-number-bar source-key="/bar"></frc-number-bar>
    <!-- Here we pass the single NetworkTable entry "/bar/value" -->
    <frc-number-bar source-key="/bar/value"></frc-number-bar>
  </frc-dashboard>
  
.. image:: ./images/number-bar3.png
  
Above we passed NetworkTable keys into two separate **<frc-number-bar>** components through the **source-key** attribute. If we pass in a subtable, all the subtable's entries will be mapped to the component's attributes. If we pass in a single entry, the component's primary attribute will be set, if it has one. In this case **<frc-number-bar>**'s primary attribute is **value**.

You can also set a component's attributes through a mixture of NetworkTables and manually setting its attributes:

.. code:: html

  <frc-dashboard onload="ntLoaded()">
    <nt-number key="/bar/value" value="3"></nt-number>
    <nt-number key="/bar/min" value="0"></nt-number>
    <nt-number key="/bar/max" value="10"></nt-number>
   
    <frc-number-bar source-key="/bar" min="-5" precision="4"></frc-number-bar>
  </frc-dashboard>
  
.. image:: ./images/number-bar4.png

Above you may notice the component's min attribute took on the value passed in through NetworkTables. NetworkTables takes precedence and will override hard coded attribute values.

Also note that NetworkTable keys will always be converted to camelCase to match the attribute's properties. For example:

.. code:: html

  <frc-dashboard onload="ntLoaded()">
    <nt-number key="/bar/.value" value="3"></nt-number>
    <nt-number key="/bar/Min" value="0"></nt-number>
    <nt-number key="/bar/ max " value="10"></nt-number>
   
    <frc-number-bar source-key="/bar" min="-5" precision="4"></frc-number-bar>
  </frc-dashboard>
  
Will still display correctly:
  
.. image:: ./images/number-bar4.png

Because of this conversion it's possible for name collisions to happen.

.. code:: html

  <nt-number key="/bar/.value" value="-1"></nt-number>
  <nt-number key="/bar/Value" value="-.5"></nt-number>
  <nt-number key="/bar/value" value="0"></nt-number>
  <nt-number key="/bar/ value" value=".5"></nt-number>
  
  <frc-number-bar source-key="/bar/value"></frc-number-bar>
  
All of these will result in the same attribute being set. The attribute's value will be .5 since that was the last line executed.
