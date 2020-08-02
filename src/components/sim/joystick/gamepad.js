import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

export default class Gamepad extends Container {

  static get properties() {
    return {
      ...super.properties,
      axes: { type: Array },
      connected: { type: Boolean },
      id: { type: String },
      index: { type: Number },
      buttonPresses: { type: Array },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        label {
          font-size: 15px;
          text-align: right;
          white-space: nowrap;
          font-weight: normal;
        }

        [part=header] {
          display: inline-block;
          font-weight: bold;
          margin-bottom: 7px;
          color: #555;
          white-space: nowrap; 
          width: 100%; 
          overflow: hidden;
          text-overflow: ellipsis; 
          text-align: left;
        }

        vaadin-checkbox::part(checkbox)::after {
          border-color: black;
        }

        vaadin-checkbox::part(checkbox) {
          margin: 0;
        }

        vaadin-checkbox::part(label) {
          margin-right: 0;
          color: #555;
        }

        [part=buttons] {
          display: grid;
          margin-bottom: 5px;
          grid-template-columns: auto auto auto auto auto;
          grid-auto-rows: 30px;
        }

        [part=axes] {
          display: grid;
          grid-template-columns: calc(50% - 5px) calc(50% - 5px);
          grid-column-gap: 10px;
          grid-auto-rows: 30px;
        }

        [part=axis] {
          width: 100%;
          display: flex;
        }

        [part=axis] label {
          width: min-content;
          margin-right: 5px;
        }

        [part=axis] frc-bar {
          flex: 1;
          width: auto;
        }
      `
    ];
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.fontFamily = 'sans-serif';
    this.width = '300px';

    this.axes = [];
    this.connected = false;
    this.id = 'Unknown Gamepad';
    this.index = 0;
    this.buttonPresses = [];
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('buttonPresses')) {

    } else if (changedProps.has('axes')) {

    }
  }

  render() {
    return html`
      <label part="header">
        ${this.index}: <span part="name">${this.id}</span>
      </label>
      <div part="buttons">
        ${this.buttonPresses.map((pressed, index) => html`
          <vaadin-checkbox ?checked="${pressed}" disabled>
            B${index + 1}
          </vaadin-checkbox>
        `)}
      </div>
      <div part="axes">
        ${this.axes.map((axis, index) => html`
          <div part="axis">
            <label>A${index}</label>
            <frc-bar 
              value="${axis}"
              min="-1"
              max="1"
              center="0"
              part="bar"
            >
              ${axis.toFixed(4)}
            </frc-bar>
          </div>
        `)}
      </div>
    `;
  }
}

webbitRegistry.define('frc-sim-gamepad', Gamepad);