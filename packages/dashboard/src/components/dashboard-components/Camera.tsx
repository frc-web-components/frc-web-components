import { Canvas, CanvasMjpgStream } from '@frc-web-components/react';
import {
  booleanProp,
  colorProp,
  createComponent,
  numberProp,
  stringArrayProp,
  stringProp,
} from './fromProps';

export const camera = createComponent(
  {
    dashboard: {
      name: 'Camera',
      description: '',
      defaultSize: { width: 300, height: 250 },
      minSize: { width: 50, height: 50 },
    },
    acceptedSourceTypes: ['Camera'],
    properties: {
      streams: stringArrayProp(),
      backgroundColor: colorProp({ defaultValue: '#000000' }),
      waitImage: stringProp({ defaultValue: './no-camera-stream.jpg' }),
      hideCrosshair: booleanProp(),
      crosshairColor: colorProp({ defaultValue: '#ffffff' }),
      resolutionWidth: numberProp({
        defaultValue: -1,
        min: -1,
        step: 1,
        tooltip:
          'Camera resolution width in pixels. Set to -1 to use camera default.',
      }),
      resolutionHeight: numberProp({
        defaultValue: -1,
        min: -1,
        step: 1,
        tooltip:
          'Camera resolution height in pixels. Set to -1 to use camera default.',
      }),
      fps: numberProp({
        defaultValue: -1,
        min: -1,
        step: 1,
        tooltip: 'Frames per second. Set to -1 to use camera default.',
      }),
      quality: numberProp({
        defaultValue: -1,
        min: -1,
        max: 100,
        step: 1,
        tooltip:
          'Image quality/compression (0-100). Set to -1 to use camera default.',
      }),
    },
  },
  ({
    streams,
    backgroundColor,
    waitImage,
    hideCrosshair,
    crosshairColor,
    resolutionWidth,
    resolutionHeight,
    fps,
    quality,
  }) => {
    return (
      <Canvas
        style={{ width: '100%', height: '100%' }}
        backgroundColor={backgroundColor}
      >
        <CanvasMjpgStream
          srcs={streams}
          waitImage={waitImage}
          crosshairColor={crosshairColor}
          hideCrosshair={hideCrosshair}
          resolutionWidth={resolutionWidth}
          resolutionHeight={resolutionHeight}
          fps={fps}
          quality={quality}
        />
      </Canvas>
    );
  },
);
