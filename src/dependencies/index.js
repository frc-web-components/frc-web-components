import * as webbitStore from '@webbitjs/store';
import * as webbit from '@webbitjs/webbit';
import THREE from './three';
import 'three/examples/js/controls/OrbitControls';

if (typeof window.webbitStore === 'undefined') {
  window.webbitStore = webbitStore;
}

if (typeof window.webbit === 'undefined') {
  window.webbit = webbit;
}
