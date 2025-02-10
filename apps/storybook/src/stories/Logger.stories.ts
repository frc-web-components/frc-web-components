import '@frc-web-components/fwc/components/logger';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  title: 'Robot Logger',
  maxLogCount: 1000,
  level: 'info',
  debug: '',
  info: '',
  success: '',
  warning: '',
  error: '',
  disabled: false,
  theme: 'light',
  'background-color': '#fff',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/logger";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-logger title="Robot Logger" error="some error message"></frc-logger>
 * ```
 */
const meta: Meta = {
  title: 'FRC/Logger',
  tags: ['autodocs'],
  component: 'frc-logger',
  args: defaultArgs,
  argTypes: {
    title: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 'Robot Logger' },
      },
    },
    maxLogCount: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 1000 },
      },
    },
    level: {
      table: {
        category: 'Properties',
        defaultValue: { summary: 'info' },
      },
      options: ['debug', 'info', 'success', 'warning', 'error'],
      control: 'select',
    },
    debug: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    info: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    success: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    warning: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    error: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    disabled: {
      table: {
        category: 'Properties',
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
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
      }
    </style>
  `;
}

function createLoggerStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-logger
        class=${args.theme}
        title=${args.title}
        max-log-count=${args.maxLogCount}
        debug=${args.debug}
        info=${args.info}
        success=${args.success}
        warning=${args.warning}
        error=${args.error}
        level=${args.level}
        ?disabled=${args.disabled}
      ></frc-logger>
    `,
  };
}

export const LightTheme = createLoggerStory({
  theme: 'light',
});

export const DarkTheme = createLoggerStory({
  theme: 'dark',
});
