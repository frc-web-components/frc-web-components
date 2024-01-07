import './MyElement.svelte';
import { addElements } from '@frc-web-components/app';


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