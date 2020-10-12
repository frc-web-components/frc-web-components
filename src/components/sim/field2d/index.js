import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class Field2d extends Webbit {

  static get metadata() {
    return {
      displayName: 'Field2D',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
      resizable: { left: true, right: true },
      minSize: { width: 120 }
    };
  }

  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number },
      rot: { type: Number },
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          width: 200px;
          height: auto;
          font-family: sans-serif;
        }

        [part=form] {
          width: 100%;
          display: inline-grid;
          grid-template-columns: min-content auto;
          grid-auto-rows: 35px;
          column-gap: 15px;
          align-items: center;
        }

        [part=input] {
          width: 100%;
          min-width: 0;
        }

        label {
          white-space: nowrap;
          text-align: right;
        }

        [part=header] {
          display: inline-block;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 7px;
          color: #555;
        }
      `
    ];
  }

  constructor() {
    super();

    this.x = 0;
    this.y = 0;
    this.rot = 0;

    this.sourceKey = 'simDevices/field2D';
    this.sourceProvider = 'HALSim';
  }

  onXChange(ev) {
    const input = ev.target || ev.path[0];
    this.x = parseFloat(input.value);
  }

  onYChange(ev) {
    const input = ev.target || ev.path[0];
    this.y = parseFloat(input.value);
  }

  onRotChange(ev) {
    const input = ev.target || ev.path[0];
    this.rot = parseFloat(input.value);
  }

  render() {
    return html`
      <label part="header">Field2D</label>
      <div part="form">
        <label>x</label>
        <vaadin-number-field 
          part="input" 
          value="${this.x}" 
          theme="small"
          has-controls
          @change="${this.onXChange}"
        ></vaadin-number-field>
        
        <label>y</label>
        <vaadin-number-field 
          part="input" 
          value="${this.y}" 
          theme="small"
          has-controls
          @change="${this.onYChange}"
        ></vaadin-number-field>

        <label>rot</label>
        <vaadin-number-field 
          part="input" 
          value="${this.rot}" 
          theme="small"
          has-controls
          @change="${this.onRotChange}"
        ></vaadin-number-field>
      </div>
    `;
  }
}

webbitRegistry.define('frc-sim-field2d', Field2d);