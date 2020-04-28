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


.. image:: ./dashboard.png