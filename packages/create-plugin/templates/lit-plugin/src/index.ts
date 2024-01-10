import './my-element';
import { addElements, addThemeRules } from '@frc-web-components/app';

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

addThemeRules('dark', {
  '--my-lit-element-background': 'cadetblue',
  '--my-lit-element-color': 'black',
});

addThemeRules('light', {
  '--my-lit-element-background': 'cornflowerblue',
  '--my-lit-element-color': 'white',
});