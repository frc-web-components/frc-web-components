import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export default class LineChartData extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: String }) color = '';
  @property({ type: Boolean, attribute: 'is-hidden' }) isHidden = false;
  @property({ type: Number, attribute: 'y-axis' }) yAxis = 0;
  @property({ type: String, attribute: 'display-name' }) displayName = '';
}

if (!customElements.get('frc-line-chart-data')) {
  customElements.define('frc-line-chart-data', LineChartData);
}
