import { html, css, LitElement } from 'lit';
import { containerStyles } from '../styles';
import SvgGauge from 'svg-gauge';

export const elementName = 'frc-gauge';

export const elementConfig = {
  dashboard: {
    displayName: 'Gauge',
  },
  properties: {
    min: { type: Number },
    max: { type: Number, defaultValue: 100 },
    value: { type: Number, primary: true },
  },
};

class Gauge extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
      :host {
        width: 200px;
        height: 200px;
      }

      .gauge-container-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .gauge-container {
        display: block;
      }

      .gauge-container > .gauge > .dial {
        stroke: #ddd;
        stroke-width: 3;
        fill: rgba(0, 0, 0, 0);
        stroke: var(--frc-gauge-color, rgb(221, 221, 221));
      }
      .gauge-container > .gauge > .value {
        stroke: var(--frc-gauge-fill-color, rgb(47, 180, 200));
        stroke-width: 3;
        fill: rgba(0, 0, 0, 0);
      }
      .gauge-container > .gauge .value-text {
        fill: var(--frc-gauge-text-color, rgb(100, 100, 100));
        font-family: sans-serif;
        font-size: 1em;
      }
    `,
  ];

  constructor() {
    super();
    this.gauge = null;

    this.min = 0;
    this.max = 100;
    this.value = 0;
  }

  setSize() {
    const rect = this.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const size = Math.min(svgWidth, svgHeight);
    this.shadowRoot.getElementById('gauge').style.width = size + 'px';
  }

  gaugeInit() {
    const gaugeElement = this.shadowRoot.getElementById('gauge');
    gaugeElement.innerHTML = '';

    this.gauge = SvgGauge(gaugeElement, {
      min: Math.min(this.min, this.max),
      max: Math.max(this.min, this.max),
      value: 0,
    });

    this.setSize();
  }

  firstUpdated() {
    this.gaugeInit();
    const resizeObserver = new ResizeObserver(() => this.setSize());
    resizeObserver.observe(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.gaugeInit();
    }
    this.gauge.setValue(this.value);
  }

  render() {
    return html`
      <div class="gauge-container-container">
        <div id="gauge" class="gauge-container"></div>
      </div>
    `;
  }
}

customElements.define(elementName, Gauge);
