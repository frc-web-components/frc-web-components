import '@frc-web-components/fwc/components/basic-fms-info';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  matchType: 0,
  matchNumber: 0,
  eventName: '',
  fmsControlData: 0,
  theme: 'light',
  'background-color': '#fff',
  '--frc-basic-fms-info-text-color': 'black',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/basic-fms-info";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-basic-fms-info match-type="1" match-number="2" event-name="Some event" fms-control-data="23"></frc-basic-fms-info>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { BasicFmsInfo } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <BasicFmsInfo matchType={1} matchNumber={2} eventName="Some event" fmsControlData={23} />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Basic FMS Info',
  tags: ['autodocs'],
  component: 'frc-basic-fms-info',
  args: defaultArgs,
  argTypes: {
    matchType: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
      options: [0, 1, 2, 3], // iterator
      control: {
        type: 'select',
        labels: ['Unknown', 'Practice', 'Qualification', 'Elimination'],
      },
    },
    matchNumber: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
      },
    },
    eventName: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    fmsControlData: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 0 },
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
    '--frc-basic-fms-info-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
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
};
export default meta;

type Story = StoryObj;

function getStyles(args: Args) {
  if (args.theme === 'custom') {
    return html`
      <style>
        .custom {
          --frc-basic-fms-info-text-color: ${args[
            '--frc-basic-fms-info-text-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-basic-fms-info-text-color: white;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-basic-fms-info-text-color: black;
      }
    </style>
  `;
}

function createBasicFmsStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-basic-fms-info
        class=${args.theme}
        match-type=${args.matchType}
        match-number=${args.matchNumber}
        event-name=${args.eventName}
        fms-control-data=${args.fmsControlData}
      ></frc-basic-fms-info>
    `,
  };
}

export const LightTheme = createBasicFmsStory({
  theme: 'light',
});

export const DarkTheme = createBasicFmsStory({
  theme: 'dark',
});
