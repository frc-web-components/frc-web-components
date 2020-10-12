import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

function getRange(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
} 

export default class Encoders extends Webbit {

  static get metadata() {
    return {
      displayName: 'Encoders',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      resizable: { left: true, right: true },
      minSize: { width: 230 }
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

        frc-sim-encoder {
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
    this.sourceKey = 'Encoder';
    this.sourceProvider = 'HALSim';
  }

  renderInputs() {

    const source = this.getSource();
    const sourceKey = this.sourceKey;
    const sourceProvider = this.sourceProvider;

    if (!this.hasSource()) {
      return html`<p>Add source to show encoders.</p>`;
    }

    if (!source) {
      return html`<p>Start HALSim back-end to show encoders.</p>`;
    }

    const initializedEncoders = getRange(8)
      .map(index => {
        const initialized = source[index] && source[index].init;
        return {
          index,
          initialized,
          sourceKey: `${sourceKey}/${index}`
        };
      })
      .filter(({ initialized }) => initialized);

    if (initializedEncoders.length === 0) {
      return html`<p>No encoders</p>`;
    }

    return html`
      ${initializedEncoders.map(encoder => html`
        <vaadin-accordion>
          <vaadin-accordion-panel theme="small">
            <div slot="summary">Encoder ${encoder.index}</div>
            <frc-sim-encoder 
              source-key="${encoder.sourceKey}"
              source-provider="${sourceProvider}"
            ></frc-sim-encoder>
          </vaadin-accordion-panel>
        </vaadin-accordion>
      `)}
    `;
  }

  render() {
    return html`
      <label part="header">Encoders</label>
      ${this.renderInputs()}
    `;
  }
}

webbitRegistry.define('frc-sim-encoders', Encoders);