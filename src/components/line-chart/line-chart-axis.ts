import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export default class LineChartAxis extends LitElement {
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Boolean, attribute: 'auto-fit' }) autoFit = false;
  @property({ type: Boolean }) invert = false;
  @property({ type: String }) side: 'left' | 'right' = 'left';
}

if (!customElements.get('frc-line-chart-axis2')) {
  customElements.define('frc-line-chart-axis2', LineChartAxis);
}
