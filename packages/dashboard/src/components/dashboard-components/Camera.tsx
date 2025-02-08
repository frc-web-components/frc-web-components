import { Canvas, CanvasMjpgStream } from '@frc-web-components/react';
import {
  booleanProp,
  colorProp,
  createComponent,
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
    },
  },
  ({ backgroundColor, waitImage, hideCrosshair, crosshairColor }) => {
    return (
      <Canvas
        style={{ width: '100%', height: '100%' }}
        backgroundColor={backgroundColor}
      >
        <CanvasMjpgStream
          waitImage={waitImage}
          crosshairColor={crosshairColor}
          hideCrosshair={hideCrosshair}
        />
      </Canvas>
    );
  },
);
