import React from 'react';
import { createComponent } from '@lit/react';
import LineChartWc, {
  LineChartAxis as LineChartAxisWc,
  LineChartData as LineChartDataWc,
  LineChartLegend as LineChartLegendWc,
} from '@frc-web-components/fwc/components/line-chart';

export const LineChart = createComponent({
  tagName: 'frc-line-chart',
  elementClass: LineChartWc,
  react: React,
});

export const LineChartAxis = createComponent({
  tagName: 'frc-line-chart-axis',
  elementClass: LineChartAxisWc,
  react: React,
});

export const LineChartData = createComponent({
  tagName: 'frc-line-chart-data',
  elementClass: LineChartDataWc,
  react: React,
});

export const LineChartLegend = createComponent({
  tagName: 'frc-line-chart-legend',
  elementClass: LineChartLegendWc,
  react: React,
});

export default LineChart;
