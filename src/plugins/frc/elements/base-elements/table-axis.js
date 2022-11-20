import { LitElement, html, css } from 'lit';
import * as d3 from 'd3';

export const elementName = 'frc-table-axis';

export const elementConfig = {
  dashboard: {
    topLevel: false,
    displayName: 'Table Axis',
  },
  properties: {
    vertical: { type: Boolean },
    ticks: { type: Number },
    range: { type: Array },
    unit: { type: String },
  },
};

class TableAxis extends LitElement {
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

  static properties = elementConfig.properties;

  constructor() {
    super();
    this.prevSize = 0;
    this.prevTicks = 0;
    this.prevMin = null;
    this.prevMax = null;

    // defaults
    this.vertical = false;
    this.ticks = 0;
    this.range = [];
    this.unit = '';
  }

  setAxis(changedProps) {
    let size = this.vertical ? this.clientHeight : this.clientWidth;
    let tickSpacing = size / Math.max(1, this.ticks - 1);
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
    } else {
      this.prevSize = size;
      this.prevTicks = this.ticks;
      this.prevMin = min;
      this.prevMax = max;
    }

    this.shadowRoot.getElementById('svg').innerHTML = '';

    let svg = d3
      .select(this.shadowRoot.getElementById('svg'))
      .attr('width', !this.vertical ? size : width)
      .attr('height', !this.vertical ? width : size);

    for (let i = 0; i < this.ticks; i++) {
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
          let spaceBetweenTicks = (i - lastTickWithText) * tickSpacing;
          let pointWhereNewTextCanBegin =
            lastTickWithText * tickSpacing + spaceBetweenTicks * 0.4;
          let textWillFit = textEnd < 0 || pointWhereNewTextCanBegin > textEnd;

          if (textWillFit) {
            const value = min + (i * (max - min)) / Math.max(this.ticks - 1, 1);

            let textEl = svg
              .append('text')
              .attr('x', i * tickSpacing)
              .attr('y', 25)
              .attr('text-anchor', 'middle')
              .text(value.toFixed(2) + (this.unit ? ` ${this.unit}` : ''));

            textEnd = i * tickSpacing + textEl.node().getBBox().width / 2;
            lastTickWithText = i;
          }
        } else {
          const value = min + (i * (max - min)) / Math.max(this.ticks - 1, 1);

          let textEl = svg
            .append('text')
            .attr('x', -3)
            .attr('y', i * tickSpacing + 4)
            .attr('text-anchor', 'end')
            .text(value.toFixed(2) + (this.unit ? ` ${this.unit}` : ''));
        }
      }

      // don't do this for last tick
      if (i < this.ticks - 1) {
        for (let j = 1; j < 4; j++) {
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

  updated(changedProps) {
    this.setAxis(changedProps);
  }

  render() {
    return html` <svg id="svg"></svg> `;
  }
}

customElements.define(elementName, TableAxis);
