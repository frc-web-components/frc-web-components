import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

function getRange(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
} 

export default class DigitalIOs extends Webbit {

  static get metadata() {
    return {
      displayName: 'DIOs',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      resizable: { left: true, right: true },
      minSize: { width: 50 }
    };
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          height: auto;
          width: auto;
          font-family: sans-serif;
        }

        [part=inputs] {
          width: 100%;
          display: inline-grid;
          grid-template-columns: min-content 30px;
          align-items: center;
          grid-auto-rows: 25px;
          column-gap: 8px;
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
        }

        frc-sim-dio {
          width: 100%;
          min-width: 50px;
          padding: 0;
          margin: 0;
        }

        p {
          margin: 0;
          font-size: 14px;
        }      
      `
    ];
  }

  constructor() {
    super();
    this.sourceKey = 'DIO';
    this.sourceProvider = 'HALSim';
  }

  renderInputs() {

    const source = this.getSource();
    const sourceKey = this.sourceKey;
    const sourceProvider = this.sourceProvider;

    if (!this.hasSource()) {
      return html`
        <label part="header">DIO</label>
        <p>Add source to show DIO devices.</p>
      `;
    }

    if (!source) {
      return html`
        <label part="header">DIO</label>
        <p>Start HALSim back-end to show DIO devices.</p>
      `;
    }

    const initializedDIOs = getRange(31)
      .map(index => {
        const initialized = source[index] && source[index].init;
        const input = source[index] && source[index].input;
        return {
          index,
          initialized,
          input,
          sourceKey: `${sourceKey}/${index}`
        };
      })
      .filter(({ initialized }) => initialized);

    if (initializedDIOs.length === 0) {
      return html`
        <label part="header">DIO</label>
        <p>No DIO devices</p>
      `;
    }

    return html`
      <div part="inputs">
        <label part="header">DIO</label>
        <div></div>
        ${initializedDIOs.map(dio => html`
          <label>
            ${dio.input ? 'In' : 'Out'}[${dio.index}]
          </label>
          <frc-sim-dio
            source-key="${dio.sourceKey}"
            source-provider="${sourceProvider}"
          ></frc-sim-dio>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderInputs()}
    `;
  }
}

webbitRegistry.define('frc-sim-dios', DigitalIOs);