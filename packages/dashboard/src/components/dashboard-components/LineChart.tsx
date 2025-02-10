import {
  LineChart,
  LineChartAxis,
  LineChartData,
  LineChartLegend,
} from '@frc-web-components/react';
import {
  booleanProp,
  colorProp,
  createComponent,
  numberProp,
  stringDropdownProp,
  stringProp,
} from './fromProps';
import { ChartLegendPositions } from '@frc-web-components/fwc';

export const lineChart = createComponent(
  {
    dashboard: {
      name: 'Line Chart',
      description: '',
      defaultSize: { width: 450, height: 250 },
      minSize: { width: 100, height: 80 },
      children: [
        { type: 'lineChartData', name: 'Data' },
        {
          type: 'lineChartAxis',
          name: 'Left Axis',
          properties: { side: 'left' },
        },
        {
          type: 'lineChartAxis',
          name: 'Right Axis',
          properties: { side: 'right', hide: true },
        },
        {
          type: 'lineChartLegend',
          name: 'Legend',
        },
      ],
    },
    children: [
      { type: 'lineChartData' },
      { type: 'lineChartAxis' },
      { type: 'lineChartLegend' },
    ],
    properties: {
      chartTitle: stringProp(),
      viewTime: numberProp({ defaultValue: 10, min: 0 }),
    },
  },
  ({ children, ...props }) => {
    return <LineChart {...props}>{children}</LineChart>;
  },
);

export const lineChartData = createComponent(
  {
    dashboard: {
      name: 'Data',
      description: '',
      defaultSize: { width: 0, height: 0 },
      minSize: { width: 0, height: 0 },
      topLevel: false,
    },
    properties: {
      value: numberProp(),
      color: colorProp(),
      hide: booleanProp(),
      yAxis: numberProp(),
      displayName: stringProp(),
    },
  },
  (props) => {
    return <LineChartData {...props} />;
  },
);

export const lineChartAxis = createComponent(
  {
    dashboard: {
      name: 'Axis',
      description: '',
      defaultSize: { width: 0, height: 0 },
      minSize: { width: 0, height: 0 },
      topLevel: false,
    },
    properties: {
      min: numberProp({ defaultValue: -1 }),
      max: numberProp({ defaultValue: 1 }),
      lockMin: booleanProp(),
      lockMax: booleanProp(),
      invert: booleanProp(),
      side: stringDropdownProp({
        defaultValue: 'left',
        options: ['left', 'right'],
      }),
      hideGridLines: booleanProp(),
      hide: booleanProp(),
    },
  },
  (props) => {
    return <LineChartAxis {...(props as any)} />;
  },
);

export const lineChartLegend = createComponent(
  {
    dashboard: {
      name: 'Legend',
      description: '',
      defaultSize: { width: 0, height: 0 },
      minSize: { width: 0, height: 0 },
      topLevel: false,
    },
    properties: {
      position: stringDropdownProp({
        defaultValue: 'n',
        options: ChartLegendPositions as any,
      }),
      direction: stringDropdownProp({
        defaultValue: 'horizontal',
        options: ['horizontal', 'vertical'],
      }),
      hide: booleanProp(),
      inside: booleanProp(),
    },
  },
  (props) => {
    return <LineChartLegend {...(props as any)} />;
  },
);
