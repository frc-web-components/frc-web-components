import { html, svg, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
// TODO: We should only import the parts we need
import * as d3 from 'd3';
import { WebbitConfig } from '@webbitjs/webbit';

export const gyroDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Gyro',
  },
  properties: {
    value: { type: 'Number', primary: true },
    hideLabel: { type: 'Boolean', attribute: 'hide-label' },
    precision: { type: 'Number', defaultValue: 2 },
    counterClockwise: { type: 'Boolean', attribute: 'counter-clockwise' },
    fromRadians: { type: 'Boolean', attribute: 'from-radians' },
  },
};

function deg2Rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function rad2Deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(value, min));
}

/**
 *
 * @param angleDeg - top is 0, increases cw. Should be converted to right 0, increases ccw.
 * @returns
 */
function getUnitCircleCords(
  angleDeg: number,
  counterClockwise = false,
): [number, number] {
  const unitAngle = deg2Rad(-(angleDeg - 90));
  const x = counterClockwise ? -Math.cos(unitAngle) : Math.cos(unitAngle);
  return [x, Math.sin(unitAngle)];
}

export class Gyro extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Boolean, attribute: 'hide-label' }) hideLabel = false;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'counter-clockwise' })
  counterClockwise = false;
  @property({ type: Boolean, attribute: 'from-radians' }) fromRadians = false;

  @query('svg') _svg!: SVGSVGElement;
  @query('.dial') _dial!: SVGLineElement;
  @query('.gyro') _gyro!: SVGGElement;
  @query('.gyro-edge') _gyroEdge!: SVGCircleElement;
  @query('.minor-ticks') _minorTicks!: SVGGElement;
  @query('.major-ticks') _majorTicks!: SVGGElement;
  @query('.labels') _labels!: SVGGElement;

  static styles = css`
    :host {
      font-family: sans-serif;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 300px;
      height: auto;
    }

    svg {
      width: 100%;
    }

    label {
      color: var(--frc-gyro-color, #000);
      text-align: center;
      display: block;
      font-size: 16px;
    }

    .dial-circle {
      fill: var(--frc-gyro-dial-color, blue);
    }

    .dial {
      stroke: var(--frc-gyro-dial-color, blue);
      stroke-width: 3;
    }
  `;

  setLabels(): void {
    const chartRadius = this.getGyroRadius();
    d3.select(this._labels)
      .selectAll('text')
      .data([0, 45, 90, 135, 180, -135, -90, -45])
      .join((enter) =>
        enter
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', 15)
          .attr('fill', 'var(--frc-gyro-color, #000)')
          .text((angle) => `${angle}°`),
      )
      .attr(
        'x',
        (angle) =>
          getUnitCircleCords(angle, this.counterClockwise)[0] *
          (chartRadius + 30),
      )
      .attr(
        'y',
        (angle) =>
          -getUnitCircleCords(angle, this.counterClockwise)[1] *
          (chartRadius + 30),
      );
  }

  setDialAngle(): void {
    const chartRadius = this.getGyroRadius();
    const angle = this.fromRadians ? rad2Deg(this.value) : this.value;
    d3.select(this._dial)
      .attr(
        'x2',
        getUnitCircleCords(angle, this.counterClockwise)[0] * (chartRadius - 7),
      )
      .attr(
        'y2',
        -getUnitCircleCords(angle, this.counterClockwise)[1] *
          (chartRadius - 7),
      );
  }

  addTicks(
    parent: SVGElement,
    tickLength: number,
    step: number,
    strokeWidth: number,
  ): void {
    const chartRadius = this.getGyroRadius();
    d3.select(parent)
      .selectAll('line')
      .data(d3.range(0, 360, step))
      .join((enter) =>
        enter
          .append('line')
          .attr('stroke', 'var(--frc-gyro-color, #000)')
          .attr('stroke-width', strokeWidth),
      )
      .attr('x1', (angle) => getUnitCircleCords(angle)[0] * chartRadius)
      .attr('y1', (angle) => -getUnitCircleCords(angle)[1] * chartRadius)
      .attr(
        'x2',
        (angle) => getUnitCircleCords(angle)[0] * (chartRadius + tickLength),
      )
      .attr(
        'y2',
        (angle) => -getUnitCircleCords(angle)[1] * (chartRadius + tickLength),
      );
  }

  firstUpdated(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
    this.resized();
  }

  resized(): void {
    const size = this.getSize();
    d3.select(this._svg).attr('width', size).attr('height', size);

    d3.select(this._gyro).attr(
      'transform',
      `translate(${size / 2},${size / 2})`,
    );

    const chartRadius = this.getGyroRadius();

    d3.select(this._gyroEdge).attr('r', chartRadius);

    this.addTicks(this._minorTicks, 5, 5, 1);
    this.addTicks(this._majorTicks, 10, 45, 2);
    this.setLabels();
    this.setDialAngle();
  }

  getSize(): number {
    const { width } = this.getBoundingClientRect();
    return width;
  }

  getGyroRadius(): number {
    return this.getSize() / 2 - 53;
  }

  updated(changedProps: Map<string, unknown>): void {
    if (
      changedProps.has('value') ||
      changedProps.has('fromRadians') ||
      changedProps.has('counterClockwise')
    ) {
      this.setDialAngle();
    }

    if (changedProps.has('counterClockwise')) {
      this.setLabels();
    }
  }

  render(): TemplateResult {
    const angle = this.fromRadians ? rad2Deg(this.value) : this.value;
    const label = `${angle.toFixed(clamp(this.precision, 0, 100))}`;
    return html`
      <div>
        ${svg`
          <svg>
            <g class="gyro">
              <circle class="gyro-edge" stroke-width="2" stroke="var(--frc-gyro-color, #000)" style="fill: none"></circle>
              <g class="minor-ticks"></g>
              <g class="major-ticks"></g>
              <g class="labels"></g>
              <circle class="dial-circle" r="9"></circle>
              <line class="dial" x1="0" x2="0"></line>
            </g>
          </svg>
        `} ${!this.hideLabel ? html`<label>${label}&deg</label> ` : null}
      </div>
    `;
  }
}

export default Gyro;

if (!customElements.get('frc-gyro')) {
  customElements.define('frc-gyro', Gyro);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-gyro': Gyro;
  }
}
