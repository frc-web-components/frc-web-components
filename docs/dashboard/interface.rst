Dashbord Interface
==================

The dashboard interface has two modes:

#. **Edit Mode**, which is used to editor dashboards and create new ones.
#. **Live Mode**, which is used to interact with your robot using the dashboard you created in *Edit Mode*.

You can toggle between **Edit Mode** and **Live Mode** by pressing **Shift+E** on your keyboard. In **Live Mode** only the **dashboard area** is visible:

.. image:: ../images/interface/interface.png

In **Edit Mode** the **dashboard area** and the **dashboard editor** are visible:

.. image:: ../images/interface/interface2.png

The border that separates the **dashboard area** and **dashboard editor** can be dragged to change the size of the areas. This is useful if you want to increase the editor size or if you want to hide it to reveal components that might be hidden behind it:

.. image:: ../images/interface/interface4.gif

Selecting elements
------------------

.. image:: ../images/interface/interface5.gif

In order to add, edit or remove elements, they must be selected in **Edit Mode**. elements can be selected by either clicking on them in the dashboard or the **element tree**. The **element tree** is at the top of dashboard editor below the menu:

.. image:: ../images/interface/interface6.png

Each row in the **element tree** represents a different element added to the dashboard. A element is the parent of the element indented below it (the children). A element's children can be expanded and collapsed by clicking on the arrow on the left side of the element tree:

.. image:: ../images/interface/interface7.png

Sometimes while interacting with element you may want to prevent other elements from being selected. This can be done by toggling the **selection tool** in the **dashboard editor's** menu:

.. image:: ../images/interface/interface9.png

.. image:: ../images/interface/interface10.gif

Removing elements
-----------------

Selected elements can be removed by pressing the delete/backspace key or by clicking the **Delete element** menu item in the **Edit** menu:

.. image:: ../images/interface/interface8.png

Note that removing a element will also remove its children.

Adding elements
---------------

All elements in a dashboard are direct children or ancestors of the root element. The root element is the topmost element in the element tree:

.. image:: ../images/interface/interface11.png

To add a element you must first select an element and then click on the **Add Elements** tab in the **element editor**:

.. image:: ../images/interface/interface12.gif

Then select a component from the **component dropdown** input field. There are many different categories of components to choose from. When you choose a component you can add it by clicking on the **Prepend Element** or **Append Element** buttons:

.. image:: ../images/interface/interface13.gif

The components shown in the **component dropdown** is not the full list of components available. Only the components that can be added to the selected element are revealed. Some elements like the Gauge we added above can't contain other elements and will say as such:

.. image:: ../images/interface/interface14.png

Other components can only be added to certain elements. For example, only charts can contain chart data components:

.. image:: ../images/interface/interface15.gif

Some components have multiple distinct parts that can contain children. For example, the **line chart** component can contain both **chart data** and **chart axis** elements. These distinct parts are called **slots**. Most components have a single slot, but for components like the line chart, you can change what slot you want to add an element to by changing the **Slot** input field:

.. image:: ../images/interface/interface16.gif

Moving and resizing elements
----------------------------

A selected element can be moved by hovering over it and dragging it to another position:

.. image:: ../images/interface/interface17.gif

Note that the ability to move an element depends on its parent. For example, a checkbox group element can be moved, but individual checkbox elements inside the group can't.

A selected element can be resized by hovering over one of its corners or edges and dragging it:

.. image:: ../images/interface/interface18.gif

Note that some components can't be resized, or resizing is restriced to the vertical or horizontal axis:

.. image:: ../images/interface/interface19.gif

Copying, cutting and pasting elements
-------------------------------------

A selected element can be copied or cut using the **Cut Element** and **Copy Element** menu items in the **Edit** menu:

.. image:: ../images/interface/interface20.png

A selected element can also be cut using its keyboard shortcut (Ctrl+X on Windows and Command+X on Mac) and copied using its keyboard shortcut (Ctrl+C on Windows and Command+C on Mac).

When an element is copied or cut to the clipboard, its parent will become selected. Pasting an element will add it as a child of the selected element if possible (a copied checkbox can't be pasted into a line chart for example). You can paste an element in the clipboard using the **Paste Element** menu item in the **Edit** menu or using its keyboard shortcut (Ctrl+P on Windows and Command+P on Mac).

Note that when elements are copied/cut their children, grandchildren, etc. will be moved to the clipboard as well.

Changing element properties
---------------------------


Connecting elements to NetworkTables and other sources
------------------------------------------------------


Editing element HTML
--------------------

Styling elements
----------------

Undoing and redoing
-------------------

Saving, opening and creating new layouts
----------------------------------------

Loading extensions and custom components
----------------------------------------