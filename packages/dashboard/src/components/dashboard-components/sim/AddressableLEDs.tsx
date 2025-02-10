import { createComponent, numberProp, stringArrayProp } from '../fromProps';

export const addressableLEDs = createComponent(
  {
    dashboard: {
      name: 'Addressable LEDs',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 50, height: 50 },
    },
    defaultSource: {
      key: '/AddressableLED',
      provider: 'Sim',
    },
    acceptedSourceTypes: ['AddressableLED'],
    properties: {
      data: stringArrayProp(),
      length: numberProp(),
      columns: numberProp({ min: 1, defaultValue: 1 }),
    },
  },
  ({ data }) => {
    const ledData = data as any as { r: number; g: number; b: number }[];
    return (
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {ledData?.map(({ r, g, b }, index) => {
          return (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                background: `rgb(${r},${g},${b})`,
              }}
            ></div>
          );
        })}
      </div>
    );
  },
);
