import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

function getRange(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
} 

export default class AnalogInputs extends Container {

  static get metadata() {
    return {
      displayName: 'Analog Inputs',
      category: 'Simulation',
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
    };
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        [part=inputs] {
          width: 100%;
          display: inline-grid;
          grid-template-columns: min-content auto;
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

        frc-analog-input {
          width: 100%;
          min-width: 50px;
          padding: 0;
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
    this.sourceKey = 'AI';
    this.sourceProvider = 'HALSim';

    this.display = 'inline-block';
    this.height = 'auto';
    this.width = '250px';
    this.fontFamily = 'sans-serif';
  }

  renderInputs() {

    const source = this.getSource();
    const sourceKey = this.sourceKey;
    const sourceProvider = this.sourceProvider;

    if (!this.hasSource()) {
      return html`<p>Add source to show analog inputs.</p>`;
    }

    if (!source) {
      return html`<p>Start HALSim back-end show analog inputs.</p>`;
    }

    const initializedAnalogs = getRange(8)
      .map(index => {
        const initialized = source[index] && source[index].init;
        return {
          index,
          initialized,
          sourceKey: `${sourceKey}/${index}`
        };
      })
      .filter(({ initialized }) => initialized);

    if (initializedAnalogs.length === 0) {
      return html`<p>No analog inputs</p>`;
    }

    return html`
      <div part="inputs">
        ${initializedAnalogs.map(analogInput => html`
          <label>${analogInput.index}</label>
          <frc-analog-input 
            source-key="${analogInput.sourceKey}"
            source-provider="${sourceProvider}"
          ></frc-analog-input>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <label part="header">Analog Inputs</label>
      ${this.renderInputs()}
    `;
  }
}

webbitRegistry.define('frc-analog-inputs', AnalogInputs);