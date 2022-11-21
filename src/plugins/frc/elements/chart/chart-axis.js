import { css, LitElement } from 'lit';

export const elementName = 'frc-chart-axis';

export const elementConfig = {
  dashboard: {
    topLevel: false,
    displayName: 'Chart Axis',
  },
  properties: {
    axisId: { type: String, attribute: 'axis-id' },
    scaleType: {
      type: String,
      attribute: 'scale-type',
      defaultValue: 'linear',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['linear', 'logarithmic'];
        },
      },
    },
    min: { type: Number, defaultValue: -1 },
    max: { type: Number, defaultValue: 1 },
    label: { type: String, defaultValue: 'Value' },
    tickValues: {
      type: Array,
      attribute: 'tick-values',
      input: { type: 'NumberArray' },
    },
    position: {
      type: String,
      defaultValue: 'left',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['left', 'right'];
        },
      },
    },
    hideGridLines: { type: Boolean, attribute: 'hide-grid-lines' },
  },
};

class ChartAxis extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();

    // default values
    this.axisId = '';
    this.scaleType = 'linear';
    this.min = -1;
    this.max = 1;
    this.label = 'Value';
    this.tickValues = [];
    this.position = 'left';
    this.hideGridLines = false;
  }
}

customElements.define(elementName, ChartAxis);
