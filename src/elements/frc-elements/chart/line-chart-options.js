const gridLineColor = 'rgba(180,180,180,.3)';
const gridLineZeroColor = 'rgba(180,180,180,.7)';

export const yAxisDefaults = {
  type: 'linear',
  display: true,
  scaleLabel: {
    display: true,
    labelString: '',
  },
  ticks: {
    min: -1,
    max: 1,
  },
  gridLines: {
    display: true,
  },
};

export function getOptions(fontColor = 'white') {
  return {
    responsive: true,
    title: {
      display: true,
      text: '',
      fontColor,
    },
    tooltips: {
      enabled: false,
    },
    legend: {
      labels: {
        fontColor,
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: '',
            fontColor,
          },
          ticks: {
            autoSkipPadding: 10,
            padding: 10,
            minor: {
              fontColor,
            },
          },
          gridLines: {
            display: true,
            color: gridLineColor,
            zeroLineColor: gridLineZeroColor,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          scaleLabel: {
            display: true,
            labelString: '',
            fontColor,
          },
          ticks: {
            min: -1,
            max: 1,
            minor: {
              fontColor,
            },
          },
          gridLines: {
            display: true,
            color: gridLineColor,
            zeroLineColor: gridLineZeroColor,
          },
        },
      ],
    },
  };
}
