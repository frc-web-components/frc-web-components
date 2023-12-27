import Counter from './Counter.svelte';
import { addElements } from '@frc-web-components/app';

// customElements.define('my-svelte-element', Counter.element);

addElements({
  'my-svelte-element': {
    dashboard: {
      displayName: 'My Svelte Element',
    },
    properties: {
      count: { type: 'Number' },
    },
  }
});