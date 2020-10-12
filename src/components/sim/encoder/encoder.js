import { Webbit, html, css } from '@webbitjs/webbit';
import { containerStyles } from '../../styles';

export default class Encoder extends Webbit {

  static get metadata() {
    return {
      displayName: 'Encoder',
      category: 'Simulation',
      slots: [],
      // description: 'Component for displaying data from a 3-axis accelerometer.',
      // documentationLink: 'https://frc-web-components.github.io/components/number-bar/',
      resizable: { left: true, right: true },
      minSize: { width: 230 }
    };
  }

  static get properties() {
    return {
      count: { type: Number },
      maxPeriod: { type: Number },
      period: { type: Number },
      reverseDirection: { type: Boolean },
    };
  }

  static get styles() {
    return [
      containerStyles,
      css`
        :host {
          display: inline-block;
          width: 300px;
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

        vaadin-checkbox::part(checkbox) {
          margin: 0;
        }

        vaadin-checkbox::part(checkbox)::after {
          border-color: black;
        }
      `
    ];
  }

  constructor() {
    super();

    // this.distPerCount = 0;
    this.count = 0;
    this.maxPeriod = 0;
    this.period = 0;
    this.reverseDirection = false;
    // this.direction = 'reverse';
  }

  onCountChange(ev) {
    const input = ev.target || ev.path[0];
    this.count = parseFloat(input.value) || 0;
  }

  onPeriodChange(ev) {
    const input = ev.target || ev.path[0];
    this.period = parseFloat(input.value);
  }

  render() {
    return html`
      <div part="form">
        <!-- <label>Dist/Count</label>
        <vaadin-number-field
          part="input"
          value="${this.distPerCount}" 
          theme="small"
          readonly
        ></vaadin-number-field> -->

        <label>Count</label>
        <vaadin-number-field 
          part="input" 
          value="${this.count}" 
          clear-button-visible
          has-controls
          theme="small"
          @change="${this.onCountChange}"
        ></vaadin-number-field>

        <label>Max Period</label>
        <vaadin-number-field
          part="input"
          value="${this.maxPeriod}" 
          theme="small"
          readonly
        ></vaadin-number-field>

        <label>Period</label>
        <vaadin-number-field 
          part="input" 
          value="${this.period}" 
          theme="small"
          @change="${this.onPeriodChange}"
        ></vaadin-number-field>

        <label>Reverse Direction</label>
        <vaadin-checkbox 
          part="input" 
          ?checked="${this.reverseDirection}"
          disabled
        ></vaadin-checkbox>

        <!-- <label>Direction</label>
        <vaadin-select 
          part="input" 
          theme="small" 
          value="${this.direction}"
          @change="${this.onDirectionChange}"
        >
          <template>
            <vaadin-list-box>
              <vaadin-item value="reverse">reverse</vaadin-item>
              <vaadin-item value="forward">forward</vaadin-item>
            </vaadin-list-box>
          </template>
        </vaadin-select> -->
      </div>
    `;
  }
}

webbitRegistry.define('frc-sim-encoder', Encoder);