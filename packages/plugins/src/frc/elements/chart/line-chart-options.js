export const yAxisDefaults = {
  type: 'linear',
  display: true,
  scaleLabel: {
    display: true,
    labelString: '',
  },
  ticks: {
    min: -1,
    max: 1
  },
  gridLines: {
    display: true
  }
};

const options = {
  responsive: true,
  title: {
    display: true,
    text: ''
  },
  tooltips: {
    enabled: false
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: ''
      },
      ticks: {
        autoSkipPadding: 10,
        padding: 10
      }
    }],
    yAxes: [{
      type: 'linear',
      display: true,
      scaleLabel: {
        display: true,
        labelString: '',
      },
      ticks: {
        min: -1,
        max: 1
      },
      gridLines: {
        display: true
      }
    }]
  }
};


export default options;