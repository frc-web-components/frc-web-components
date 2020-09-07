import './urdf-manipulator-element';
import './urdf-viewer-element';
import { Webbit, html, css } from '@webbitjs/webbit';
import { subscribe } from '@webbitjs/store';
import loadMesh from './load-mesh';

const DEG2RAD = Math.PI / 180;

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
        width: 500px;
        height: 500px;
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
      up: { type: String },
      displayShadow: { type: Boolean },
      ambientColor: { type: String },
      minDistance: { type: 'min-distance' },
      maxDistance: { type: 'max-distance' },
      cameraX: { type: Number },
      cameraY: { type: Number },
      cameraZ: { type: Number },
    };
  }

  constructor() {
    super();
    this.urdf = '';
    this.up = 'Z+';
    this.displayShadow = false;
    this.ambientColor = 'black';
    this.unsubscribe = () => {};
    this.minDistance = .25;
    this.maxDistance = 5;
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraZ = -10;
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

  onCameraChange(ev) {
    const { x, y, z } = ev.detail;
    this.cameraX = x;
    this.cameraY = y;
    this.cameraZ = z;
  }

  render() {
    return html`   
      <urdf-viewer 
        urdf="${this.urdf}" 
        up="${this.up}" 
        ?display-shadow="${this.displayShadow}"
        ambient-color="${this.ambientColor}"
        .loadMeshFunc="${loadMesh}"
        min-distance="${this.minDistance}"
        max-distance="${this.maxDistance}"
        camera-x="${this.cameraX}"
        camera-y="${this.cameraY}"
        camera-z="${this.cameraZ}"
        @camera-change="${this.onCameraChange}"
      ></urdf-viewer>
    `;
  }
}

webbitRegistry.define('frc-urdf-viewer', UrdfViewer);

