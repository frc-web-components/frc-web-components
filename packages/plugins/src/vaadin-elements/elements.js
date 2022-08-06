
export default {
  // "vaadin-button": {
  //   properties: {
  //     disabled: { type: "Boolean", reflect: true },
  //   },
  //   demos: [{ html: `<vaadin-button>Button Label</vaadin-button>` }],
  // },
  'vaadin-checkbox-group': {
    properties: {
      disabled: { type: 'Boolean', reflect: true },
      errorMessage: { type: 'String', attribute: 'error-message' },
      label: { type: 'String' },
      required: { type: 'Boolean' },
      value: { type: 'Array', changeEvent: 'value-changed', primary: true },
      theme: {
        type: 'String',
        property: false,
        input: {
          type: 'StringDropdown',
          allowCustomValues: false,
          getOptions() {
            return ['horizontal', 'vertical'];
          },
        }
      }
    },
    slots: [{ name: "", allowedChildren: ["vaadin-checkbox"] }],
    demos: [{
      html: `
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1">Checkbox 1</vaadin-checkbox>
          <vaadin-checkbox value="2">Checkbox 2</vaadin-checkbox>
          <vaadin-checkbox value="3">Checkbox 3</vaadin-checkbox>
        </vaadin-checkbox-group>
      `
    }],
  },
  "vaadin-checkbox": {
    properties: {
      checked: { type: "Boolean", reflect: true, primary: true },
      disabled: { type: "Boolean", reflect: true },
      label: { type: 'String', attribute: false, property: 'innerText' },
    },
    demos: [{ html: `<vaadin-checkbox>Checkbox</vaadin-checkbox>` }],
  },
  "vaadin-combo-box": {
    properties: {
      items: { type: "Array" },
      value: {
        type: "String",
        changeEvent: "value-changed",
        primary: true,
      },
      allowCustomValue: { type: 'Boolean', attribute: 'allow-custom-value' },
      label: { type: "String" },
      placeholder: { type: 'String' },
      helperText: { type: "String" },
      errorMessage: { type: 'String', attribute: 'error-message' },
      required: { type: 'Boolean' },
      disabled: { type: "Boolean", reflect: true },
      readonly: { type: "Boolean", reflect: true },
    },
    demos: [{ html: `<vaadin-combo-box items='["Item 1", "Item 2"]' value="Item 1"></vaadin-combo-box>` }],
  },
  "vaadin-details": {
    properties: {
      disabled: { type: "Boolean" },
      opened: { type: "Boolean" },
    },
    demos: [
      {
        html: `
            <vaadin-details>
              <div slot="summary">Robotics Team</div>
              <vaadin-vertical-layout>
                <span>Team Name</span>
                <span>ABC High School</span>
                <span>123 West Main St.</span>
              </vaadin-vertical-layout>
            </vaadin-details>
          `,
      },
    ],
  },
  "vaadin-date-picker": {
    properties: {
      value: {
        type: "String",
        primary: true,
        reflect: true,
        changeEvent: "value-changed",
      },
      disabled: { type: "Boolean" },
      clearButtonVisible: { type: "Boolean", defaultValue: false },
      label: { type: "String", defaultValue: "" },
    },
    demos: [
      {
        html: `<vaadin-date-picker label="Sample Date Picker"></vaadin-date-picker>`,
      },
    ],
  },
  "vaadin-number-field": {
    properties: {
      clearButtonVisible: { type: "Boolean", defaultValue: false },
      disabled: { type: "Boolean" },
      hasControls: { type: "Boolean", defaultValue: false },
      label: { type: "String", defaultValue: "" },
      max: { type: "Number" },
      min: { type: "Number" },
      step: { type: "Number", defaultValue: 1 },
      value: {
        type: "String",
        defaultValue: "",
        primary: true,
        reflect: true,
        changeEvent: "change",
      },
    },
    demos: [
      {
        html: `<vaadin-number-field
                    has-controls
                    label="Label"
                    min=0
                    max=10
                    value=5
                    ></vaadin-number-field>`,
      },
    ],
  },
  "vaadin-progress-bar": {
    properties: {
      max: { type: "Number", defaultValue: 1 },
      min: { type: "Number", defaultValue: 0 },
      value: { type: "Number", primary: true, reflect: true },
    },
    demos: [
      {
        html: `<vaadin-progress-bar
                    min=0
                    max=1
                    value=0.5></vaadin-progress-bar>`,
      },
    ],
  },
  "vaadin-radio-button": {
    topLevel: false,
    properties: {
      checked: {
        type: "Boolean",
        primary: true,
        changeEvent: "checked-change",
        defaultValue: false,
      },
      disabled: { type: "Boolean" },
      value: { type: "String", defaultValue: "on" },
    },
    demos: [
      { html: `<vaadin-radio-button value="foo">Foo</vaadin-radio-button>` },
    ],
  },
  "vaadin-radio-group": {
    properties: {
      label: { type: "String", defaultValue: "" },
      value: { type: "String", primary: true, reflect: true },
    },
    slots: [{ name: "", allowedChildren: ["vaadin-radio-button"] }],
    demos: [
      {
        html: `<vaadin-radio-group label="Label" theme="vertical">
                  <vaadin-radio-button>Option A</vaadin-radio-button>
                  <vaadin-radio-button>Option B</vaadin-radio-button>
                  <vaadin-radio-button>Option C</vaadin-radio-button>
                 </vaadin-radio-group>`,
      },
    ],
  },
};
