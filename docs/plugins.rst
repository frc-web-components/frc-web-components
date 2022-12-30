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

Let's open the plugin source code to see what's inside. Visual Studio Code is recommended, but you are free to use any editor you wish:

.. image:: ./images/plugin-source-code.png

The root of your plugin source code is in the **plugin.ts** file. It exports a function which the FWC Dashboard app calls when it starts up. The **addPlugin** function is passed in the dashboard API which can be used to extend the dashboard's functionality. The most common way of extending the dashboard is by adding custom components. You can do this using the **dashboard.addElements** method. Let's look a little closer at the code above:

.. code:: javascript

  dashboard.addElements({
    'my-counter': {
      dashboard: {
        displayName: 'My Counter',
      },
      properties: {
        count: { type: 'Number', reflect: true }
      }
    },
  }, 'My Elements');

The above adds a new component to the FWC Dashboard interface. Note that the above is just a config for the **my-counter** HTML element and not the code for the **my-counter** element itself. The above configuration is required by the dashboard so it knows things like how to add the component to the interface, and information about its properties so they can be controlled using external sources such as NetworkTables.

Some config fields are used for display purposes only, such as the **displayName** field and the second argument in the **.addElements** method which is used by the dashboard app to group similar components together. Update the plugin code to the following and see how it appears in the dashboard:

.. code:: javascript

  dashboard.addElements({
    'my-counter': {
      dashboard: {
        displayName: 'My First Element',
      },
      properties: {
        count: { type: 'Number', reflect: true }
      }
    },
  }, 'My Plugin');

The browser should automatically refresh with the latest changes on save. In the dropdown on the top left, you should now see the **My Plugin** option:

.. image:: ./images/my-plugin-group.png

Select this group and you should see the **my-counter** element with the new display name:

.. image:: ./images/my-first-element.png

Now let's take a look at the code for the **my-counter** component.

Creating custom elements
========================

The source code for the **my-counter** element can be found in the **my-counter.ts** file under the **src** folder of your plugin:

.. code:: javascript

  import { html, css, LitElement } from "lit";
  import { customElement, property } from "lit/decorators.js";
  import getAssetUrl from "./get-asset-url";

  @customElement("my-counter")
  export class MyCounter extends LitElement {
    static styles = css`
      :host {
        display: inline-block;
        width: 200px;
        height: 50px;
      }

      button {
        border: 3px solid black;
        background: white;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      }

      button div {
        padding: 10px;
        background: white;
        display: inline-block;
      }
    `;

    /**
    * The number of times the button has been clicked.
    */
    @property({ type: Number, reflect: true })
    count = 0;

    private onClick() {
      this.count++;
    }

    render() {
      return html`
        <button
          @click=${this.onClick}
          part="button"
          style='background-image: url("${getAssetUrl("button-background.jpg")}")'
        >
          count is ${this.count}
        </button>
      `;
    }
  }

The component above was created using `lit <https://lit.dev/>`_, a library for building web components that act just like built-in elements. There are many resources online to learn about the web component standard such as this one: https://kinsta.com/blog/web-components/

Web components are supported by all major browsers and can be built using many libraries and frameworks. A list of templates with examples can be found here: https://webcomponents.dev/new

Element Config
==============

For elements to be added and handled by the FWC Dashboard, they need an associated **ElementConfig**. Below are the configuration options needed to define an **ElementConfig**:

.. code:: javascript

  {
    // A description for the element
    description?: string,
    // This is useful if the element is usually associated with a particular source.
    // e.g. Robot code publishes field related info to "/SmartDashboard/Field" in NetworkTables
    // so "defaultSourceKey" is set to this key and "defaultSourceProvider" to "NetworkTables"
    // for the Field2d element.
    defaultSourceKey?: string,
    defaultSourceProvider?: string,
    // 
    dashboard?: DashboardConfig,
    // Properties are used to control how the element looks and behaves. They can be bound
    // to external sources such as NetworkTables
    properties: {
      [propertyName: string]: PropertyConfig
    },
    slots?: SlotConfig[],
  }

Selectors
---------

Each **ElementConfig** added to the FWC Dashboard requires a **selector** so the dashboard interface knows which config should be applied to elements added to the dashboard:


.. code:: javascript

  dashboard.addElements({
    [selector: string]: ElementConfig
  });

A **selector** is any valid CSS selector. Most of the time these are the element tag names, but they can also be more specific, such as selectors that match elements with classes and attributes. For example take the following HTML and element configs added to the dashboard:

.. code:: html

  <button>Click me</button>
  <frc-gyro></frc-gyro>
  <input type="text" />
  <input type="checkbox" />
  <div class="checkbox-group">
    <input type="checkbox" />
    <input type="checkbox" />
  </div>

  <script>
    ...
    dashboard.addElements({
      "button": { ... },
      "frc-gyro": { ... },
      "input[type=text]": { ... },
      "input[type=checkbox]": { ... },
      ".checkbox-group input[type=checkbox]": { ... },
    });
  </script>

