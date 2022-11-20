import { css, LitElement } from 'lit';

export const elementName = 'frc-chart-data';

export const elementConfig = {
  dashboard: {
    topLevel: false,
    displayName: 'Chart Data',
  },
  properties: {
    axisId: { type: String, attribute: 'axis-id' },
    value: { type: Number, primary: true },
    label: { type: String },
    color: { type: String, input: { type: 'ColorPicker' } },
  },
};

class ChartData extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();

    // set defaults
    this.axisId = '';
    this.value = 0;
    this.label = '';
    this.color = '';
  }
}

customElements.define(elementName, ChartData);
