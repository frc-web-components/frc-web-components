import './my-element';
import { addElements } from '@frc-web-components/app';

addElements({
  'my-lit-element': {
    dashboard: {
      displayName: 'My Lit Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
}, 'My Plugin');