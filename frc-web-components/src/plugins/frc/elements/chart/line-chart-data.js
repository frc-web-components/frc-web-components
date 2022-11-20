export default class LineChartData {
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
    this.timeStep = 0.1;

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
        values,
      });
    }
  }

  updateChart(chart) {
    chart.chart.data.labels = this.data.map((point) => point.time.toFixed(1));

    // https://stackoverflow.com/a/41878442
    const hiddenValues = chart.chart.data.datasets.map((dataset) => {
      const isHiddenMeta = dataset._meta[Object.keys(dataset._meta)[0]].hidden;
      if (typeof isHiddenMeta === 'boolean') {
        return isHiddenMeta;
      }
      return dataset.hidden;
    });

    const yAxisIds = chart.chart.options.scales.yAxes.map((axis) => axis.id);

    chart.chart.data.datasets.splice(0, chart.chart.data.datasets.length);
    this.dataLabels.forEach((label, index) => {
      if (yAxisIds.includes(this.dataIds[index])) {
        chart.chart.data.datasets.push({
          yAxisID: this.dataIds[index],
          label: label,
          data: this.data.map((point) => point.values[index]),
          fill: false,
          pointRadius: 0,
          borderColor: this.dataColors[index],
          borderWidth: 2,
          hidden: hiddenValues[index],
        });
      }
    });

    chart.updateChart();
  }

  addData(values) {
    this.currentTime += this.timeStep;
    this.data.push({
      time: this.currentTime,
      values,
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
      this.data = this.data
        .slice(0, this.data.length - oldData.length)
        .concat(oldData);
    }
  }

  setTimeStep(step) {
    if (step === this.timeStep) {
      return;
    }

    const oldData = this.data;

    if (step < 0.01) {
      this.timeStep = 0.01;
    } else {
      this.timeStep = step;
    }

    const newData = [];

    // scale previous data to fit new time step.
    const newDataLength = this.trackedTime / this.timeStep;
    for (let i = 0; i < newDataLength; i++) {
      const oldDataIndex = Math.round(
        ((oldData.length - 1) / newDataLength) * i
      );
      newData.push({
        time: i * this.timeStep,
        values: oldData[oldDataIndex].values,
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
