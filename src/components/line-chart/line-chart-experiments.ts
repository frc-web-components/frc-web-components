/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { css, LitElement, html } from 'lit';
import './line-chart';
import './real-time-x-axis';

export default class LineChartExperiments extends LitElement {
  static styles = css``;

  render() {
    return html`
      <frc-line-chart2></frc-line-chart2>
      <frc-real-time-x-axis></frc-real-time-x-axis>
    `;
  }
}

if (!customElements.get('frc-line-chart-experiments')) {
  customElements.define('frc-line-chart-experiments', LineChartExperiments);
}
