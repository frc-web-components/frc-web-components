/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { svg, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { containerStyles } from '../styles';

export const elementName = 'frc-gyro';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(value, min));
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export const elementConfig = {
  dashboard: {
    displayName: 'Gyro',
  },
  properties: {
    value: { type: Number, primary: true },
    hideLabel: { type: Boolean, attribute: 'hide-label' },
    precision: { type: Number, defaultValue: 2 },
    counterClockwise: { type: Boolean, attribute: 'counter-clockwise' },
    fromRadians: { type: Boolean, attribute: 'from-radians' },
  },
};

@customElement('frc-gyro')
export class Gyro extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Boolean, attribute: 'hide-label' }) hideLabel = false;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'counter-clockwise' })
  counterClockwise = false;
  @property({ type: Boolean, attribute: 'from-radians' }) fromRadians = false;

  tickAngles: number[] = [];
  degreeLabelAngles: number[] = [];

  @query('.container') _containerNode!: HTMLElement;
  @query('svg') _edgeElement?: HTMLElement;

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

    for (let angle = 0; angle <= 360; angle += 5) {
      this.tickAngles.push(angle);
    }

    this.degreeLabelAngles = [];

    for (let angle = 0; angle < 360; angle += 45) {
      this.degreeLabelAngles.push(angle);
    }
  }

  firstUpdated(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
  }

  resized(): void {
    const { width, height } = this.getBoundingClientRect();
    this._containerNode.style.setProperty(
      '--gyro-container-size',
      `${Math.min(width, height)}px`
    );
    this.requestUpdate();
  }

  getWidth(): number {
    if (!this._edgeElement) {
      return 0;
    }

    const { width } = this._edgeElement.getBoundingClientRect();
    return width;
  }

  renderTicks(): TemplateResult {
    const width = this.getWidth();
    const innerRadius = width / 2 - width / 20;
    const outerRadius = width / 2 - width / 10;

    return svg`
      ${this.tickAngles.map((angle) => {
        const radians = toRadians(angle);
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

  renderEdge(): TemplateResult {
    const width = this.getWidth();
    const cx = width * 0.5;
    const cy = width * 0.5;
    const radius = width * 0.4;

    return svg`
      <circle class="edge" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDialHand(): TemplateResult {
    const width = this.getWidth();

    const outerRadius = width / 2 - width / 20 - width / 40;

    const radians = this.fromRadians
      ? this.value - Math.PI / 2
      : toRadians(this.value - 90);

    const sign = this.counterClockwise ? -1 : 1;

    const x1 = width / 2;
    const y1 = width / 2;
    const x2 = width / 2 + outerRadius * Math.cos(radians) * sign;
    const y2 = width / 2 + outerRadius * Math.sin(radians);

    return svg`
      <line
        class="dial-hand"
        x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      />
    `;
  }

  renderDialCircle(): TemplateResult {
    const width = this.getWidth();
    const cx = width * 0.5;
    const cy = width * 0.5;
    const radius = width * 0.04;

    return svg`
      <circle class="dial-circle" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDegreeLabels(): TemplateResult {
    const width = this.getWidth();
    const radius = width / 2 + width / 100;

    if (this._edgeElement) {
      this._edgeElement.style.setProperty(
        '--degree-label-font-size',
        `${width * 0.055}px`
      );
    }

    const sign = this.counterClockwise ? -1 : 1;

    return svg`
      ${this.degreeLabelAngles.map((angle) => {
        const radians = toRadians(angle - 90);
        const x = width / 2 + radius * Math.cos(radians) * sign;
        const y = width / 2 + radius * Math.sin(radians);

        return svg`
          <text class="degree-label" x="${x}" y="${y}">${angle}</text>
        `;
      })}
    `;
  }

  renderAngleLabel(): TemplateResult | null {
    if (this.hideLabel) {
      return null;
    }

    const width = this.getWidth();

    if (this._edgeElement) {
      this._edgeElement.style.setProperty(
        '--angle-label-font-size',
        `${width * 0.08}px`
      );
    }

    const x = width / 2;
    const y = width + width * 0.15;

    const value = this.fromRadians ? toDegrees(this.value) : this.value;

    return svg`
      <text class="angle-label" x="${x}" y="${y}">
        ${value.toFixed(clamp(this.precision, 0, 100))}&deg;
      </text>
    `;
  }

  render(): TemplateResult {
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
