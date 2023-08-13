import { css, LitElement, svg } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';
import getRealTimeXAxis, { getXScale } from './real-time-x-axis';
import './line-chart-data';
import './line-chart-axis';

function bound(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

interface ChartDatum {
  timeMs: number;
  value: number;
}

interface ChartData {
  data: ChartDatum[];
  color: string;
  isHidden: boolean;
  yAxis: number;
}

interface YScale {
  scale: d3.ScaleLinear<number, number, never>;
  autoFit: boolean;
  invert: boolean;
  side: 'left' | 'right';
}

export default class LineChart extends LitElement {
  @property({ type: Boolean }) value = false;
  @property({ type: Number, attribute: 'view-time' }) viewTime = 10;

  @state() data: ChartData[] = [];

  @query('.data-path') path!: SVGPathElement;
  @query('svg') svg!: SVGSVGElement;
  @query('.axis--x') xAxis!: SVGSVGElement;

  startTime = 0;
  elapsedTimeMs = 0;

  static styles = css`
    .line {
      fill: none;
      stroke-width: 1.5px;
    }
  `;

  firstUpdated(): void {
    this.startTime = Date.now();

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  getFilteredData(data: ChartDatum[]): ChartDatum[] {
    const removalCutoffIndex =
      data.findIndex(
        ({ timeMs }) =>
          this.elapsedTimeMs - timeMs < Math.round(this.viewTime * 1000)
      ) - 1;

    if (removalCutoffIndex < 0) {
      return data;
    }

    return data.slice(removalCutoffIndex);
  }

  updateChart() {
    this.elapsedTimeMs = Date.now() - this.startTime;

    const dataElements = [...this.children].filter(
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-data2'
    );

    const rand = (prevValue: number) => d3.randomNormal(prevValue, 0.01)();

    this.data = dataElements.map((child, index) => {
      const data = this.data[index]?.data ?? [];
      const mostRecentValue = data[data.length - 1]?.value ?? 0.5;
      data.push({
        value: bound(rand(mostRecentValue), 0, 1),
        timeMs: this.elapsedTimeMs,
      });
      return {
        data: this.getFilteredData(data),
        color: (child as any).color ?? 'black',
        isHidden: (child as any).isHidden ?? false,
        yAxis: (child as any).yAxis ?? 0,
      };
    });

    this.requestUpdate();

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  static getYScale(height: number, min = -1, max = 1, invert = false) {
    const range = invert ? [0, height] : [height, 0];
    return d3.scaleLinear().domain([min, max]).range(range);
  }

  static getDimensions() {
    const margin = { top: 20, right: 40, bottom: 20, left: 40 };
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

  getYScales(): YScale[] {
    const { height } = LineChart.getDimensions();
    const axisElements = [...this.children].filter(
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-axis2'
    );

    if (axisElements.length === 0) {
      return [
        {
          autoFit: false,
          invert: false,
          side: 'left',
          scale: LineChart.getYScale(height, -1, 1),
        },
      ];
    }

    return axisElements.map((element) => {
      const min = (element as any).min ?? -1;
      const max = (element as any).max ?? 1;
      const autoFit = (element as any).autoFit ?? false;
      const invert = (element as any).invert ?? false;
      const side = (element as any).side ?? 'left';

      return {
        autoFit,
        invert,
        side,
        scale: LineChart.getYScale(height, min, max, invert),
      };
    });
  }

  render() {
    const { margin, svgWidth, svgHeight, width, height } =
      LineChart.getDimensions();

    const xScale = getXScale(
      width,
      Math.round(this.viewTime * 1000),
      this.elapsedTimeMs
    );
    const yScales = this.getYScales();

    const lines = yScales.map((yScale) => {
      const line = d3
        .line<ChartDatum>()
        .x((d) => xScale(new Date(d.timeMs)))
        .y((d) => yScale.scale(d.value))
        .curve(d3.curveMonotoneX);
      return line;
    });

    return svg`
      <svg width=${svgWidth} height=${svgHeight}>
        <g transform="translate(${margin.left},${margin.top})">
          <defs>
            <clipPath id="clip">
              <rect width=${width} height=${height}></rect>
            </clipPath>
          </defs>
          <g transform="translate(0,${height})">
            ${getRealTimeXAxis(xScale)}
          </g>
          ${yScales.map(
            (scale) => svg`
              <g 
                class="axis axis--y" 
                transform="translate(${scale.side === 'left' ? 0 : width}, 0)"
                ${ref((yAxis) => {
                  const axis =
                    scale.side === 'left' ? d3.axisLeft : d3.axisRight;
                  axis(scale.scale)(d3.select(yAxis as SVGGElement));
                })}>
              </g>
            `
          )}
          ${this.data
            .filter(
              ({ isHidden, yAxis }) =>
                !isHidden && yAxis < yScales.length && yAxis >= 0
            )
            .map(
              (data) => svg`
            <g clip-path="url(#clip)">
              <path 
                class="data-path"
                ${ref((pathElement) => {
                  const path = d3.select(pathElement as SVGPathElement);
                  path
                    .attr('class', 'line')
                    .attr('stroke', data.color)
                    .attr('d', lines[data.yAxis](data.data));
                })}>
              ></path>
            </g>
          `
            )}
        </g>
      </svg>
    `;
  }
}

if (!customElements.get('frc-line-chart2')) {
  customElements.define('frc-line-chart2', LineChart);
}
