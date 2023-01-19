Dashboard
=========


Adding, Selecting and Removing Elements
=============================

- Add by dragging
- Add by clicking "Add" button
- Add element by scrolling
- Show selecting other element categories to view different elements
- Show the available elements that can be added depends on the selected element.
- Show selecting an element by clicking on it. 
- Most selected elements have a green dashed border, although some do not. Selected dashboard tabs don't, and neither do elements that have no size. Line Chart data and axis elements have no size and can't be selected by clicking on them.
- Elements can also be selected in the element tree by clicking on them.
- Show selecting line chart data
- Selected elements are highlighted.
- Selected elements can be removed by pressing the "delete" or "backspace" key.


Adding and Removing Tabs
========================

- Tabs are added with the "+" button
- Tabs are deleted by clicking on the "x" button.


Moving and Resizing Elements
============================

- Selected elements can be moved by dragging them around their center.
- Elements can be resized by dragging their edges and corners.


Setting Element Properties
==========================

- Element behavior changes based on their properties.
- Selected element properties can be viewed in the "Properties" view.
- Property values can be changed through their input fields


Property Sources and Robot Communication
========================================

- Element properties can be controlled externally through sources such as NetworkTables. An element connected to NetworkTables can send to or receive updates from a physical or simulated robot.
- Show dashboard connecting and disconnecting from NetworkTables as simulator is launched
- To connect to a physical robot, the "NT4 Server" setting can be changed from "localhost" to the IP address of the robot.
- An element's source can be set through the "Source" input field at the top of the "Properties" view:
- The Source value can be changed by clicking on the "edit" button
- Clicking on this button opens up the Sources dialog.
- Show selecting a NetworkTable source through the sources tree for a gyro (select an entry)
- In the above the selected source is a table with sub entries "value", "Precision" and "Hide Label".
- These sub entries are converted to camelCase and mapped to the element's properties.
- Show how assigning to source with a value will map it to the element's "primary" property.
- Talk about how an element can also update source values.

Source Providers
================

- Sources can come from different places called "Providers". So far we've discussed only the "NetworkTables" provider but others exist as well.
- Talk about the Gamepad providers


Themes
======

- Themes can be changed in the settings menu. The available themes are "dark" and "light".

Saving and Opening Dashboards
=============================


Importing Plugins
=================


