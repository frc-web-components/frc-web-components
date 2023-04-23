import { html, css, LitElement } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { select } from 'd3';

export default class TableAxis extends LitElement {
  @property({ type: Boolean }) vertical = false;
  @property({ type: Number }) ticks = 0;
  @property({ type: Array }) range = [];
  @property({ type: String }) unit = '';

  @state() prevSize = 0;
  @state() prevTicks = 0;
  @state() prevMin: number | null = null;
  @state() prevMax: number | null = null;

  @query('#svg') svg!: HTMLElement;

  static styles = css`
    :host {
      display: block;
    }

    :host([vertical]) {
      height: 100%;
    }

    :host(:not([vertical])) {
      width: 100%;
    }

    svg {
      overflow: visible;
    }

    line {
      stroke: rgb(150, 150, 150);
      stroke-width: 2;
    }

    text {
      font-weight: normal;
      font-size: 13px;
      fill: var(--frc-tab-axis-text-color, #000);
    }
  `;

  setAxis(changedProps: Map<string, unknown>) {
    const size = this.vertical ? this.clientHeight : this.clientWidth;
    const tickSpacing = size / Math.max(1, this.ticks - 1);
    const width = this.range ? 30 : 10;
    const showNums = this.range && this.range.length === 2;
    const min = showNums ? this.range[0] : 0;
    const max = showNums ? this.range[1] : 0;

    let lastTickWithText = -Infinity;
    let textEnd = -Infinity;

    // Prevent update if nothing has changed
    if (
      this.prevSize === size &&
      this.prevTicks === this.ticks &&
      this.prevMin === min &&
      this.prevMax === max &&
      !changedProps.has('unit')
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

      if (showNums) {
        if (!this.vertical) {
          // check to see if text will fit
          const spaceBetweenTicks = (i - lastTickWithText) * tickSpacing;
          const pointWhereNewTextCanBegin =
            lastTickWithText * tickSpacing + spaceBetweenTicks * 0.4;
          const textWillFit =
            textEnd < 0 || pointWhereNewTextCanBegin > textEnd;

          if (textWillFit) {
            const value = min + (i * (max - min)) / Math.max(this.ticks - 1, 1);

            const textEl = svg
              .append('text')
              .attr('x', i * tickSpacing)
              .attr('y', 25)
              .attr('text-anchor', 'middle')
              .text(value.toFixed(2) + (this.unit ? ` ${this.unit}` : ''));

            textEnd =
              i * tickSpacing + (textEl.node()?.getBBox().width ?? 0) / 2;
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

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html` <svg id="svg"></svg> `;
  }
}

if (!customElements.get('frc-table-axis')) {
  customElements.define('frc-table-axis', TableAxis);
}
