import NumberBar from './number-bar';

export const elementName = 'frc-accelerometer';

export const elementConfig = {
  dashboard: {
    displayName: 'Accelerometer',
  },
  properties: {
    value: { type: Number, primary: true },
    max: { type: Number, defaultValue: 1 },
    min: { type: Number, defaultValue: -1 },
    center: { type: Number },
    precision: { type: Number, defaultValue: 2 },
    hideText: { type: Boolean, attribute: 'hide-text' },
    numTickMarks: {
      type: Number,
      defaultValue: 3,
      attribute: 'num-tick-marks',
    },
    unit: { type: String, defaultValue: 'g' },
  },
};

class Accelerometer extends NumberBar {
  static properties = elementConfig.properties;

  constructor() {
    super();
    this.unit = 'g';
  }
}

customElements.define(elementName, Accelerometer);
