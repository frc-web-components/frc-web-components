import { css, LitElement, svg } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';
import getRealTimeXAxis, {
  getRealTimeXGrid,
  getXScale,
} from './real-time-x-axis';
import './line-chart-data';
import { ILineChartAxis } from './line-chart-axis';

function bound(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function setPrecision(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
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
  chartAxis: ILineChartAxis;
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

    .chart-border {
      fill: none;
      stroke-width: 1;
      stroke: black;
    }

    .axis-x-grid line {
      stroke: #eee;
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
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-data'
    );

    this.data = dataElements.map((child, index) => {
      const data = this.data[index]?.data ?? [];
      data.push({
        value: (child as any).value ?? 0,
        timeMs: this.elapsedTimeMs,
      });
      return {
        data: this.getFilteredData(data),
        color: (child as any).color ?? 'black',
        isHidden: (child as any).isHidden ?? false,
        yAxis: (child as any).yAxis ?? 0,
      };
    });

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  static getYScale(
    height: number,
    chartData: ChartData[],
    chartAxis: ILineChartAxis
  ) {
    const { invert, lockMin, lockMax } = chartAxis;
    let { min, max } = chartAxis;

    if (!lockMin || !lockMax) {
      chartData.forEach((data) => {
        data.data.forEach(({ value }) => {
          if (!lockMin) {
            min = Math.min(min, value);
          }
          if (!lockMax) {
            max = Math.max(max, value);
          }
        });
      });
    }

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
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-axis'
    );

    if (axisElements.length === 0) {
      const chartAxis: ILineChartAxis = {
        min: -1,
        max: 1,
        lockMin: false,
        lockMax: false,
        autoFit: false,
        invert: false,
        side: 'left',
      };
      return [
        {
          chartAxis,
          scale: LineChart.getYScale(
            height,
            this.data.filter(({ yAxis }) => yAxis === 0),
            chartAxis
          ),
        },
      ];
    }

    return axisElements.map((element, index) => {
      const axisElement = element as any as Partial<ILineChartAxis>;
      const chartAxis: ILineChartAxis = {
        min: axisElement.min ?? -1,
        max: axisElement.max ?? 1,
        lockMin: axisElement.lockMin ?? false,
        lockMax: axisElement.lockMax ?? false,
        autoFit: axisElement.autoFit ?? false,
        invert: axisElement.invert ?? false,
        side: axisElement.side ?? 'left',
      };
      return {
        chartAxis,
        scale: LineChart.getYScale(
          height,
          this.data.filter(({ yAxis }) => yAxis === index),
          chartAxis
        ),
      };
    });
  }

  static getPath(
    data: ChartDatum[],
    getX: (datum: ChartDatum) => number,
    getY: (datum: ChartDatum) => number
  ): string {
    const points = data.map((datum) =>
      [getX(datum).toFixed(3), getY(datum).toFixed(3)].join(',')
    );
    return `M${points.join('L')}`;
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
      // const line = d3
      //   .line<ChartDatum>()
      //   .x((d) => xScale(new Date(d.timeMs)))
      //   .y((d) => yScale.scale(d.value));
      const line = (data: ChartDatum[]) =>
        LineChart.getPath(
          data,
          (d) => xScale(new Date(d.timeMs)),
          (d) => yScale.scale(d.value)
        );
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
          <rect class="chart-border" width=${width} height=${height}></rect>
          <g transform="translate(0,${height})">
            ${getRealTimeXAxis(xScale)}
            ${getRealTimeXGrid(xScale, height)}
          </g>
          ${yScales.map(
            (scale) => svg`
              <g 
                class="axis axis--y" 
                transform="translate(${
                  scale.chartAxis.side === 'left' ? 0 : width
                }, 0)"
                ${ref((yAxis) => {
                  const axis =
                    scale.chartAxis.side === 'left'
                      ? d3.axisLeft
                      : d3.axisRight;
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
                  const pathD = lines[data.yAxis](data.data);
                  path
                    .attr('class', 'line')
                    .attr('stroke', data.color)
                    .attr('d', pathD);
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

if (!customElements.get('frc-line-chart')) {
  customElements.define('frc-line-chart', LineChart);
}
