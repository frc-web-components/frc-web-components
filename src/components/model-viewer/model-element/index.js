import HTMLModelElement from './modelElement.js';
import modelLoader from './modelLoader.js';
import gltfLoader from './loaders/gltf';
import objLoader from './loaders/obj';


modelLoader.register('.gltf', gltfLoader);
modelLoader.register('.glb', gltfLoader);
modelLoader.register('.obj', objLoader);

customElements.define('x-model', HTMLModelElement);
