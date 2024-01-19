import { WebbitConfig } from '@webbitjs/webbit';
import { checkboxGroupDashboardConfig } from './checkbox-group';
import { radioGroupDashboardConfig } from './radio-group';

export * from './checkbox-group';
export * from './radio-group';

export const formElementDashboardConfigs: Record<
  string,
  Partial<WebbitConfig>
> = {
  'frc-checkbox-group': checkboxGroupDashboardConfig,
  'frc-radio-group': radioGroupDashboardConfig,
  'vaadin-combo-box': {
    dashboard: {
      displayName: 'Combo Box',
      defaultHtml: `<vaadin-combo-box items='["Item 1", "Item 2"]' value="Item 1"></vaadin-combo-box>`,
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
      disabled: { type: 'Boolean', reflect: true },
      readonly: { type: 'Boolean', reflect: true },
    },
  },
  'vaadin-number-field': {
    dashboard: {
      displayName: 'Number Field',
      defaultHtml: `<vaadin-number-field label="Label" value="0"></vaadin-number-field>`,
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
  },
  'vaadin-text-field': {
    dashboard: {
      displayName: 'Text Field',
      defaultHtml: `<vaadin-text-field label="Label"></vaadin-text-field>`,
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
  },
};

export default formElementDashboardConfigs;
