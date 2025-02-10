import '@frc-web-components/fwc/components/canvas';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

type DrawOrigin = { name: string; value: [string, string] };

function getDrawOrigins(): DrawOrigin[] {
  const drawOrigins: DrawOrigin[] = [];

  const yOrigins = ['top', 'center', 'bottom'];
  const xOrigins = ['left', 'center', 'right'];

  yOrigins.forEach((yOrigin) => {
    xOrigins.forEach((xOrigin) => {
      drawOrigins.push({
        name: `${yOrigin} ${xOrigin}`,
        value: [xOrigin, yOrigin],
      });
    });
  });

  return drawOrigins;
}

const defaultArgs: Record<string, any> = {
  points: [100, 100, 300, 100],
  opacity: 1,
  color: 'gray',
  lineWidth: 2,
  transform: [0, 0, 0],
  transformOrigin: [0, 0],
  drawOrigin: 0,
  zIndex: 0,
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
 *   <frc-canvas-line points="[100,100,300,100]" color="gray" line-width="2"></frc-canvas-line>
 * </frc-canvas>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { CanvasLine, Canvas } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <Canvas>
 *   <CanvasLine points={[100,100,300,100]} color="gray" lineWidth={2} />
 * </Canvas>
 * ```
 */
const meta: Meta = {
  title: 'FRC Canvas/Canvas Line',
  tags: ['autodocs'],
  component: 'frc-canvas-line',
  args: defaultArgs,
  argTypes: {
    points: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: [] },
      },
    },
    opacity: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: 1 },
      },
      control: { type: 'number', min: 0, max: 1 },
    },
    color: {
      control: 'color',
      table: {
        category: 'Line Properties',
        defaultValue: { summary: 'gray' },
      },
    },
    lineWidth: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: 1 },
      },
      control: { type: 'number', min: 0 },
    },
    transform: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: [0, 0, 0] },
      },
    },
    transformOrigin: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: [0, 0] },
      },
    },
    drawOrigin: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: 0 },
      },
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      control: {
        type: 'select',
        labels: getDrawOrigins().map(({ name }) => name),
      },
    },
    zIndex: {
      table: {
        category: 'Line Properties',
        defaultValue: { summary: 0 },
      },
      control: { type: 'number', min: 0 },
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

function createCanvasLineStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };

  return {
    args: storyArgs,
    render: (args) => {
      const [xOrigin, yOrigin] = getDrawOrigins()[args.drawOrigin].value;
      return html`
        <frc-canvas background-color=${args.backgroundColor}>
          <frc-canvas-line
            points=${JSON.stringify(args.points)}
            opacity=${args.opacity}
            color=${args.color}
            line-width=${args.lineWidth}
            transform=${JSON.stringify(args.transform)}
            transform-origin=${JSON.stringify(args.transformOrigin)}
            .drawOrigin=${[xOrigin, yOrigin]}
            z-index=${JSON.stringify(args.zIndex)}
          ></frc-canvas-line>
        </frc-canvas>
      `;
    },
  };
}

export const CanvasLine = createCanvasLineStory();