In the above script tag there are 5 element configs added to the dashboard each with a different selector. The *<button>* and *<frc-gyro>* elements will match the *"button"* and *"frc-gyro"* element configs.

To create separate configs for the checkbox and text input elements, configs with attribute selectors *"input[type=text]"* and *"input[type=checkbox]"* are needed.

Also note that when an element matches multiple configs, the one with the highest specificity wins. The checkbox inputs in the div element match both the *"input[type=checkbox]"* and *".checkbox-group input[type=checkbox]"*. Since the second is more specific, the elements will take on those configs.

You can read more on CSS selectors here: https://web.dev/learn/css/selectors/

Properties
----------

Properties config is used to connect your element's properties and attributes to external sources such as NetworkTables:

.. code:: javascript

  dashboard.addElements({
    'some-element': {
      properties: { 
        [propertyName: string]: PropertyConfig
      }
    },
  });

**propertyName** is a string in camelCase format used to map sources to your elements. For example, take the properties from the **frc-gauge** component:

.. code:: javascript

  properties: {
    min: { type: 'Number' },
    max: { type: 'Number', defaultValue: 100 },
    value: { type: 'Number', primary: true },
  },

Let's see how a Gauge's properties can be controlled in the dashboard using NetworkTables:

.. image:: ./images/gauge-properties.png
  :width: 600
  
The element's source was set to the NetworkTables key "/gauge". Since "/gauge" is a subtable, its "children" will be mapped to the element's properties. Note that even though the keys "/gauge/Max" and "/gauge/Value?!" are not exact matches for the "max" and "value" properties they are still mapped because internally FWC converts keys to camelCase.

Now let's look at how to configure individual properties:

.. code:: javascript

  {
    // This is the only required field and is used by the dashboard to know what type
    // of value element expects for that property. For example, a number input field
    // might have a property "value" that is type 'Number' and a property "disabled"
    // that is type 'Boolean'. 'SourceProvider' and 'Store' are special properties
    // that are used by FWC to inject the SourceProvider and Store object for more
    // advanced use cases.
    type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object' | 'SourceProvider' | 'Store',
    // Optional field. The type of value you provide is determined by the 'type' field.
    // This value will default to '' for 'String' type, false for 'Boolean' type,
    // 0 for 'Number' type, [] for 'Array' type, and {} for 'Object' type
    defaultValue?: string | boolean | number | Array<unknown> | Record<string, unknown>,
    // Property values can be get or set through an element's attribute or property
    // on the element object itself. At least one of the 'attribute' and 'property'
    // fields here should be set. 'property' will be set to the 'propertyName' value.
    // You should explicitly set 'property' to false or null if the element does not
    // have one.
    attribute?: string | null | false,
    property?: string | null | false,
    // Optional description used for display purposes.
    description?: string,
    // Whether the property value when set should reflect back to the element's attribute.
    // This is used by the dashboard to detect changes to the property value and send
    // updates to the external source.
    reflect?: boolean,
    // If the source is a value instead of a table, it will be mapped to this property if
    // primary is set to true. Only one property should be be the primary value. Defaults
    // to false.
    primary?: boolean,
    // For the dashboard to send updates to external sources based on changes to property 
    // values, it needs some way to detect that the property value has changed. If the
    // element emits an event when the property changes, the dashboard can detect updates
    // by listening to the event.
    changeEvent?: string,
    // Optional configuration for the input control used to set the property value in
    // the dashboard
    input?: PropertyInputConfig
  }

Property Input Config
---------------------

The **input** config option for properties is used to control how the property input behaves on the dashboard. The **input** config option takes on the following structure:

.. code:: javascript

  {
    type?: string,
    [option: string]: unknown
  }

The current available types are: 

- String
- Number
- Boolean
- Array
- StringArray
- BooleanArray
- NumberArray
- Textarea
- StringDropdown
- ColorPicker

By default **input.type** field will be equal to the property's type. For example:

.. code:: javascript

  dashboard.addElements({
    'some-element': {
      properties: { 
        someProp: { type: 'String' }
      }
    },
  });

Although **input** is not set in the **someProp** property, it will default to the following:

.. code:: javascript

  properties: { 
    someProp: { 
      type: 'String',
      input: { type: 'String' } 
    }
  }

The above property will be displayed as a text input field on the dashboard:

.. image:: ./images/text-input-property.png
  :width: 500

What if we had a property that took in a a hex color? Although we could store the data as a **String**, displaying this in a text input field isn't very pretty.

