import { WebbitConfig } from '@webbitjs/webbit';
import { html, css, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import SvgGauge, { GaugeInstance } from 'svg-gauge';

export const gaugeDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Gauge',
  },
  properties: {
    min: { type: 'Number' },
    max: { type: 'Number', defaultValue: 100 },
    value: { type: 'Number', primary: true },
  },
};

// TODO: Could use an upgrade. Maybe something like this? https://d3gaugechart.mxapps.io/
export class Gauge extends LitElement {
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) value = 0;

  @query('#gauge') gaugeElement!: HTMLElement;
  gauge?: GaugeInstance;

  static styles = css`
    :host {
      display: inline-block;
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
  `;

  setSize() {
    const rect = this.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const size = Math.min(svgWidth, svgHeight);
    this.gaugeElement.style.width = `${size}px`;
  }

  gaugeInit() {
    this.gaugeElement.innerHTML = '';
    this.gauge = SvgGauge(this.gaugeElement, {
      min: Math.min(this.min, this.max),
      max: Math.max(this.min, this.max),
    });
    this.setSize();
  }

  firstUpdated() {
    this.gaugeInit();
    const resizeObserver = new ResizeObserver(() => this.setSize());
    resizeObserver.observe(this);
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this.gaugeInit();
    }
    this.gauge?.setValue(this.value);
  }

  render() {
    return html`
      <div class="gauge-container-container">
        <div id="gauge" class="gauge-container"></div>
      </div>
    `;
  }
}

export default Gauge;

if (!customElements.get('frc-gauge')) {
  customElements.define('frc-gauge', Gauge);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-gauge': Gauge;
  }
}
