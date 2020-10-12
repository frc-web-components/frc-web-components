import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

function getRange(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
} 

export default class Relays extends Webbit {

  static get metadata() {
    return {
      displayName: 'Relays',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/'
      resizable: { left: true, right: true },
      minSize: { width: 50 }
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          height: auto;
          width: 250px;
          font-family: sans-serif;
        }

        [part=inputs] {
          width: 100%;
          display: inline-grid;
          grid-template-columns: min-content auto;
          grid-auto-rows: 30px;
          column-gap: 8px;
          align-items: center;
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

        frc-sim-relay {
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
    this.sourceKey = 'Relay';
    this.sourceProvider = 'HALSim';
  }

  renderInputs() {

    const source = this.getSource();
    const sourceKey = this.sourceKey;
    const sourceProvider = this.sourceProvider;

    if (!this.hasSource()) {
      return html`<p>Add source to show relays.</p>`;
    }

    if (!source) {
      return html`<p>Start HALSim back-end to show relays.</p>`;
    }

    const initializedRelays = getRange(4)
      .map(index => {
        const initialized = source[index] && (source[index].initFwd || source[index].initRev);
        return {
          index,
          initialized,
          sourceKey: `${sourceKey}/${index}`
        };
      })
      .filter(({ initialized }) => initialized);

    if (initializedRelays.length === 0) {
      return html`<p>No relays</p>`;
    }

    return html`
      <div part="inputs">
        ${initializedRelays.map(relay => html`
          <label>${relay.index}</label>
          <frc-sim-relay 
            source-key="${relay.sourceKey}"
            source-provider="${sourceProvider}"
          ></frc-sim-relay>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <label part="header">Relays</label>
      ${this.renderInputs()}
    `;
  }
}

webbitRegistry.define('frc-sim-relays', Relays);