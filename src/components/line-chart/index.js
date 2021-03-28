import { css, html } from 'lit-element';
import { Webbit, define } from '../../webbit';
import defaultOptions, { yAxisDefaults } from './line-chart-options';
import { colors, shuffle } from '../chart-utils';
import './chart-axis';

class LineChartData {

  constructor(valueCount, chart) {
    this.valueCount = valueCount;
    this.data = [];
    this.dataIds = [];
    this.dataLabels = [];
    this.dataColors = [];
    this.chart = chart;



    for (let i = 0; i < valueCount; i++) {
      this.dataIds.push('');
      this.dataLabels.push('');
      this.dataColors.push('');
    }

    this.currentTime = 0;
    this.trackedTime = 30;
    this.timeStep = .1;

    this.initData();
  }

  initData() {
    this.data = [];

    let dataLength = this.trackedTime / this.timeStep;

    let values = [];

    for (let i = 0; i < this.valueCount; i++) {
      values.push(NaN);
    }

    for (let i = 0; i < dataLength; i++) {
      this.data.push({
        time: this.currentTime + i * this.timeStep - this.trackedTime,
        values
      })
    }
  }

  updateChart(chart) {

    chart.chart.data.labels = this.data.map(point => point.time.toFixed(1));

    // https://stackoverflow.com/a/41878442
    const hiddenValues = chart.chart.data.datasets.map(dataset => {
      const isHiddenMeta = dataset._meta[Object.keys(dataset._meta)[0]].hidden;
      if (typeof isHiddenMeta === 'boolean') {
        return isHiddenMeta;
      }
      return dataset.hidden;
    });

    const yAxisIds = chart.chart.options.scales.yAxes.map(axis => axis.id);

    chart.chart.data.datasets.splice(0, chart.chart.data.datasets.length);
    this.dataLabels.forEach((label, index) => {
      if (yAxisIds.includes(this.dataIds[index])) {
        chart.chart.data.datasets.push({
          yAxisID: this.dataIds[index],
          label: label,
          data: this.data.map(point => point.values[index]),
          fill: false,
          pointRadius: 0,
          borderColor: this.dataColors[index],
          borderWidth: 2,
          hidden: hiddenValues[index]
        });
      }
    });

    chart.updateChart();
  }

  addData(values) {
    this.currentTime += this.timeStep;
    this.data.push({
      time: this.currentTime,
      values
    });
    this.data.shift();
  }

  setTrackedTime(time) {

    if (time === this.trackedTime) {
      return;
    }

    const oldTrackedTime = this.trackedTime;
    const oldData = this.data;

    this.trackedTime = time;
    this.initData();

    if (oldData.length >= this.data.length) {
      // get end of old data and set it equal to the new data
      this.data = oldData.slice(oldData.length - this.data.length);
    } else {
      this.data = this.data.slice(0, this.data.length - oldData.length).concat(oldData);
    }
  }

  setTimeStep(step) {

    if (step === this.timeStep) {
      return;
    }

    const oldData = this.data;

    if (step < .01) {
      this.timeStep = .01;
    } else {
      this.timeStep = step;
    }

    const newData = [];

    // scale previous data to fit new time step.
    const newDataLength = this.trackedTime / this.timeStep;
    for (let i = 0; i < newDataLength; i++) {
      const oldDataIndex = Math.round(((oldData.length - 1) / newDataLength) * i);
      newData.push({
        time: i * this.timeStep,
        values: oldData[oldDataIndex].values
      });
    }

    this.data = newData;
  }

  setId(index, id) {
    this.dataIds[index] = id;
  }

  setColor(index, color) {
    this.dataColors[index] = color;
  }

  setLabel(index, label) {
    this.dataLabels[index] = label;
  }
}


class LineChart extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Line Chart',
      category: 'Charts & Graphs',
      description: 'A component used to graph data over time.',
      documentationLink: 'https://frc-web-components.github.io/components/line-chart/',
      allowedChildren: {
        data: ['frc-chart-data'],
        axes: ['frc-chart-axis'],
      },
      slots: ['data', 'axes'],
      minSize: { width: 50, height: 50 },
      dashboardHtml: `
        <frc-line-chart title="Line Chart">
          <frc-chart-axis slot="axes"></frc-chart-axis>
          <frc-chart-data slot="data" label="Data" color="#00aa00"></frc-chart-data>
        </frc-line-chart>
      `
    };
  }

  static get styles() {
    return css`
      :host { 
        display: inline-block;
        width: 450px;
        height: 400px;
      }

      slot {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      xAxisLabel: { type: String, defaultValue: 'Time (seconds)' },
      trackedTime: { type: Number, defaultValue: 30 },
      timeStep: {
        type: Number,
        defaultValue: .1,
        attribute: 'time-step',
        get() {
          return Math.max(.01, this._timeStep);
        }
      }
    };
  }

  constructor() {
    super();
    this.dataElements = [];
    this.axisElements = [];
    this.timeStepIntervalId = null;

    this.plugins = [{
      beforeUpdate: (chart, options) => {
        chart.options.title.text = this.title;
        chart.options.scales.xAxes[0].scaleLabel.labelString = this.xAxisLabel;

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
            }
          }

          currentAxes[i].gridLines.display = !this.axisElements[i].hideGridLines;
        }

        for (let i = this.axisElements.length; i < currentAxes.length; i++) {
          currentAxes[i].display = false;
        }
      }
    }]

    this.randomizedColors = shuffle([...colors]);
    this.chartData = null;
  }

  firstUpdated() {
    this.chartElement = this.shadowRoot.querySelector('#chart');

    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      slot.addEventListener('slotchange', e => {
        let elements = [...slots].reduce((els, s) => {
          return els.concat([...s.assignedElements()]);
        }, []);

        this.axisElements = elements.filter(element => element.tagName === 'FRC-CHART-AXIS');
        for (let i = 0; i < this.axisElements.length; i++) {
          if (this.axisElements[i].axisId) {
            continue;
          }
          const axisIds = this.axisElements.map(axis => axis.axisId);
          for (let j = 0; j < this.axisElements.length; j++) {
            const id = `Axis ${j + 1}`;
            if (!axisIds.includes(id)) {
              this.axisElements[i].axisId = id;
              break;
            }
          }
        }

        this.dataElements = elements.filter(element => element.tagName === 'FRC-CHART-DATA');
        this.dataElements.forEach((element, i) => {
          if (!element.color) {
            element.color = this.randomizedColors[i];
          }
          if (!element.axisId) {
            const axisId = this.axisElements.length > 0 ? this.axisElements[0].axisId : 'Axis 1';
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
      this.chartData.addData(this.dataElements.map(element => element.value));
      this.chartData.updateChart(this.chartElement);
    }
  }

  updateTimeStep() {
    this.chartData.setTimeStep(this.timeStep);
    clearInterval(this.timeStepIntervalId);
    this.timeStepIntervalId = setInterval(
      this.updateChart.bind(this),
      parseInt(this.timeStep * 1000)
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

  render() {
    return html`
      <frc-base-chart 
        id="chart" 
        type="line" 
        .data="${{
        labels: [],
        datasets: []
      }}" 
        .options="${defaultOptions}"
				.plugins="${this.plugins}"
      >
			</frc-base-chart>
      <slot name="data"></slot>
      <slot name="axes"></slot>
    `;
  }
}

define('frc-line-chart', LineChart);