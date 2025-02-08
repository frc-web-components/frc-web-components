import '@frc-web-components/fwc/components/line-chart';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ChartLegendPositions } from '@frc-web-components/fwc/components/line-chart';

const defaultArgs: Record<string, any> = {
  viewTime: 10,
  chartTitle: '',
  dataValue: 0,
  dataColor: '',
  dataHide: false,
  dataYAxis: 0,
  dataDisplayName: '',
  data2Value: 0,
  data2Color: '',
  data2Hide: false,
  data2YAxis: 0,
  data2DisplayName: '',
  axisMin: -1,
  axisMax: 1,
  axisLockMin: false,
  axisLockMax: false,
  axisInvert: false,
  axisSide: 'left',
  axisHideGridLines: false,
  axis2Min: -1,
  axis2Max: 1,
  axis2LockMin: false,
  axis2LockMax: false,
  axis2Invert: false,
  axis2Side: 'right',
  axis2HideGridLines: false,
  legendPosition: 'n',
  legendDirection: 'horizontal',
  legendHide: false,
  legendInside: false,
  theme: 'light',
  'background-color': '#fff',
  '--frc-line-chart-text-color': 'black',
  '--frc-line-chart-border-color': 'black',
  '--frc-line-chart-grid-color': '#eee',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/line-chart";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-line-chart view-time="10" chart-title="Line Chart">
 *   <frc-line-chart-data value="0.5" color="green" display-name="Data"></frc-line-chart-data>
 *   <frc-line-chart-axis min="-1" max="1" side="left"></frc-line-chart-axis>
 *   <frc-line-chart-legend position="n" direction="horizontal"></frc-line-chart-legend>
 * </frc-line-chart>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { LineChart, LineChartData, LineChartAxis, LineChartLegend } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <LineChart viewTime={10} chartTitle="Line Chart">
 *   <LineChartData value={0.5} color="green" displayName="Data" />
 *   <LineChartAxis min={-1} max={1} side="left" />
 *   <LineChartLegend position="n" direction="horizontal" />
 * </LineChart>
 * ```
 */
const meta: Meta = {
  title: 'FRC Line Chart/Basic Chart',
  tags: ['autodocs'],
  component: 'frc-line-chart',
  args: defaultArgs,
  argTypes: {
    viewTime: {
      table: {
        category: 'Chart Properties',
        defaultValue: { summary: 10 },
      },
      control: { type: 'number', min: 0 },
    },
    chartTitle: {
      table: {
        category: 'Chart Properties',
        defaultValue: { summary: '' },
      },
    },
    dataValue: {
      table: {
        category: 'Data Properties',
        defaultValue: { summary: 0 },
      },
    },
    dataColor: {
      control: 'color',
      table: {
        category: 'Data Properties',
        defaultValue: { summary: '' },
      },
    },
    dataHide: {
      table: {
        category: 'Data Properties',
        defaultValue: { summary: false },
      },
    },
    dataYAxis: {
      control: 'radio',
      options: [0, 1],
      table: {
        category: 'Data Properties',
        defaultValue: 0,
      },
    },
    dataDisplayName: {
      table: {
        category: 'Data Properties',
        defaultValue: { summary: '' },
      },
    },
    data2Value: {
      table: {
        category: 'Data 2 Properties',
        defaultValue: { summary: 0 },
      },
    },
    data2Color: {
      control: 'color',
      table: {
        category: 'Data 2 Properties',
        defaultValue: { summary: '' },
      },
    },
    data2Hide: {
      table: {
        category: 'Data 2 Properties',
        defaultValue: { summary: false },
      },
    },
    data2YAxis: {
      control: 'radio',
      options: [0, 1],
      table: {
        category: 'Data 2 Properties',
        defaultValue: 0,
      },
    },
    data2DisplayName: {
      table: {
        category: 'Data 2 Properties',
        defaultValue: { summary: '' },
      },
    },
    axisMin: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: -1 },
      },
    },
    axisMax: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: 1 },
      },
    },
    axisLockMin: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: false },
      },
    },
    axisLockMax: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: false },
      },
    },
    axisInvert: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: false },
      },
    },
    axisSide: {
      control: 'radio',
      options: ['left', 'right'],
      table: {
        category: 'Axis Properties',
        defaultValue: 'left',
      },
    },
    axisHideGridLines: {
      table: {
        category: 'Axis Properties',
        defaultValue: { summary: false },
      },
    },
    axis2Min: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: -1 },
      },
    },
    axis2Max: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: 1 },
      },
    },
    axis2LockMin: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: false },
      },
    },
    axis2LockMax: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: false },
      },
    },
    axis2Invert: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: false },
      },
    },
    axis2Side: {
      control: 'radio',
      options: ['left', 'right'],
      table: {
        category: 'Axis 2 Properties',
        defaultValue: 'right',
      },
    },
    axis2HideGridLines: {
      table: {
        category: 'Axis 2 Properties',
        defaultValue: { summary: false },
      },
    },
    legendPosition: {
      control: 'select',
      options: ChartLegendPositions,
      table: {
        category: 'Legend Properties',
        defaultValue: 'n',
      },
    },
    legendDirection: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: {
        category: 'Legend Properties',
        defaultValue: 'horizontal',
      },
    },
    legendHide: {
      table: {
        category: 'Legend Properties',
        defaultValue: { summary: false },
      },
    },
    legendInside: {
      table: {
        category: 'Legend Properties',
        defaultValue: { summary: false },
      },
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark', 'custom'],
      table: {
        category: 'Styles',
        defaultValue: 'light',
      },
    },
    'background-color': {
      table: {
        category: 'Styles',
        defaultValue: '#fff',
      },
    },
    '--frc-line-chart-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-line-chart-border-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-line-chart-grid-color': {
      control: 'color',
      table: {
        category: 'Styles',
        defaultValue: { summary: '#eee' },
      },
    },
  },
  decorators: [
    (story, props) => {
      const isDarkTheme = props.args.theme === 'dark';
      const themeColor = isDarkTheme ? 'hsl(214, 35%, 21%)' : '#fff';
      const customColor = props.args['background-color'];
      return html` <div
        style=${styleMap({
          padding: '20px 10px',
          marginBottom: '5px',
          background: props.args.theme === 'custom' ? customColor : themeColor,
        })}
      >
        ${story()}
      </div>`;
    },
  ],
  // https://storybook.js.org/blog/storybook-addons-for-css/
  // https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
  // https://storybook.js.org/docs/react/writing-docs/autodocs
};
export default meta;

type Story = StoryObj;

function getStyles(args: Args) {
  if (args.theme === 'custom') {
    return html`
      <style>
        .custom {
          --frc-line-chart-text-color: ${args['--frc-line-chart-text-color']};
          --frc-line-chart-border-color: ${args[
            '--frc-line-chart-border-color'
          ]};
          --frc-line-chart-grid-color: ${args['--frc-line-chart-grid-color']};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-line-chart-text-color: white;
          --frc-line-chart-border-color: white;
          --frc-line-chart-grid-color: rgba(22, 22, 22, 0.2);
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-line-chart-text-color: black;
        --frc-line-chart-border-color: black;
        --frc-line-chart-grid-color: #eee;
      }
    </style>
  `;
}

function createLineChartStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-line-chart
        class=${args.theme}
        view-time=${args.viewTime}
        chart-title=${args.chartTitle}
      >
        <frc-line-chart-data
          value=${args.dataValue}
          color=${args.dataColor}
          ?hide=${args.dataHide}
          y-axis=${args.dataYAxis}
          display-name=${args.dataDisplayName}
        ></frc-line-chart-data>
        <frc-line-chart-data
          value=${args.data2Value}
          color=${args.data2Color}
          ?hide=${args.data2Hide}
          y-axis=${args.data2YAxis}
          display-name=${args.data2DisplayName}
        ></frc-line-chart-data>
        <frc-line-chart-axis
          min=${args.axisMin}
          max=${args.axisMax}
          ?lock-min=${args.axisLockMin}
          ?lock-max=${args.axisLockMax}
          ?invert=${args.axisInvert}
          side=${args.axisSide}
          ?hide-grid-lines=${args.axisHideGridLines}
        ></frc-line-chart-axis>
        <frc-line-chart-axis
          min=${args.axis2Min}
          max=${args.axis2Max}
          ?lock-min=${args.axis2LockMin}
          ?lock-max=${args.axis2LockMax}
          ?invert=${args.axis2Invert}
          side=${args.axis2Side}
          ?hide-grid-lines=${args.axis2HideGridLines}
        ></frc-line-chart-axis>
        <frc-line-chart-legend
          position=${args.legendPosition}
          direction=${args.legendDirection}
          ?hide=${args.legendHide}
          ?inside=${args.legendInside}
        ></frc-line-chart-legend>
      </frc-line-chart>
    `,
  };
}

export const LightTheme = createLineChartStory({
  theme: 'light',
});

export const DarkTheme = createLineChartStory({
  theme: 'dark',
});
