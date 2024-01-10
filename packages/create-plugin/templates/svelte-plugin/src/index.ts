import './MyElement.svelte';
import { addElements, addThemeRules } from '@frc-web-components/app';

addElements({
  'my-svelte-element': {
    dashboard: {
      displayName: 'My Svelte Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
}, 'My Plugin');

addThemeRules('dark', {
  '--my-svelte-element-background': 'cadetblue',
  '--my-svelte-element-color': 'black',
});

addThemeRules('light', {
  '--my-svelte-element-background': 'cornflowerblue',
  '--my-svelte-element-color': 'white',
});