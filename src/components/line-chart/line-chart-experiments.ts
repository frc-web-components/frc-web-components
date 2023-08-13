/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { css, LitElement, html } from 'lit';
import './line-chart';
import './real-time-x-axis';

export default class LineChartExperiments extends LitElement {
  static styles = css``;

  render() {
    return html`
      <frc-line-chart2 view-time="20">
        <frc-line-chart-data2 color="green" value="2"></frc-line-chart-data2>
        <frc-line-chart-data2
          color="blue"
          value="3"
          y-axis="1"
        ></frc-line-chart-data2>
        <frc-line-chart-axis2 min="-5" max="5"></frc-line-chart-axis2>
        <frc-line-chart-axis2
          min="-1"
          max="1"
          side="right"
        ></frc-line-chart-axis2>
      </frc-line-chart2>
    `;
  }
}

if (!customElements.get('frc-line-chart-experiments')) {
  customElements.define('frc-line-chart-experiments', LineChartExperiments);
}
