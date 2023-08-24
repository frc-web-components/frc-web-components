/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { css, LitElement, html } from 'lit';
import './line-chart';
import './real-time-x-axis';

export default class LineChartExperiments extends LitElement {
  static styles = css``;

  render() {
    return html`
      <frc-line-chart view-time="10">
        <frc-line-chart-data value="2"></frc-line-chart-data>
        <frc-line-chart-data
          color="blue"
          value="3"
          y-axis="1"
        ></frc-line-chart-data>
        <frc-line-chart-axis min="-5" max="5"></frc-line-chart-axis>
        <frc-line-chart-axis
          min="-1"
          max="1"
          side="right"
        ></frc-line-chart-axis>
        <frc-line-chart-legend
          position="n"
          direction="horizontal"
        ></frc-line-chart-legend>
      </frc-line-chart>
    `;
  }
}

if (!customElements.get('frc-line-chart-experiments')) {
  customElements.define('frc-line-chart-experiments', LineChartExperiments);
}
