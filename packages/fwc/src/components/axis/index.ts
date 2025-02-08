import { html, css, LitElement } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { select } from 'd3';
import { WebbitConfig } from '@webbitjs/webbit';

export const axisDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    topLevel: false,
    displayName: 'Axis',
  },
  properties: {
    vertical: { type: 'Boolean' },
    ticks: { type: 'Number', defaultValue: 5 },
    min: { type: 'Number', defaultValue: -1 },
    max: { type: 'Number', defaultValue: 1 },
    unit: { type: 'String' },
  },
};

export class Axis extends LitElement {
  @property({ type: Boolean }) vertical = false;
  @property({ type: Number }) ticks = 5;
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: String }) unit = '';

  @state() prevSize = 0;
  @state() prevTicks = 0;
  @state() prevMin: number | null = null;
  @state() prevMax: number | null = null;

  @query('#svg') svg!: HTMLElement;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    :host([vertical]) {
      height: 100%;
    }

    :host(:not([vertical])) {
      width: 100%;
    }

    svg {
      overflow: visible;
      position: absolute;
      top: 0;
      left: 0;
    }

    line {
      stroke: rgb(150, 150, 150);
      stroke-width: 2;
    }

    text {
      font-weight: normal;
      font-size: 13px;
      fill: var(--frc-axis-text-color, #000);
    }
  `;

  setAxis(changedProps: Map<string, unknown>) {
    const size = this.vertical ? this.clientHeight : this.clientWidth;
    const tickSpacing = size / Math.max(1, this.ticks - 1);
    const width = 30;
    const { min, max } = this;

    let lastTickWithText = -Infinity;
    let textEnd = -Infinity;

    // Prevent update if nothing has changed
    if (
      this.prevSize === size &&
      this.prevTicks === this.ticks &&
      this.prevMin === min &&
      this.prevMax === max &&
      !changedProps.has('unit') &&
      !changedProps.has('vertical')
    ) {
      return;
    }
    this.prevSize = size;
    this.prevTicks = this.ticks;
    this.prevMin = min;
    this.prevMax = max;

    this.svg.innerHTML = '';

    const svg = select(this.svg)
      .attr('width', !this.vertical ? size : width)
      .attr('height', !this.vertical ? width : size);

    for (let i = 0; i < this.ticks; i += 1) {
      if (!this.vertical) {
        svg
          .append('line')
          .attr('x1', i * tickSpacing)
          .attr('y1', 0)
          .attr('x2', i * tickSpacing)
          .attr('y2', 8);
      } else {
        svg
          .append('line')
          .attr('x1', 0)
          .attr('y1', i * tickSpacing)
          .attr('x2', 8)
          .attr('y2', i * tickSpacing);
      }

      if (!this.vertical) {
        // check to see if text will fit
        const spaceBetweenTicks = (i - lastTickWithText) * tickSpacing;
        const pointWhereNewTextCanBegin =
          lastTickWithText * tickSpacing + spaceBetweenTicks * 0.4;
        const textWillFit = textEnd < 0 || pointWhereNewTextCanBegin > textEnd;

        if (textWillFit) {
          const value = min + (i * (max - min)) / Math.max(this.ticks - 1, 1);

          const textEl = svg
            .append('text')
            .attr('x', i * tickSpacing)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .text(value.toFixed(2) + (this.unit ? ` ${this.unit}` : ''));

          textEnd = i * tickSpacing + (textEl.node()?.getBBox().width ?? 0) / 2;
          lastTickWithText = i;
        }
      } else {
        const value = min + (i * (max - min)) / Math.max(this.ticks - 1, 1);

        svg
          .append('text')
          .attr('x', -3)
          .attr('y', i * tickSpacing + 4)
          .attr('text-anchor', 'end')
          .text(value.toFixed(2) + (this.unit ? ` ${this.unit}` : ''));
      }

      // don't do this for last tick
      if (i < this.ticks - 1) {
        for (let j = 1; j < 4; j += 1) {
          if (!this.vertical) {
            svg
              .append('line')
              .attr('x1', i * tickSpacing + (j * tickSpacing) / 4)
              .attr('y1', 0)
              .attr('x2', i * tickSpacing + (j * tickSpacing) / 4)
              .attr('y2', 4);
          } else {
            svg
              .append('line')
              .attr('x1', 4)
              .attr('y1', i * tickSpacing + (j * tickSpacing) / 4)
              .attr('x2', 8)
              .attr('y2', i * tickSpacing + (j * tickSpacing) / 4);
          }
        }
      }
    }
  }

  firstUpdated() {
    const resizeObserver = new ResizeObserver(() => {
      this.requestUpdate();
    });
    resizeObserver.observe(this);
  }

  updated(changedProps: Map<string, unknown>) {
    this.setAxis(changedProps);
  }

  render() {
    return html` <svg id="svg"></svg> `;
  }
}

export default Axis;

if (!customElements.get('frc-axis')) {
  customElements.define('frc-axis', Axis);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-axis': Axis;
  }
}
