import { css, html, LitElement } from 'lit';
import { yAxisDefaults, getOptions } from './line-chart-options';
import { colors, shuffle } from './chart-utils';
import LineChartData from './line-chart-data';

export const elementName = 'frc-line-chart';

export const elementConfig = {
  dashboard: {
    displayName: 'Line Chart',
  },
  description: 'A component used to graph data over time.',
  properties: {
    title: { type: String },
    xAxisLabel: {
      type: String,
      attribute: 'x-axis-label',
      defaultValue: 'Time (seconds)',
    },
    trackedTime: { type: Number, attribute: 'tracked-time', defaultValue: 30 },
    timeStep: { type: Number, defaultValue: 0.1, attribute: 'time-step' },
  },
  slots: [{ name: '', allowedChildren: ['frc-chart-data', 'frc-chart-axis'] }],
  demos: [
    {
      html: `
      <frc-line-chart title="Line Chart">
        <frc-chart-axis></frc-chart-axis>
        <frc-chart-data label="Data" color="#00aa00"></frc-chart-data>
      </frc-line-chart>
    `,
    },
  ],
};

class LineChart extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      width: 450px;
      height: 400px;
    }

    slot {
      display: none;
    }
  `;

  constructor() {
    super();
    this.dataElements = [];
    this.axisElements = [];
    this.timeStepIntervalId = null;

    // set defaults
    this.title = '';
    this.xAxisLabel = 'Time (seconds)';
    this.trackedTime = 30;
    this.timeStep = 0.1;

    this.plugins = [
      {
        beforeUpdate: (chart, options) => {
          const fontColor = this.getFontColor();
          chart.options.title.fontColor = fontColor;
          chart.options.legend.labels.fontColor = fontColor;
          chart.options.scales.xAxes[0].scaleLabel.fontColor = fontColor;
          chart.options.scales.xAxes[0].ticks.minor.fontColor = fontColor;
          chart.options.scales.yAxes[0].scaleLabel.fontColor = fontColor;
          chart.options.scales.yAxes[0].ticks.minor.fontColor = fontColor;

          chart.options.title.text = this.title;
          chart.options.scales.xAxes[0].scaleLabel.labelString =
            this.xAxisLabel;

          const currentAxes = chart.options.scales.yAxes;

          for (let i = currentAxes.length; i < this.axisElements.length; i++) {
            currentAxes.push(yAxisDefaults);
          }

          for (let i = 0; i < this.axisElements.length; i++) {
            currentAxes[i].display = true;
            currentAxes[i].type = this.axisElements[i].scaleType;
            currentAxes[i].id = this.axisElements[i].axisId;
            currentAxes[i].position = this.axisElements[i].position;
            currentAxes[i].scaleLabel.labelString = this.axisElements[i].label;
            currentAxes[i].ticks.min = this.axisElements[i].min;
            currentAxes[i].ticks.max = this.axisElements[i].max;

            if (this.axisElements[i].tickValues.length === 0) {
              currentAxes[i].afterBuildTicks = null;
            } else {
              currentAxes[i].afterBuildTicks = (chartObj) => {
                chartObj.ticks.splice(0, chartObj.ticks.length);
                for (let tick of this.axisElements[i].tickValues) {
                  chartObj.ticks.push(tick);
                }
              };
            }

            currentAxes[i].gridLines.display =
              !this.axisElements[i].hideGridLines;
          }

          for (let i = this.axisElements.length; i < currentAxes.length; i++) {
            currentAxes[i].display = false;
          }
        },
      },
    ];

    this.randomizedColors = shuffle([...colors]);
    this.chartData = null;
  }

  firstUpdated() {
    this.chartElement = this.shadowRoot.querySelector('#chart');

    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach((slot) => {
      slot.addEventListener('slotchange', (e) => {
        let elements = [...slots].reduce((els, s) => {
          return els.concat([...s.assignedElements()]);
        }, []);

        this.axisElements = elements.filter(
          (element) => element.tagName === 'FRC-CHART-AXIS'
        );
        for (let i = 0; i < this.axisElements.length; i++) {
          if (this.axisElements[i].axisId) {
            continue;
          }
          const axisIds = this.axisElements.map((axis) => axis.axisId);
          for (let j = 0; j < this.axisElements.length; j++) {
            const id = `Axis ${j + 1}`;
            if (!axisIds.includes(id)) {
              this.axisElements[i].axisId = id;
              break;
            }
          }
        }

        this.dataElements = elements.filter(
          (element) => element.tagName === 'FRC-CHART-DATA'
        );
        this.dataElements.forEach((element, i) => {
          if (!element.color) {
            element.color = this.randomizedColors[i];
          }
          if (!element.axisId) {
            const axisId =
              this.axisElements.length > 0
                ? this.axisElements[0].axisId
                : 'Axis 1';
            element.axisId = axisId;
          }
        });
        this.chartData = new LineChartData(this.dataElements.length);
        this.chartData.setTrackedTime(this.trackedTime);
        this.updateTimeStep();
      });
    });
  }

  updateChart() {
    if (this.chartData && this.chartElement.chart) {
      this.dataElements.forEach((element, i) => {
        this.chartData.setId(i, element.axisId);
        this.chartData.setColor(i, element.color);
        this.chartData.setLabel(i, element.label);
      });
      this.chartData.addData(this.dataElements.map((element) => element.value));
      this.chartData.updateChart(this.chartElement);
    }
  }

  updateTimeStep() {
    const timeStep = Math.max(0.01, this.timeStep);
    this.chartData.setTimeStep(timeStep);
    clearInterval(this.timeStepIntervalId);
    this.timeStepIntervalId = setInterval(
      this.updateChart.bind(this),
      parseInt(timeStep * 1000)
    );
  }

  updated(changedProperties) {
    if (!this.chartData) {
      return;
    }

    if (changedProperties.has('trackedTime')) {
      this.chartData.setTrackedTime(this.trackedTime);
    }

    if (changedProperties.has('timeStep')) {
      this.updateTimeStep();
    }
  }

  getFontColor() {
    return (
      getComputedStyle(this).getPropertyValue('--frc-line-chart-text-color') ||
      '#666'
    );
  }

  render() {
    return html`
      <frc-base-chart
        id="chart"
        type="line"
        .data="${{
          labels: [],
          datasets: [],
        }}"
        .options="${getOptions(this.getFontColor())}"
        .plugins="${this.plugins}"
      >
      </frc-base-chart>
      <slot></slot>
    `;
  }
}

customElements.define(elementName, LineChart);
