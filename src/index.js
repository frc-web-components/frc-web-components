import './source-providers';
import './webbits';
import './frc-dashboard';
import * as WebbitStore from '@webbitjs/store';
import * as Webbit from '@webbitjs/webbit';

if (typeof window.WebbitStore === 'undefined') {
  window.WebbitStore = WebbitStore;
}

if (typeof window.Webbit === 'undefined') {
  window.Webbit = Webbit;
}