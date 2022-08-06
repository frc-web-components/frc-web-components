

/**
 * Fields:
 *   - displayName
 *   - topLevel
 *   - properties
 *   - layout
 *   - properties
 *   - slots
 *   - demos
 */



const configNameExamples = {
  /**
   * By default this will create element <example-element-name></example-element-name>
   */
  'example-config-name': {

  },
  /**
   * You can use valid css selectors as your element's config. For example, this will match the following element:
   *   <example-css-selector a="1" b="1"></example-css-selector>
   * 
   * When you use a css selector you must provide a demo configuration so the dashboard knows how to
   * create elements with this config.
   */
  'example-css-selector[a=1]': {
    demos: [
      { html: '<example-css-selector a="1" b="1"></example-css-selector>' }
    ]
  },
  /**
   * This is similar to the above selector. When an element matches more than one element config's selector,
   * the most specific one is chosen. Since this css selector is more specific than the above selector, it
   * will be used if both selectors match the same element.
   */
  'example-css-selector[a=1][b=2]': {
    demos: [
      { html: '<example-css-selector a="1" b="2"></example-css-selector>' }
    ]
  },
  /**
   * As well as custom elements, you can also match native html elements
   */
  'div': {

  },
  'input[type=number]': {

  },
  'input[type=password]': {

  }
}

/**
 * The displayName field is used as a label for the element in the dashboard
 */
const displayNameExamples = {
  // By default the displayName field will be the same as the config name
  'example-default-displayname': {

  },
  // You can provide an alternative string for the displayName field
  'example-string-displayname': {
    dashboard: {
      displayName: 'Some other name',
    }
  },
  // You can also provide a function for the displayName field which takes in the element and returns a string
  'example-function-displayname': {
    dashboard: {
      displayName: element => {
        return element.getAttribute('some-attribute') + ' more text';
      },
    }
  }
};

// The topLevel field is used to determine whether the element can added to the root of the dashboard.
// This is useful if you only want this to be a child of specific elements
const topLevelExamples = {
  // By default topLevel is true
  'example-top-level': {

  },
  // Set to false if you don't want this to be a top level element
  'example-not-top-level': {
    dashboard: {
      topLevel: false
    }
  }
};


const layoutExamples = {
  'example-layout': {
    dashboard: {
      layout: {
        // only two possible values now: 'absolute' or undefined.
        // If undefined elements will flow normally from left to right
        type: 'absolute',
        // Determines whether you can resize the element in the dashboard.
        // By default the element can be resized vertically and horizontally.
        resizable: {
          vertical: true,
          horizontal: false,
        },
        // Defaults to true. If false element can't be moved in the layout
        movable: false,
        // Determines the min and max size the element can be resized to in the display.

        /**
         * Determines the min and max size the element can be resized to in the display.
         * If value is undefined the min/max value is unbounded.
         * Defaults:
         * - minHeight: 20
         * - minWidth: 20
         * - maxHeight: undefined
         * - maxWidth: undefined
         */
        size: {
          minHeight: 50,
          minWidth: 100,
          maxHeight: 200,
          maxWidth: 400,
        }
      }
    }
  }
};

/**
 * Slots control how children can be added to an element. 
 */
const slotExamples = {
  // By default elements have no slots. If an element has no slots no children can be added
  // to it in the dashboard
  'example-with-no-slots': {

  },
  /**
   * If you want to allow children add a slot with an empty name:
   * <example-with-slots>
   *   <example-element>Some element</example-element>
   *   <another-element>Some other element</another-element>
   * </example-with-slots>
   */
  'example-with-slots': {
    slots: [
      { name: '' }
    ],
  },
  /**
   * If you want to only allow certain elements to be added to a slot, pass an allowedChildren
   * property to the slot with a list of config names (the selector or element name)
   */
  'example-with-slots-allowed-children': {
    slots: [
      { name: '', allowedChildren: ['example-child'] }
    ],
  },
  /**
   * You can configure multiple slots. Pass in the slot name as an attribute
   * to target a specific slot. Don't pass in a slot attribute if you want to
   * target a slot with name ''.
   * 
   * <example-with-multiple-slots>
   *   <span slot="prefix">Prefix</span>
   *   <span>Text</span>
   *   <span slot="suffix">Suffix</span>
   * </example-with-multiple-slots>
   */
  'example-with-multiple-slots': {
    slots: [
      { name: '' },
      { name: 'prefix' },
      { name: 'suffix' },
    ],
  }
};