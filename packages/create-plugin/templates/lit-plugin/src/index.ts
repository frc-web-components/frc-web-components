import {
  addComponents,
  createWebComponent,
  numberProp,
  addThemeRules,
} from '@frc-web-components/app';
import MyElement from './my-element';

export const myLitElement = createWebComponent(
  {
    dashboard: {
      name: 'My Lit Element',
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
  'my-lit-element',
  MyElement,
);

addComponents({
  myLitElement,
});

addThemeRules('dark', {
  '--my-lit-element-background': 'cadetblue',
  '--my-lit-element-color': 'black',
});

addThemeRules('light', {
  '--my-lit-element-background': 'cornflowerblue',
  '--my-lit-element-color': 'white',
});
