import {
  addComponents,
  createWebComponent,
  numberProp,
  addThemeRules,
} from '@frc-web-components/app';
import MyElement from './MyElement.svelte';

export const mySvelteElement = createWebComponent(
  {
    dashboard: {
      name: 'My Svelte Element',
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
  'my-svelte-element',
  MyElement.element!,
);

addComponents({
  mySvelteElement,
});

addThemeRules('dark', {
  '--my-svelte-element-background': 'cadetblue',
  '--my-svelte-element-color': 'black',
});

addThemeRules('light', {
  '--my-svelte-element-background': 'cornflowerblue',
  '--my-svelte-element-color': 'white',
});