.. code:: javascript

  properties: { 
    color: { type: 'String' } 
  }

The above property would be displayed as the following if the current hex value was red:

.. image:: ./images/text-input-property2.png
  :width: 500

It would be far better in this case if we displayed this using a color picker:

.. code:: javascript

  properties: { 
    color: { 
      type: 'String',
      input: { type: 'ColorPicker' }
    } 
  }

The above property would be displayed as the following if the current hex value was red:

.. image:: ./images/color-picker-input.png
  :width: 500

Let's look at the configs for the available input types in more detail.

String Property Input
---------------------

The **String** property input displays a text field and accepts properties of type **String**. It takes on the following config:

.. code:: javascript

  { 
    type: 'String',
    isDisabled?: (element: HTMLElement) => boolean,
  }

A string input with the value "some string" looks like the following:

.. image:: ./images/string-input.png
  :width: 500

Number Property Input
---------------------

The **Number** property input displays a number field and accepts properties of type **Number**. It takes on the following config:

.. code:: javascript

  { 
    type: 'Number',
    isDisabled?: (element: HTMLElement) => boolean,
  }

A number input with the value 5 looks like the following:

.. image:: ./images/number-input.png
  :width: 500

Boolean Property Input
---------------------

The **Boolean** property input displays a checkbox and accepts properties of type **Boolean**. It takes on the following config:

.. code:: javascript

  { 
    type: 'Boolean',
    isDisabled?: (element: HTMLElement) => boolean,
  }

A boolean input with the value **true** looks like the following:

.. image:: ./images/boolean-input.png
  :width: 400

Array Property Input
---------------------

The **Array** property input displays a token input and accepts properties of type **Array**. You can add values by typing and pressing the enter/return key and remove them by clicking on the **x** button on each item. It takes on the following config:

.. code:: javascript

  { 
    type: 'Array',
    isDisabled?: (element: HTMLElement) => boolean,
  }

An Array input with the value ["a", "b", "a", "1", "2", "3"] looks like the following:

.. image:: ./images/array-input.png
  :width: 500

StringArray Property Input
---------------------

The **StringArray** property input is an alias of the **Array** property input.

BooleanArray Property Input
---------------------

The **BooleanArray** property input displays a token input and accepts properties of type **Array**. You can add **true** and **false** values by typing and pressing the enter/return key or selecting them from the dropdown options. Values can be removed by clicking on the **x** button on each item. It takes on the following config:

.. code:: javascript

  { 
    type: 'BooleanArray',
    isDisabled?: (element: HTMLElement) => boolean,
  }

An Array input with the value [true, false, true, false] looks like the following:

.. image:: ./images/boolean-array-input.png
  :width: 500

NumberArray Property Input
---------------------

The **NumberArray** property input displays a token input and accepts properties of type **Array**. You can add number values by typing and pressing the enter/return key. Values can be removed by clicking on the **x** button on each item. It takes on the following config:

.. code:: javascript

  { 
    type: 'NumberArray',
    isDisabled?: (element: HTMLElement) => boolean,
  }

An Array input with the value [1, 2, 3, 4] looks like the following:

.. image:: ./images/number-array-input.png
  :width: 500

Textarea Property Input
-----------------------

The **Textarea** property input displays a textarea and accepts properties of type **String**. It takes on the following config:

.. code:: javascript

  { 
    type: 'Textarea',
    isDisabled?: (element: HTMLElement) => boolean,
  }

A textarea input with the value "I love textareas!" looks like the following:

.. image:: ./images/textarea-input.png
  :width: 500


StringDropdown Property Input
---------------------

The **StringDropdown** property input displays a dropdown and accepts properties of type **Array**. It accepts a function **getOptions** which should return an array of strings for each option. By default it only accepts values from the available options, but will accept custom values if allowCustomValues** is set to **true**. It takes on the following config:

.. code:: javascript

  { 
    type: 'StringDropdown',
    isDisabled?: (element: HTMLElement) => boolean,
    allowCustomValues?: boolean,
    getOptions: (element: HTMLElement) => string[]
  }

For example, the following config:

.. code:: javascript

  stringDropdown: {
    type: "Array",
    input: {
      type: "StringDropdown",
      allowCustomValues: true,
      getOptions: () => ["Option 1", "Option 2", "Option 3"],
    },
  },

Would produce the following:

.. image:: ./images/string-dropdown-input.png
  :width: 500

ColorPicker Property Input
-----------------------

The **ColorPicker** property input displays a color picker and accepts properties of type **String**. It takes on the following config:

.. code:: javascript

  { 
    type: 'ColorPicker',
    isDisabled?: (element: HTMLElement) => boolean,
  }

A color picker input with the value "#FF0000" looks like the following:

.. image:: ./images/color-picker-input.png
  :width: 500