import NumberBar from './number-bar';
import { css } from 'lit';

export const elementName = 'frc-voltage-view';

export const elementConfig = {
  dashboard: {
    displayName: 'Voltage View',
  },
  properties: {
    value: { type: Number },
    max: { type: Number, defaultValue: 5 },
    min: { type: Number },
    center: { type: Number },
    precision: { type: Number, defaultValue: 2 },
    hideText: { type: Boolean, attribute: 'hide-text' },
    numTickMarks: {
      type: Number,
      defaultValue: 3,
      attribute: 'num-tick-marks',
    },
    unit: { type: String, defaultValue: 'V' },
  },
};

class VoltageView extends NumberBar {
  static properties = elementConfig.properties;

  static get styles() {
    return [
      super.styles,
      css`
        [part='bar']::part(foreground) {
          background: var(--frc-voltage-view-foreground-color, #ffbd2f);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 5;
    this.center = 0;
    this.precision = 2;
    this.hideText = false;
    this.numTickMarks = 3;
    this.unit = 'V';
  }
}

customElements.define(elementName, VoltageView);
