import URDFManipulator from './urdf-manipulator-element';
import { Webbit, html, css } from '@webbitjs/webbit';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

import { 
  subscribe, 
  subscribeAll,
  getRawSource,
  getRawSources, 
  hasSourceProvider, 
  sourceProviderAdded 
} from '@webbitjs/store';


customElements.define('urdf-viewer', URDFManipulator);

const DEG2RAD = Math.PI / 180;

const loadMeshFunc = (path, manager, done) => {

  const ext = path.split(/\./g).pop().toLowerCase();
  switch (ext) {

      case 'gltf':
      case 'glb':
          new GLTFLoader(manager).load(
              path,
              result => done(result.scene),
              null,
              err => done(null, err)
          );
          break;
      case 'obj':
          new OBJLoader(manager).load(
              path,
              result => done(result),
              null,
              err => done(null, err)
          );
          break;
      case 'dae':
          new ColladaLoader(manager).load(
              path,
              result => done(result.scene),
              null,
              err => done(null, err)
          );
          break;
      case 'stl':
          new STLLoader(manager).load(
              path,
              result => {
                  const material = new THREE.MeshPhongMaterial();
                  const mesh = new THREE.Mesh(result, material);
                  done(mesh);
              },
              null,
              err => done(null, err)
          );
          break;

    }
}


class UrdfViewer extends Webbit {

  // static get metadata() {
  //   return {
  //     displayName: 'Text View',
  //     category: 'Forms & Inputs',
  //     // description: 'A group of checkboxes',
  //     // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
  //     slots: [],
  //   };
  // }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 1000px;
        height: 1000px;
        background: white;
      }
      
      urdf-viewer {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      urdf: { type: String },
    };
  }

  constructor() {
    super();
    this.urdf = '';
    this.unsubscribe = () => {};
  }


  setSources() {
    const viewer = this.shadowRoot.querySelector('urdf-viewer');
    this.unsubscribe();

    if (this.sourceKey) {
      this.unsubscribe = subscribe(this.sourceProvider, this.sourceKey, source => {
        Object.getOwnPropertyNames(source).forEach(name => {
          viewer.setAngle(name, source[name] * DEG2RAD);
        });
      }, true);
    }
  }

  updated(changedProperties) {

    if (changedProperties.has('sourceKey') || changedProperties.has('sourceProvider')) {
      if (this.sourceProvider) {
        this.setSources();
      }
    }
  }

  render() {
    return html`   
      <urdf-viewer 
        urdf="${this.urdf}" 
        up="Z+" 
        display-shadow 
        ambient-color="black"
        .loadMeshFunc="${loadMeshFunc}"
      ></urdf-viewer>
    `;
  }
}

webbitRegistry.define('frc-urdf-viewer', UrdfViewer);

