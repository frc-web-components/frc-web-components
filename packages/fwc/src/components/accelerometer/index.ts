import { property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';
import { NumberBar } from '../number-bar';

export const accelerometerDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Accelerometer',
  },
  properties: {
    value: { type: 'Number', primary: true },
    max: { type: 'Number', defaultValue: 1 },
    min: { type: 'Number', defaultValue: -1 },
    center: { type: 'Number' },
    precision: { type: 'Number', defaultValue: 2 },
    hideText: { type: 'Boolean', attribute: 'hide-text' },
    numTickMarks: {
      type: 'Number',
      defaultValue: 3,
      attribute: 'num-tick-marks',
    },
    unit: { type: 'String', defaultValue: 'g' },
  },
};

/**
 * A component for displaying accelerometer data.
 */
export class Accelerometer extends NumberBar {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) center = 0;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'hide-text' }) hideText = false;
  @property({ type: Number, attribute: 'num-tick-marks' }) numTickMarks = 3;
  @property({ type: String }) unit = 'g';
}

export default Accelerometer;

if (!customElements.get('frc-accelerometer')) {
  customElements.define('frc-accelerometer', Accelerometer);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-accelerometer': Accelerometer;
  }
}
