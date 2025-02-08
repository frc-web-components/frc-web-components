import { WebbitConfig } from '@webbitjs/webbit';
import { ChartLegendPositions } from './line-chart-legend';

export const lineChartDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: (element?: HTMLElement) => {
      const title = element?.getAttribute('chart-title') || 'Line Chart';
      return title;
    },
    defaultHtml: `
      <frc-line-chart chart-title="Line Chart">
        <frc-line-chart-legend></frc-line-chart-legend>
        <frc-line-chart-axis side="left"></frc-line-chart-axis>
        <frc-line-chart-axis side="right"></frc-line-chart-axis>
        <frc-line-chart-data></frc-line-chart-data>
      </frc-line-chart>
    `,
  },
  description: 'A component used to graph data over time.',
  properties: {
    chartTitle: { type: 'String', attribute: 'chart-title', reflect: true },
    viewTime: { type: 'Number', attribute: 'view-time', defaultValue: 10 },
  },
  slots: [
    {
      name: '',
      allowedChildren: [
        'frc-line-chart-data',
        'frc-line-chart-axis',
        'frc-line-chart-legend',
      ],
    },
  ],
};

export const lineChartAxisDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    topLevel: false,
    displayName: (element?: HTMLElement) => {
      if (!element) {
        return 'Line Chart Axis';
      }
      const side = element.getAttribute('side') || 'left';
      return `Chart Axis (${side})`;
    },
  },
  properties: {
    min: { type: 'Number', defaultValue: -1 },
    max: { type: 'Number', defaultValue: 1 },
    lockMin: { type: 'Boolean', attribute: 'lock-min' },
    lockMax: { type: 'Boolean', attribute: 'lock-max' },
    invert: { type: 'Boolean' },
    side: {
      type: 'String',
      defaultValue: 'left',
      reflect: true,
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['left', 'right'];
        },
      },
    },
    hideGridLines: { type: 'Boolean', attribute: 'hide-grid-lines' },
    hide: { type: 'Boolean' },
  },
};

export const lineChartDataDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    topLevel: false,
    displayName: (element?: HTMLElement) => {
      if (!element) {
        return 'Line Chart Data';
      }
      const parent = element.parentElement as HTMLElement;
      const dataElements = [...parent.children].filter(
        (child) => child.tagName.toLowerCase() === 'frc-line-chart-data',
      );
      const index = dataElements.indexOf(element);
      const displayName =
        element.getAttribute('display-name') || `Data ${index}`;
      return displayName;
    },
  },
  properties: {
    value: { type: 'Number', primary: true },
    color: { type: 'String', input: { type: 'ColorPicker' } },
    hide: { type: 'Boolean' },
    yAxis: { type: 'Number', attribute: 'y-axis' },
    displayName: { type: 'String', attribute: 'display-name', reflect: true },
  },
};

export const lineChartLegendDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    topLevel: false,
    displayName: 'Chart Legend',
  },
  properties: {
    position: {
      type: 'String',
      defaultValue: 'n',
      input: {
        type: 'StringDropdown',
        getOptions: () => ChartLegendPositions,
      },
    },
    direction: {
      type: 'String',
      defaultValue: 'horizontal',
      input: {
        type: 'StringDropdown',
        getOptions: () => ['horizontal', 'vertical'],
      },
    },
    hide: { type: 'Boolean' },
    inside: { type: 'Boolean' },
  },
};

export const lineChartDashboardConfigs: Record<
  string,
  Partial<WebbitConfig>
> = {
  'frc-line-chart': lineChartDashboardConfig,
  'frc-line-chart-axis': lineChartAxisDashboardConfig,
  'frc-line-chart-data': lineChartDataDashboardConfig,
  'frc-line-chart-legend': lineChartLegendDashboardConfig,
};
