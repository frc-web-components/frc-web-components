# Plugin Development

[<- Back](/README.md)

-   [Creating your first plugin](#creating-your-first-plugin)
-   [Creating custom elements](#creating-custom-elements)
-   [Element Config](#element-config)
    -   [Selectors](#selectors)
    -   [Properties](#properties)
    -   [Property Input Config](#property-input-config)

FRC Web Components (FWC) dashboard can be extended through its plugin system using the `@frc-web-components/app` package. Below is a simple plugin which adds a custom component created in svelte to the dashboard:

``` javascript
import './MyElement.svelte';
import { addElements } from '@frc-web-components/app';

addElements({
  'my-svelte-element': {
    dashboard: {
      displayName: 'My Svelte Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
});
```

FWC provides a cli tool which generates a sample plugin that can be used to help get you started with writing your own plugin:

``` bash
$ npm init fwc <name>
```

Note: You'll need <span class="title-ref">node</span> installed to run
the above command: <https://nodejs.org/en/download/>

# Creating your first plugin

To get started, open a terminal and enter in the following command:

``` bash
$ npm init fwc my-first-plugin
```

After being prompted with a few questions to help setup your plugin, the plugin project will be created and installed. The cli tool provides templates to create components using [lit](https://lit.dev/), [react](https://react.dev/) or [svelte](https://svelte.dev/):


![image](./images/creating-plugin.png)

Once installed, a new folder should have been created named after the
value you passed into the CLI tool. To launch the plugin, navigate to the plugin root and run the `npm run dev` command:

``` bash
$ cd ./my-first-plugin
$ npm run dev
```

You should see something like this in your terminal:

![image](./images/start-plugin.png)

If the plugin does not launch automatically, copy the URL and paste it into a browser. You should see a web page that looks like this:

![image](./images/plugin-launched.png)

From here you'll be able to test the functionality of your plugin in a browser instance of the FWC Dashboard. By default the plugin CLI tool includes an example component you can use to get started. The components you create for your plugin can be tested by adding them to the dashboard layout. Elements can be added by dragging them into the layout or clicking the **Prepend** and **Append** buttons:

<img src="./images/plugin-dnd-test.gif" width="750" alt="image" />

Let's open the plugin source code to see what's inside. Visual Studio Code is recommended, but you are free to use any editor you wish:

![image](./images/plugin-source-code.png)

The root of your plugin source code is in the **index.ts** file. It calls the `addElements` function which lets you extend the components that can be added to the dashboard app. Let's look a little closer at the code above:

``` javascript
addElements({
  'my-svelte-element': {
    dashboard: {
      displayName: 'My Svelte Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
});
```

The above adds a new component to the FWC Dashboard interface. Note that the above is just a config for the **my-svelte-element** HTML element and not the code for the **my-svelte-element** element itself. The above configuration is required by the dashboard so it knows things like how to add the component to the interface, and information about its properties so they can be controlled using external sources such as NetworkTables.

Some config fields are used for display purposes only, such as the
**displayName** field and the second argument in the **.addElements**
method which is used by the dashboard app to group similar components
together. Update the plugin code to the following and see how it appears
in the dashboard:

``` javascript
addElements({
  'my-svelte-element': {
    dashboard: {
      displayName: 'My Plugin Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
}, 'My Plugin');
```

The browser should automatically refresh with the latest changes on
save. In the dropdown on the top left, you should now see the **My
Plugin** option:

![image](./images/my-plugin-group.png)

Select this group and you should see the **my-svelte-element** element with the new display name:

![image](./images/my-first-element.png)

Now let's take a look at the code for the **my-svelte-element** component.

# Creating custom elements

The source code for the **my-svelte-element** element can be found in the **MyElement.svelte** file under the **src** folder of your plugin:

``` javascript
<svelte:options customElement="my-svelte-element" />

<script lang="ts">
  import { getAssetUrl } from  '@frc-web-components/app';
  export let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  <img src={getAssetUrl('party.svg')} alt="party time" />
  Party Guests: {count}
</button>

<style>
  button {
    padding: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
</style>
```

The component above was created using [svelte](https://svelte.dev/), a library thats able to build web components that act just like built-in elements. There are many resources online to learn about the web component standard such as this one: <https://kinsta.com/blog/web-components/>

Web components are supported by all major browsers and can be built
using many libraries and frameworks. The component above could have also been built using the [lit](https://lit.dev/) framework:

```javascript
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getAssetUrl } from "@frc-web-components/app";

@customElement("my-lit-element")
export class MyElement extends LitElement {
  @property({ type: Number }) count = 0;

  static styles = css`
    :host {
      display: inline-block;
    }
    
    button {
      padding: 8px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    return html`
      <button
        @click=${() => {
          this.count += 1;
        }}
      >
        <img src=${getAssetUrl("party.svg")} alt="party time" /> Party Guests:
        ${this.count}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-lit-element": MyElement;
  }
}
```

A list of templates with examples can be found here: <https://webcomponents.dev/new>.

# Element Config

For elements to be added and handled by the FWC Dashboard, they need an
associated **ElementConfig**. Below are the configuration options needed
to define an **ElementConfig**:

``` javascript
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
```

## Selectors

Each **ElementConfig** added to the FWC Dashboard requires a
**selector** so the dashboard interface knows which config should be
applied to elements added to the dashboard:

``` javascript
dashboard.addElements({
  [selector: string]: ElementConfig
});
```

A **selector** is any valid CSS selector. Most of the time these are the
element tag names, but they can also be more specific, such as selectors
that match elements with classes and attributes. For example take the
following HTML and element configs added to the dashboard:

``` html
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
```

In the above script tag there are 5 element configs added to the
dashboard each with a different selector. The *\<button\>* and
*\<frc-gyro\>* elements will match the *"button"* and *"frc-gyro"*
element configs.

To create separate configs for the checkbox and text input elements,
configs with attribute selectors *"input\[type=text\]"* and
*"input\[type=checkbox\]"* are needed.

Also note that when an element matches multiple configs, the one with
the highest specificity wins. The checkbox inputs in the div element
match both the *"input\[type=checkbox\]"* and *".checkbox-group
input\[type=checkbox\]"*. Since the second is more specific, the
elements will take on those configs.

You can read more on CSS selectors here:
<https://web.dev/learn/css/selectors/>

## Properties

Properties config is used to connect your element's properties and
attributes to external sources such as NetworkTables:

``` javascript
dashboard.addElements({
  'some-element': {
    properties: { 
      [propertyName: string]: PropertyConfig
    }
  },
});
```

**propertyName** is a string in camelCase format used to map sources to
your elements. For example, take the properties from the **frc-gauge**
component:

``` javascript
properties: {
  min: { type: 'Number' },
  max: { type: 'Number', defaultValue: 100 },
  value: { type: 'Number', primary: true },
},
```

Let's see how a Gauge's properties can be controlled in the dashboard
using NetworkTables:

<img src="./images/gauge-properties.png" width="600" alt="image" />

The element's source was set to the NetworkTables key "/gauge". Since
"/gauge" is a subtable, its "children" will be mapped to the element's
properties. Note that even though the keys "/gauge/Max" and
"/gauge/Value?!" are not exact matches for the "max" and "value"
properties they are still mapped because internally FWC converts keys to
camelCase.

Now let's look at how to configure individual properties:

``` javascript
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
```

## Property Input Config

The **input** config option for properties is used to control how the
property input behaves on the dashboard. The **input** config option
takes on the following structure:

``` javascript
{
  type?: string,
  [option: string]: unknown
}
```

The current available types are:

-   String
-   Number
-   Boolean
-   Array
-   StringArray
-   BooleanArray
-   NumberArray
-   Textarea
-   StringDropdown
-   ColorPicker

By default **input.type** field will be equal to the property's type.
For example:

``` javascript
dashboard.addElements({
  'some-element': {
    properties: { 
      someProp: { type: 'String' }
    }
  },
});
```

Although **input** is not set in the **someProp** property, it will
default to the following:

``` javascript
properties: { 
  someProp: { 
    type: 'String',
    input: { type: 'String' } 
  }
}
```

The above property will be displayed as a text input field on the
dashboard:

<img src="./images/text-input-property.png" width="500" alt="image" />

What if we had a property that took in a a hex color? Although we could
store the data as a **String**, displaying this in a text input field
isn't very pretty.

``` javascript
properties: { 
  color: { type: 'String' } 
}
```

The above property would be displayed as the following if the current
hex value was red:

<img src="./images/text-input-property2.png" width="500" alt="image" />

It would be far better in this case if we displayed this using a color
picker:

``` javascript
properties: { 
  color: { 
    type: 'String',
    input: { type: 'ColorPicker' }
  } 
}
```

The above property would be displayed as the following if the current
hex value was red:

<img src="./images/color-picker-input.png" width="500" alt="image" />

Let's look at the configs for the available input types in more detail.

## String Property Input

The **String** property input displays a text field and accepts
properties of type **String**. It takes on the following config:

``` javascript
{ 
  type: 'String',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

A string input with the value "some string" looks like the following:

<img src="./images/string-input.png" width="500" alt="image" />

## Number Property Input

The **Number** property input displays a number field and accepts
properties of type **Number**. It takes on the following config:

``` javascript
{ 
  type: 'Number',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

A number input with the value 5 looks like the following:

<img src="./images/number-input.png" width="500" alt="image" />

Boolean Property Input ---------------------

The **Boolean** property input displays a checkbox and accepts
properties of type **Boolean**. It takes on the following config:

``` javascript
{ 
  type: 'Boolean',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

A boolean input with the value **true** looks like the following:

<img src="./images/boolean-input.png" width="400" alt="image" />

## Array Property Input

The **Array** property input displays a token input and accepts
properties of type **Array**. You can add values by typing and pressing
the enter/return key and remove them by clicking on the **x** button on
each item. It takes on the following config:

``` javascript
{ 
  type: 'Array',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

An Array input with the value \["a", "b", "a", "1", "2", "3"\] looks
like the following:

<img src="./images/array-input.png" width="500" alt="image" />

StringArray Property Input ---------------------

The **StringArray** property input is an alias of the **Array** property
input.

BooleanArray Property Input ---------------------

The **BooleanArray** property input displays a token input and accepts
properties of type **Array**. You can add **true** and **false** values
by typing and pressing the enter/return key or selecting them from the
dropdown options. Values can be removed by clicking on the **x** button
on each item. It takes on the following config:

``` javascript
{ 
  type: 'BooleanArray',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

An Array input with the value \[true, false, true, false\] looks like
the following:

<img src="./images/boolean-array-input.png" width="500" alt="image" />

NumberArray Property Input ---------------------

The **NumberArray** property input displays a token input and accepts
properties of type **Array**. You can add number values by typing and
pressing the enter/return key. Values can be removed by clicking on the
**x** button on each item. It takes on the following config:

``` javascript
{ 
  type: 'NumberArray',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

An Array input with the value \[1, 2, 3, 4\] looks like the following:

<img src="./images/number-array-input.png" width="500" alt="image" />

## Textarea Property Input

The **Textarea** property input displays a textarea and accepts
properties of type **String**. It takes on the following config:

``` javascript
{ 
  type: 'Textarea',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

A textarea input with the value "I love textareas!" looks like the
following:

<img src="./images/textarea-input.png" width="500" alt="image" />

StringDropdown Property Input ---------------------

The **StringDropdown** property input displays a dropdown and accepts
properties of type **Array**. It accepts a function **getOptions** which
should return an array of strings for each option. By default it only
accepts values from the available options, but will accept custom values
if allowCustomValues\*\* is set to **true**. It takes on the following
config:

``` javascript
{ 
  type: 'StringDropdown',
  isDisabled?: (element: HTMLElement) => boolean,
  allowCustomValues?: boolean,
  getOptions: (element: HTMLElement) => string[]
}
```

For example, the following config:

``` javascript
stringDropdown: {
  type: "Array",
  input: {
    type: "StringDropdown",
    allowCustomValues: true,
    getOptions: () => ["Option 1", "Option 2", "Option 3"],
  },
},
```

Would produce the following:

<img src="./images/string-dropdown-input.png" width="500" alt="image" />

ColorPicker Property Input -----------------------

The **ColorPicker** property input displays a color picker and accepts
properties of type **String**. It takes on the following config:

``` javascript
{ 
  type: 'ColorPicker',
  isDisabled?: (element: HTMLElement) => boolean,
}
```

A color picker input with the value "#FF0000" looks like the following:

<img src="./images/color-picker-input.png" width="500" alt="image" />
