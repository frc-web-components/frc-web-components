import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

const hasArrayChanged = (newVal, oldVal) => {
  if (newVal === oldVal) {
    return false;
  }
  if (
      (newVal && !oldVal)
      || (!newVal && oldVal)
  ) {
    return true;
  }

  if (newVal.length !== oldVal.length) {
    return true;
  }
  for (let i = 0; i < newVal.length; i++) {
    if (newVal[i] !== oldVal[i]) {
      return true;
    }
  }
  return false;
}

export default class Gamepad extends Webbit {

  static get metadata() {
    return {
      displayName: 'Gamepad',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
      resizable: { left: true, right: true },
      minSize: { width: 100 }
    };
  }

  static get properties() {
    return {
      axes: { 
        type: Array,
        hasChanged: hasArrayChanged
      },
      connected: { type: Boolean },
      id: { type: String },
      index: { type: Number },
      buttonPresses: { 
        type: Array,
        hasChanged: hasArrayChanged
      },
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          font-family: sans-serif;
          width: 300px;
        }

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

        frc-bar::part(foreground) {
          border-radius: 0;
          background: rgba(200,0,0,.5);
        }

        frc-bar[positive]::part(foreground) {
          background: rgba(0,180,0,.8);
        }
      `
    ];
  }

  constructor() {
    super();
    this.axes = [];
    this.connected = false;
    this.id = 'Unknown Gamepad';
    this.index = 0;
    this.buttonPresses = [];
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('buttonPresses')) {
      const event = new CustomEvent('buttonPressChange', {
        bubbles: true,
        composed: true,
        detail: { buttonPresses: this.buttonPresses || [] }
      });
      this.dispatchEvent(event);
    } else if (changedProps.has('axes')) {
      const event = new CustomEvent('axesChange', {
        bubbles: true,
        composed: true,
        detail: { axes: this.axes || [] }
      });
      this.dispatchEvent(event);
    }
  }

  render() {
        
    return html`
      <label part="header">
        ${this.index}: <span part="name">${this.id}</span>
      </label>
      ${this.buttonPresses ? html`
        <div part="buttons">
          ${this.buttonPresses.map((pressed, index) => html`
            <vaadin-checkbox ?checked="${pressed}" disabled>
              B${index + 1}
            </vaadin-checkbox>
          `)}
        </div>
      ` : ''}
      ${this.axes ? html`
        <div part="axes">
          ${this.axes.map((axis, index) => html`
            <div part="axis">
              <label>A${index}</label>
              <frc-bar
                ?positive="${axis >= 0}"
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
      ` : ''} 
    `;
  }
}

webbitRegistry.define('frc-sim-gamepad', Gamepad);