import { property } from 'lit/decorators.js';
import NumberBar from '../number-bar';

export default class Accelerometer extends NumberBar {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) center = 0;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'hide-text' }) hideText = false;
  @property({ type: Number, attribute: 'num-tick-marks' }) numTickMarks = 3;
  @property({ type: String }) unit = 'g';
}

if (!customElements.get('frc-accelerometer')) {
  customElements.define('frc-accelerometer', Accelerometer);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-accelerometer': Accelerometer;
  }
}
