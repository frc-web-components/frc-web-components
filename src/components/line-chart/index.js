import { Webbit, html, css } from '@webbitjs/webbit';
import defaultOptions from './line-chart-options';
import { colors, shuffle } from '../chart-utils';

class LineChartData {

	constructor(valueCount, chart) {
		this.valueCount = valueCount;
		this.data = [];
		this.dataLabels = [];
		this.dataColors = [];
		this.chart = chart;

		for (let i = 0; i < valueCount; i++) {
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

		chart.chart.data.datasets.splice(0, chart.chart.data.datasets.length);
		this.dataLabels.forEach((label, index) => {
			chart.chart.data.datasets.push({
				label: label,
				data: this.data.map(point => point.values[index]),
				fill: false,
				pointRadius: 0,
				borderColor: this.dataColors[index],
				borderWidth: 2,
				hidden: hiddenValues[index]
			});
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

	setColor(index, color) {
		this.dataColors[index] = color;
	}

	setLabel(index, label) {
		this.dataLabels[index] = label;
	}
}


class LineChart extends Webbit {

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
			minY: { type: Number, attribute: 'min-y' },
			maxY: { type: Number, attribute: 'max-y' },
			xAxisLabel: { type: String, attribute: 'x-axis-label' },
			yAxisLabel: { type: String, attribute: 'y-axis-label' },
			trackedTime: { type: Number, attribute: 'tracked-time' },
			timeStep: { 
				type: Number, 
				attribute: 'time-step',
				get() {
					return Math.max(.01, this._timeStep);
				}
			}
    };
  }

  constructor() {
    super();
		this.title = '';
		this.minY = -1;
		this.maxY = 1;
		this.xAxisLabel = 'Time (seconds)';
		this.yAxisLabel = 'Value';
		this.dataElements = [];
		this.trackedTime = 30;
		this.timeStep = .1;
		this.timeStepIntervalId = null;

		this.plugins = [{
			beforeUpdate: (chart, options) => {
				chart.options.title.text = this.title;
				chart.options.scales.yAxes[0].ticks.suggestedMin = this.minY;
				chart.options.scales.yAxes[0].ticks.suggestedMax = this.maxY;

				// sets labels
				chart.options.scales.xAxes[0].scaleLabel.labelString = this.xAxisLabel;
				chart.options.scales.yAxes[0].scaleLabel.labelString = this.yAxisLabel;
			}
    }]

		this.randomizedColors = shuffle([...colors]);
		this.chartData = null;
  }

  firstUpdated() {
		this.chartElement = this.shadowRoot.querySelector('#chart');

		const slot = this.shadowRoot.querySelector('slot');
		slot.addEventListener('slotchange', e => {
			let elements = [...slot.assignedElements()];
			this.dataElements = elements.filter(element => element.tagName === 'FRC-CHART-DATA');
			this.dataElements.forEach((element, i) => {
				if (!element.color) {
					element.color = this.randomizedColors[i];
				}
			});
			this.chartData = new LineChartData(this.dataElements.length);
			this.chartData.setTrackedTime(this.trackedTime);
			this.updateTimeStep();
		});
  }

	updateChart() {
		if (this.chartData) {
			this.dataElements.forEach((element, i) => {
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
			<slot></slot>
    `;
  }
}

webbitRegistry.define('frc-line-chart', LineChart);