import { Webbit, html, css } from '@webbitjs/webbit';

import './model-element/index';

const Quaternion = require('quaternion');
const rad = Math.PI / 180;

class ModelViewer extends Webbit {

  static get styles() {
    return css`
      :host { 
        display: inline-block;
        margin: 10px;
        width: 300px;
        height: 300px;
      }

      x-model {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    // X is Pitch, Y is Roll, Z is Yaw
    return {
      src: { type: String },
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
      xOffset: { type: Number },
      yOffset: { type: Number },
      zOffset: { type: Number },
    };
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;
    this.model = null;
    this.shouldAnimate = false;
  }

  transform() {
    const q = Quaternion.fromEuler(this.z * rad, this.x * rad, this.y * rad, 'YXZ');
    const offsetQ = Quaternion.fromEuler(this.zOffset * rad, this.xOffset * rad, this.yOffset * rad, 'YXZ');
    this.model.style.transform = `matrix3d(${q.conjugate().toMatrix4()}) matrix3d(${offsetQ.conjugate().toMatrix4()})`;
  }

  firstUpdated() {
    this.model = this.shadowRoot.querySelector('x-model');

    const animate = () => {
      if (this.shouldAnimate) {
        this.transform();
        this.shouldAnimate = false;
      }
      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }

  updated() {
    this.shouldAnimate = true;
  }

  render() {
    return html`
      <x-model 
        src="${this.src}"
        @load="${this.onLoad}"
      ></x-model>
    `;
  }
}

webbitRegistry.define('frc-model-viewer', ModelViewer);