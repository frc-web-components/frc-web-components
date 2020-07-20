import { html, css } from '@webbitjs/webbit';
import Container from '../../container';

function getRange(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
} 

export default class DigitalIOs extends Container {

  static get metadata() {
    return {
      displayName: 'DIOs',
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

        frc-dio {
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
    this.display = 'inline-block';
    this.height = 'auto';
    this.width = 'auto';
    this.fontFamily = 'sans-serif';
  }

  renderInputs() {
    if (!this.hasSource()) {
      return html`<p>Add source to show DIOs.</p>`;
    }

    const source = this.getSource();
    const sourceKey = this.sourceKey;
    const sourceProvider = this.sourceProvider;

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
      return html`<p>No DIOs</p>`;
    }

    return html`
      <div part="inputs">
        ${initializedDIOs.map(dio => html`
          <label>
            ${dio.input ? 'In' : 'Out'}[${dio.index}]
          </label>
          <frc-dio
            source-key="${dio.sourceKey}"
            source-provider="${sourceProvider}"
          ></frc-dio>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <label part="header">DIO</label>
      ${this.renderInputs()}
    `;
  }
}

webbitRegistry.define('frc-dios', DigitalIOs);