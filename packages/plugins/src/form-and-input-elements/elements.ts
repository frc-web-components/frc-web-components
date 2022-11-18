import { numberSliderConfig } from './number-slider';
import { toggleButtonConfig } from './toggle-button';
import { toggleSwitchConfig } from './toggle-switch';
import { toggleGroupConfig } from './toggle-group';

export default {
  'frc-number-slider': numberSliderConfig,
  'frc-toggle-button': toggleButtonConfig,
  'frc-toggle-switch': toggleSwitchConfig,
  'frc-toggle-group': toggleGroupConfig,
  'vaadin-checkbox-group': {
    dashboard: {
      displayName: 'Checkbox Group',
    },
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
          getOptions(): string[] {
            return ['horizontal', 'vertical'];
          },
        },
      },
    },
    slots: [{ name: '', allowedChildren: ['vaadin-checkbox'] }],
    demos: [
      {
        html: `
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1">Checkbox 1</vaadin-checkbox>
          <vaadin-checkbox value="2">Checkbox 2</vaadin-checkbox>
          <vaadin-checkbox value="3">Checkbox 3</vaadin-checkbox>
        </vaadin-checkbox-group>
      `,
      },
    ],
  },
  'vaadin-checkbox': {
    dashboard: {
      displayName: 'Checkbox',
    },
    properties: {
      checked: { type: 'Boolean', reflect: true, primary: true },
      disabled: { type: 'Boolean', reflect: true },
      label: { type: 'String', attribute: false, property: 'innerText' },
    },
    demos: [{ html: `<vaadin-checkbox>Checkbox</vaadin-checkbox>` }],
  },
  'vaadin-combo-box': {
    dashboard: {
      displayName: 'Combo Box',
    },
    properties: {
      items: { type: 'Array' },
      value: {
        type: 'String',
        changeEvent: 'value-changed',
        primary: true,
      },
      allowCustomValue: { type: 'Boolean', attribute: 'allow-custom-value' },
      label: { type: 'String' },
      placeholder: { type: 'String' },
      helperText: { type: 'String' },
      errorMessage: { type: 'String', attribute: 'error-message' },
      required: { type: 'Boolean' },
      disabled: { type: 'Boolean', reflect: true },
      readonly: { type: 'Boolean', reflect: true },
    },
    demos: [
      {
        html: `<vaadin-combo-box items='["Item 1", "Item 2"]' value="Item 1"></vaadin-combo-box>`,
      },
    ],
  },
  'vaadin-number-field': {
    dashboard: {
      displayName: 'Number Field',
    },
    properties: {
      value: {
        type: 'Number',
        defaultValue: 0,
        primary: true,
        reflect: true,
        changeEvent: 'change',
      },
      label: { type: 'String' },
      placeholder: { type: 'String' },
      min: { type: 'Number' },
      max: { type: 'Number' },
      step: { type: 'Number', defaultValue: 1 },
      hasControls: { type: 'Boolean' },
      clearButtonVisible: {
        type: 'Boolean',
        attribute: 'clear-button-visible',
      },
      disabled: { type: 'Boolean' },
      readonly: { type: 'Boolean' },
    },
    demos: [
      {
        html: `<vaadin-number-field label="Label" value="0"></vaadin-number-field>`,
      },
    ],
  },
  'vaadin-text-field': {
    dashboard: {
      displayName: 'Text Field',
    },
    properties: {
      value: {
        type: 'String',
        primary: true,
        reflect: true,
        changeEvent: 'change',
      },
      label: { type: 'String' },
      placeholder: { type: 'String' },
      clearButtonVisible: {
        type: 'Boolean',
        attribute: 'clear-button-visible',
      },
      disabled: { type: 'Boolean' },
      readonly: { type: 'Boolean' },
    },
    demos: [
      {
        html: `<vaadin-text-field label="Label"></vaadin-text-field>`,
      },
    ],
  },
  'vaadin-radio-button': {
    dashboard: {
      displayName: 'Radio Button',
      topLevel: false,
    },
    properties: {
      checked: {
        type: 'Boolean',
        primary: true,
        changeEvent: 'checked-change',
        defaultValue: false,
      },
      disabled: { type: 'Boolean' },
      value: { type: 'String', defaultValue: 'on' },
    },
    demos: [
      { html: `<vaadin-radio-button value="foo">Foo</vaadin-radio-button>` },
    ],
  },
  'vaadin-radio-group': {
    dashboard: {
      displayName: 'Radio Button Group',
    },
    properties: {
      label: { type: 'String', defaultValue: '' },
      value: { type: 'String', primary: true, reflect: true },
    },
    slots: [{ name: '', allowedChildren: ['vaadin-radio-button'] }],
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
