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
      pitch: { type: Number },
      roll: { type: Number },
      yaw: { type: Number },
      pitchOffset: { type: Number },
      rollOffset: { type: Number },
      yawOffset: { type: Number },
    };
  }

  constructor() {
    super();
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.pitchOffset = 0;
    this.rollOffset = 0;
    this.yawOffset = 0;
    this.model = null;
    this.shouldAnimate = false;
  }

  transform() {
    const q = Quaternion.fromEuler(this.yaw * rad, this.pitch * rad, this.roll * rad, 'YXZ');
    const offsetQ = Quaternion.fromEuler(this.yawOffset * rad, this.pitchOffset * rad, this.rollOffset * rad, 'YXZ');
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