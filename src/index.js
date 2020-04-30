import './source-providers';
import './components';
import './frc-dashboard';
import * as webbitStore from '@webbitjs/store';
import * as webbit from '@webbitjs/webbit';

if (typeof window.webbitStore === 'undefined') {
  window.webbitStore = webbitStore;
}

if (typeof window.webbit === 'undefined') {
  window.webbit = webbit;
}