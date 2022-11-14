import { containerStyles } from '../styles';
import { svg, css, LitElement } from 'lit';

export const elementName = 'frc-gyro';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

export const elementConfig = {
  dashboard: {
    displayName: 'Gyro',
  },
  properties: {
    value: { type: Number, primary: true },
    hideLabel: { type: Boolean, attribute: 'hide-label' },
    precision: { type: Number, defaultValue: 2 },
  },
};

class Gyro extends LitElement {
  static properties = elementConfig.properties;

  static styles = [
    containerStyles,
    css`
      :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 300px;
        height: auto;
      }

      .container {
        position: relative;
        width: var(--gyro-container-size);
        height: var(--gyro-container-size);
      }

      svg {
        width: 80%;
        height: 80%;
        position: relative;
        top: 5%;
        left: 10%;
        overflow: visible;
      }

      :host([hide-label]) svg {
        width: 90%;
        height: 90%;
        top: 5%;
        left: 5%;
      }

      svg .edge {
        fill: none;
        stroke: var(--frc-gyro-edge-color, #000);
        stroke-width: 1px;
        overflow: overlay;
      }

      .tick {
        stroke: var(--frc-gyro-tick-color, #bbb);
        stroke-width: 1px;
      }

      .tick.big {
        stroke-width: 2px;
        stroke: var(--frc-gyro-big-tick-color, #000);
      }

      .dial-circle {
        fill: var(--frc-gyro-dial-circle-color, #ddd);
        stroke: var(--frc-gyro-dial-circle-stroke-color, #fff);
        stroke-width: 1%;
      }

      .dial-hand {
        fill: blue;
        stroke: blue;
        stroke-width: 3px;
      }

      .degree-label {
        fill: var(--frc-gyro-text-color, #000);
        text-anchor: middle;
        alignment-baseline: middle;
        font-size: var(--degree-label-font-size);
      }

      .angle-label {
        fill: var(--frc-gyro-text-color, #000);
        text-anchor: middle;
        font-size: var(--angle-label-font-size);
      }
    `,
  ];

  constructor() {
    super();

    this.value = 0;
    this.hideLabel = false;
    this.precision = 2;

    this.tickAngles = [];

    for (let angle = 0; angle <= 360; angle += 5) {
      this.tickAngles.push(angle);
    }

    this.degreeLabelAngles = [];

    for (let angle = 0; angle < 360; angle += 45) {
      this.degreeLabelAngles.push(angle);
    }
  }

  firstUpdated() {
    this.containerNode = this.shadowRoot.querySelector('.container');
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
  }

  resized() {
    const { width, height } = this.getBoundingClientRect();
    this.containerNode.style.setProperty(
      '--gyro-container-size',
      `${Math.min(width, height)}px`
    );
    this.requestUpdate();
  }

  getWidth() {
    const edgeElement = this.shadowRoot.querySelector('svg');

    if (!edgeElement) {
      return 0;
    }

    const { width } = edgeElement.getBoundingClientRect();
    return width;
  }

  renderTicks() {
    const width = this.getWidth();
    const innerRadius = width / 2 - width / 20;
    const outerRadius = width / 2 - width / 10;

    return svg`
      ${this.tickAngles.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        const x1 = width / 2 + innerRadius * Math.cos(radians);
        const y1 = width / 2 + innerRadius * Math.sin(radians);
        const x2 = width / 2 + outerRadius * Math.cos(radians);
        const y2 = width / 2 + outerRadius * Math.sin(radians);
        const bigTick = angle % 45 === 0;
        return svg`
          <line
            class="tick ${bigTick ? 'big' : ''}"
            x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          />
        `;
      })}
    `;
  }

  renderEdge() {
    const width = this.getWidth();
    const cx = width * 0.5;
    const cy = width * 0.5;
    const radius = width * 0.4;

    return svg`
      <circle class="edge" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDialHand() {
    const width = this.getWidth();

    const outerRadius = width / 2 - width / 20 - width / 40;

    const radians = ((this.value - 90) * Math.PI) / 180;

    const x1 = width / 2;
    const y1 = width / 2;
    const x2 = width / 2 + outerRadius * Math.cos(radians);
    const y2 = width / 2 + outerRadius * Math.sin(radians);

    return svg`
      <line
        class="dial-hand"
        x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      />
    `;
  }

  renderDialCircle() {
    const width = this.getWidth();
    const cx = width * 0.5;
    const cy = width * 0.5;
    const radius = width * 0.04;

    return svg`
      <circle class="dial-circle" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDegreeLabels() {
    const width = this.getWidth();
    const radius = width / 2 + width / 100;

    const edgeElement = this.shadowRoot.querySelector('svg');

    if (edgeElement) {
      edgeElement.style.setProperty(
        '--degree-label-font-size',
        `${width * 0.055}px`
      );
    }

    return svg`
      ${this.degreeLabelAngles.map((angle) => {
        const radians = ((angle - 90) * Math.PI) / 180;
        const x = width / 2 + radius * Math.cos(radians);
        const y = width / 2 + radius * Math.sin(radians);

        return svg`
          <text class="degree-label" x="${x}" y="${y}">${angle}</text>
        `;
      })}
    `;
  }

  renderAngleLabel() {
    if (this.hideLabel) {
      return null;
    }

    const width = this.getWidth();

    const edgeElement = this.shadowRoot.querySelector('svg');

    if (edgeElement) {
      edgeElement.style.setProperty(
        '--angle-label-font-size',
        `${width * 0.08}px`
      );
    }

    const x = width / 2;
    const y = width + width * 0.15;

    return svg`
      <text class="angle-label" x="${x}" y="${y}">
        ${this.value.toFixed(clamp(this.precision, 0, 100))}&deg;
      </text>
    `;
  }

  render() {
    return svg`
      <div class="container">
        <svg>
          ${this.renderEdge()}
          ${this.renderTicks()}
          ${this.renderDialHand()}
          ${this.renderDialCircle()}
          ${this.renderDegreeLabels()}
          ${this.renderAngleLabel()}
        </svg>
      </div>
    `;
  }
}

customElements.define(elementName, Gyro);
