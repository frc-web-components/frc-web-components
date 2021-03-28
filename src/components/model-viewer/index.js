import { css, html } from 'lit-element';
import { Webbit, define } from '../../webbit';
import './model-element/index';


// https://bl.ocks.org/duhaime/8c2be958e71ea1814e8c11f95592a3a4
// use this example

const Quaternion = require('quaternion');
const rad = Math.PI / 180;

class ModelViewer extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Model Viewer',
      category: '3D Models',
      description: 'Component used to display 3d models in a particular orientation.',
      documentationLink: 'https://frc-web-components.github.io/components/model-viewer/',
      slots: []
    };
  }

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
    return {
      src: { type: String },
      pitch: { type: Number },
      roll: { type: Number },
      yaw: { type: Number, primary: true },
      pitchOffset: { type: Number },
      rollOffset: { type: Number },
      yawOffset: { type: Number },
      pitchAxis: { type: String, defaultValue: 'x', get() { return this._pitchAxis.toLowerCase(); } },
      rollAxis: { type: String, defaultValue: 'y', get() { return this._rollAxis.toLowerCase(); } },
      yawAxis: { type: String, defaultValue: 'z', get() { return this._yawAxis.toLowerCase(); } },
    };
  }

  constructor() {
    super();
    this.model = null;
    this.shouldAnimate = false;
  }

  getQuaternion(roll, pitch, yaw) {
    const { pitchAxis, yawAxis, rollAxis } = this;
    const order = `${rollAxis}${pitchAxis}${yawAxis}`.toUpperCase();
    const { x = 0, y = 0, z = 0 } = {
      [pitchAxis]: pitch * rad,
      [yawAxis]: yaw * rad,
      [rollAxis]: roll * rad
    };
    return Quaternion.fromEuler(z, x, y,  order);
  }

  transform() {
    const q = this.getQuaternion(this.roll, this.pitch, this.yaw);
    const offsetQ = this.getQuaternion(this.rollOffset, this.pitchOffset, this.yawOffset);
    if (q !== null && offsetQ !== null) {
      this.model.style.transform = `matrix3d(${q.conjugate().toMatrix4()}) matrix3d(${offsetQ.conjugate().toMatrix4()})`;
    }
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

define('frc-model-viewer', ModelViewer);