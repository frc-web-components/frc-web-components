import { css, LitElement, svg } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';
import getRealTimeXAxis, { getXAxis } from './real-time-x-axis';

export default class LineChart extends LitElement {
  @property({ type: Number, attribute: 'start-time' }) startTime = 0;
  @property({ type: Boolean }) value = false;
  @state() data: number[] = [];

  @query('.data-path') path!: SVGPathElement;
  @query('svg') svg!: SVGSVGElement;
  @query('.axis--x') xAxis!: SVGSVGElement;

  elapsedTime = 0;

  static styles = css`
    .line {
      fill: none;
      stroke: #000;
      stroke-width: 1.5px;
    }
  `;

  firstUpdated(): void {
    const n = 40 * 20;
    const random = d3.randomNormal(0.5, 0.1);
    this.data = d3.range(n).map(random);

    this.startTime = Date.now();

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  updateChart() {
    this.elapsedTime = Date.now() - this.startTime;

    this.requestUpdate();

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  tick(pathElement: SVGPathElement): void {
    const { width, height } = LineChart.getDimensions();

    const x = getXAxis(width, 10 * 1000, this.elapsedTime);
    const y = LineChart.getYAxis(height);

    // Push a new data point onto the back.
    this.data.push(Math.random());

    const line = d3
      .line()
      .curve(d3.curveBasis)
      .x((d, i) => x(i))
      .y((d, i) => y(d as any));

    // Redraw the line.
    d3.select(pathElement)
      .attr('d', line as any)
      .attr('transform', null);

    // Slide it to the left.
    d3.active(pathElement)!
      .attr('transform', `translate(${x(0)},0)`)
      .transition()
      .duration(1000 / 60)
      .ease(d3.easeLinear)
      .on('start', () => this.tick(pathElement));

    // Pop the old data point off the front.
    this.data.shift();
  }

  static getYAxis(height: number) {
    return d3.scaleLinear().domain([-1, 1]).range([height, 0]);
  }

  static getDimensions() {
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const svgWidth = 960;
    const svgHeight = 500;

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    return {
      margin,
      svgWidth,
      svgHeight,
      width,
      height,
    };
  }

  render() {
    const { margin, svgWidth, svgHeight, width, height } =
      LineChart.getDimensions();

    const y = LineChart.getYAxis(height);

    return svg`
      <svg width=${svgWidth} height=${svgHeight}>
        <g transform="translate(${margin.left},${margin.top})">
          <defs>
            <clipPath id="clip">
              <rect width=${width} height=${height}></rect>
            </clipPath>
          </defs>
          <g transform="translate(0,${height})">
            ${getRealTimeXAxis(width, 10 * 1000, this.elapsedTime)}
          </g>
          <g 
            class="axis axis--y" 
            ${ref((yAxis) => {
              d3.axisLeft(y)(d3.select(yAxis as SVGGElement));
            })}>
          </g>
          <g clip-path="url(#clip)">
            <path 
              class="data-path"
              ${ref((pathElement) => {
                const path = d3.select(pathElement as SVGPathElement);
                path
                  .datum(this.data)
                  .attr('class', 'line')
                  .transition()
                  .on('start', () => this.tick(pathElement as SVGPathElement));
              })}>
            ></path>
          </g>
        </g>
      </svg>
    `;
  }
}

if (!customElements.get('frc-line-chart2')) {
  customElements.define('frc-line-chart2', LineChart);
}
