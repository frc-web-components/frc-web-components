
frc-3-axis-accelerometer
========================

Component for displaying data from a 3-axis accelerometer.

Properties
----------

.. list-table::
   :header-rows: 1

   * - Property
     - Attribute
     - Type
     - Default
     - Description
   * - ``center``
     - ``center``
     - ``Number``
     - 0
     - The point at which the number bar starts. If the x, y and z values are less than the center, the bar be to the left of the center, and to the right otherwise.
   * - ``hideText``
     - ``hide-text``
     - ``Boolean``
     - false
     - If true then the x, y and z values displayed in the bars are hidden.
   * - ``max``
     - ``max``
     - ``Number``
     - 16
     - The maximum displayed acceleration
   * - ``min``
     - ``min``
     - ``Number``
     - -16
     - The minimum displayed acceleration
   * - ``numTickMarks``
     - ``num-tick-marks``
     - ``Number``
     - 3
     - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
   * - ``precision``
     - ``precision``
     - ``Number``
     - 2
     - The number of decimal places shown in the x, y and z values.
   * - ``unit``
     - ``unit``
     - ``String``
     - "g"
     - Displays a unit for the values shown in the axes.
   * - ``x``
     - ``x``
     - ``Number``
     - 0
     - The acceleration in the X axis
   * - ``y``
     - ``y``
     - ``Number``
     - 0
     - The acceleration in the Y axis
   * - ``z``
     - ``z``
     - ``Number``
     - 0
     - The acceleration in the Z axis


CSS Shadow Parts
----------------

.. list-table::
   :header-rows: 1

   * - Part
     - Description
   * - ``accelerometer``
     - Containers for each number bar and their axis label
   * - ``label``
     - The labels on the left side of the number bars
   * - ``x``
     - The number bar display the X axis value
   * - ``y``
     - The number bar display the Y axis value
   * - ``z``
     - The number bar display the Z axis value

