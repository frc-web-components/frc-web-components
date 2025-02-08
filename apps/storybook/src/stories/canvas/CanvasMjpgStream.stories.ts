import '@frc-web-components/fwc/components/canvas';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  srcs: [],
  waitImage: '',
  origin: [0, 0],
  width: undefined,
  height: undefined,
  hideCrosshair: false,
  crosshairColor: 'white',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/canvas";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-canvas>
 *   <frc-canvas-mjpg-stream origin="[0,0]" crosshair-color="white"></frc-canvas-mjpg-stream>
 * </frc-canvas>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { CanvasMjpgStream, Canvas } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Canvas>
 *   <CanvasMjpgStream origin={[0,0]} crosshairColor="white" />
 * </Canvas>
 * ```
 */
const meta: Meta = {
  title: 'FRC Canvas/Canvas MJPG Strem',
  tags: ['autodocs'],
  component: 'frc-canvas-mjpg-stream',
  args: defaultArgs,
  argTypes: {
    srcs: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: [] },
      },
    },
    waitImage: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: '' },
      },
    },
    origin: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: [0, 0] },
      },
    },
    width: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: undefined },
      },
      control: { type: 'number', min: 0 },
    },
    height: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: undefined },
      },
      control: { type: 'number', min: 0 },
    },
    hideCrosshair: {
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: false },
      },
    },
    crosshairColor: {
      control: 'color',
      table: {
        category: 'MJPG Stream Properties',
        defaultValue: { summary: 'gray' },
      },
    },
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Canvas Properties',
        defaultValue: { summary: 'black' },
      },
    },
  },
  decorators: [
    (story) =>
      html` <div
        style=${styleMap({
          padding: '20px 10px',
          marginBottom: '5px',
        })}
      >
        ${story()}
      </div>`,
  ],
};
export default meta;

type Story = StoryObj;

function createCanvasMjpgStreamStory(
  optionalArgs: Record<string, any> = {},
): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };

  return {
    args: storyArgs,
    render: (args) => html`
      <frc-canvas background-color=${args.backgroundColor}>
        <frc-canvas-mjpg-stream
          .srcs=${args.srcs}
          wait-image=${args.waitImage}
          origin=${JSON.stringify(args.origin)}
          width=${ifDefined(args.width ? args.width : undefined)}
          height=${ifDefined(args.height ? args.height : undefined)}
          ?hide-crosshair=${args.hideCrosshair}
          crosshair-color=${args.crosshairColor}
        ></frc-canvas-mjpg-stream>
      </frc-canvas>
    `,
  };
}

export const CanvasMjpgStream = createCanvasMjpgStreamStory();
