import { CSSProperties } from 'react';
import {
  getAssetUrl,
  createComponent,
  numberProp,
} from '@frc-web-components/app';

export const myElement = createComponent(
  {
    dashboard: {
      name: 'My React Element',
      description: '',
      defaultSize: { width: 130, height: 50 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['Number'],
    primaryProperty: 'count',
    properties: {
      count: numberProp(),
    },
  },
  ({ count, setProperty }) => {
    const styles: CSSProperties = {
      background: 'var(--my-react-element-background, cadetblue)',
      color: 'var(--my-react-element-color, black)',
      border: 'none',
      borderRadius: '3px',
      padding: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      width: '100%',
      height: '100%',
    };
    return (
      <button
        style={styles}
        onClick={() => {
          setProperty('count', count + 1);
        }}
      >
        <img src={getAssetUrl('party.svg')} alt="party time" />
        Party Guests: {count}
      </button>
    );
  },
);
