const options = {
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
      display: true,
      scaleLabel: {
        display: true,
        labelString: '',
      },
      ticks: {
        suggestedMin: -1,
        suggestedMax: 1
      }
    }]
  }
};

export default options;