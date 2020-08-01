import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class Field2d extends Container {

  static get metadata() {
    return {
      displayName: 'Field2D',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
    };
  }

  static get properties() {
    return {
      ...super.properties,
      x: { type: Number },
      y: { type: Number },
      rot: { type: Number },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
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
  
    this.display = 'inline-block';
    this.width = '200px';
    this.height = 'auto';
    this.fontFamily = 'sans-serif';

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