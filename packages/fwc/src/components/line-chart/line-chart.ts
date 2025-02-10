import { css, html, LitElement, svg } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import getRealTimeXAxis, {
  getRealTimeXGrid,
  getXScale,
} from './real-time-x-axis';
import './line-chart-data';
import { ILineChartAxis } from './line-chart-axis';
import { IChartLegend } from './line-chart-legend';

interface ChartDatum {
  timeMs: number;
  value: number;
}

interface ChartData {
  data: ChartDatum[];
  color: string;
  hide: boolean;
  yAxis: number;
  displayName: string;
}

interface YScale {
  scale: d3.ScaleLinear<number, number, never>;
  chartAxis: ILineChartAxis;
}

const colorScale = d3
  .scaleOrdinal<number, string>()
  .domain(
    Array(8)
      .fill(0)
      .map((_, index) => index),
  )
  .range(d3.schemeSet2);

export function getYScaleWidth(text: string /* , fontSize: number */): number {
  return text.length * 5.5 + 9;
}

export class LineChart extends LitElement {
  @property({ type: Number, attribute: 'view-time' }) viewTime = 10;
  @property({ type: String, attribute: 'chart-title', reflect: true })
  chartTitle = '';

  @state() data: ChartData[] = [];

  @query('.data-path') path!: SVGPathElement;
  @query('svg') svg!: SVGSVGElement;
  @query('.axis--x') xAxis!: SVGSVGElement;
  @query('.chart-container') chartContainer!: HTMLDivElement;

  startTime = 0;
  elapsedTimeMs = 0;

  static styles = css`
    :host {
      display: inline-block;
      width: 700px;
      height: 400px;
      color: var(--frc-line-chart-text-color, black);
    }

    .chart-and-header {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .chart-and-header header {
      font-size: 18px;
      font-family: sans-serif;
      margin: 3px 0;
    }

    .chart-and-legend {
      flex: 1;
      width: 100%;
      position: relative;
    }

    .legend-container {
      position: relative;
    }

    .legend {
      display: flex;
      z-index: 100;
    }

    .legend.outside {
      position: relative;
    }

    .legend.inside {
      position: absolute;
    }

    .legend-item {
      display: flex;
      flex-wrap: no-wrap;
      gap: 5px;
      align-items: center;
      padding: 5px;
    }

    .legend.horizontal {
      flex-direction: row;
    }

    .legend.vertical {
      flex-direction: column;
    }

    .legend-item-box {
      width: 15px;
      height: 15px;
    }

    .legend-item-label {
      font-family: sans-serif;
      font-size: 15px;
    }

    .line {
      fill: none;
      stroke-width: 1.5px;
    }

    .chart-border {
      fill: none;
      stroke-width: 1;
      stroke: var(--frc-line-chart-border-color, black);
    }

    .axis-x-grid line,
    .axis-y-grid line {
      stroke: var(--frc-line-chart-grid-color, #eee);
    }

    .axis--y {
      font-family: monospace;
    }

    svg {
      overflow: visible;
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
          this.elapsedTimeMs - timeMs < Math.round(this.viewTime * 1000),
      ) - 1;

    if (removalCutoffIndex < 0) {
      return data;
    }

    return data.slice(removalCutoffIndex);
  }

  updateChart() {
    this.elapsedTimeMs = Date.now() - this.startTime;

    const dataElements = [...this.children].filter(
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-data',
    );

    this.data = dataElements.map((child, index) => {
      const data = this.data[index]?.data ?? [];
      data.push({
        value: (child as any).value ?? 0,
        timeMs: this.elapsedTimeMs,
      });
      return {
        data: this.getFilteredData(data),
        color: (child as any).color || colorScale(index % 8),
        hide: (child as any).hide ?? false,
        yAxis: (child as any).yAxis ?? 0,
        displayName: (child as any).displayName || `Data ${index}`,
      };
    });

    requestAnimationFrame(() => {
      this.updateChart();
    });
  }

  static getYScale(
    height: number,
    chartData: ChartData[],
    chartAxis: ILineChartAxis,
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

  getDimensions() {
    const margin = { top: 0, right: 40, bottom: 20, left: 40 };
    const box = this.chartContainer?.getBoundingClientRect() ?? {
      width: 960,
      height: 500,
    };
    const svgWidth = box.width;
    const svgHeight = box.height;

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
    const { height } = this.getDimensions();
    const axisElements = [...this.children].filter(
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-axis',
    );

    if (axisElements.length === 0) {
      const chartAxis: ILineChartAxis = {
        min: -1,
        max: 1,
        lockMin: false,
        lockMax: false,
        invert: false,
        side: 'left',
        hideGridLines: false,
        hide: false,
      };
      return [
        {
          chartAxis,
          scale: LineChart.getYScale(
            height,
            this.data.filter(({ yAxis }) => yAxis === 0),
            chartAxis,
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
        invert: axisElement.invert ?? false,
        side: axisElement.side ?? 'left',
        hideGridLines: axisElement.hideGridLines ?? false,
        hide: axisElement.hide ?? false,
      };
      return {
        chartAxis,
        scale: LineChart.getYScale(
          height,
          this.data.filter(({ yAxis }) => yAxis === index),
          chartAxis,
        ),
      };
    });
  }

  static getPath(
    data: ChartDatum[],
    getX: (datum: ChartDatum) => number,
    getY: (datum: ChartDatum) => number,
  ): string {
    const points = data.map((datum) =>
      [getX(datum).toFixed(3), getY(datum).toFixed(3)].join(','),
    );
    return `M${points.join('L')}`;
  }

  getLegend(): IChartLegend {
    const legendElement = [...this.children].find(
      (child) => child.tagName.toLowerCase() === 'frc-line-chart-legend',
    );

    if (!legendElement) {
      return {
        direction: 'horizontal',
        position: 'n',
        inside: false,
        hide: false,
      };
    }

    const legend = legendElement as any as Partial<IChartLegend>;
    const legendWithDefaults: IChartLegend = {
      direction: legend.direction ?? 'horizontal',
      position: legend.position ?? 'n',
      inside: legend.inside ?? false,
      hide: legend.hide ?? false,
    };
    return legendWithDefaults;
  }

  render() {
    const { inside, position, direction, hide } = this.getLegend();
    const isRowLayout =
      position === 'w' ||
      position === 'e' ||
      (['ne', 'nw', 'se', 'sw'].includes(position) && direction === 'vertical');
    const isReverse =
      (isRowLayout && ['ne', 'e', 'se'].includes(position)) ||
      (!isRowLayout && ['sw', 's', 'se'].includes(position));

    const styles = styleMap({
      display: inside ? 'block' : 'flex',
      flexDirection: `${isRowLayout ? 'row' : 'column'}${
        isReverse ? '-reverse' : ''
      }`,
    });

    const chartContainerStyles = inside
      ? {
          width: '100%',
          height: '100%',
        }
      : { flex: '1' };

    return html`
      <div class="chart-and-header">
        ${this.chartTitle ? html`<header>${this.chartTitle}</header>` : ''}
        <div class="chart-and-legend" style=${styles}>
          ${!hide ? this.renderLegend() : ''}
          <div class="chart-container" style=${styleMap(chartContainerStyles)}>
            ${this.renderChart()}
          </div>
        </div>
      </div>
    `;
  }

  renderLegend() {
    const { margin } = this.getDimensions();
    const { inside, direction, position } = this.getLegend();

    const alignSelf = (() => {
      if (['n', 's', 'e', 'w'].includes(position)) {
        return 'center';
      }
      if (position === 'nw') {
        return 'flex-start';
      }
      if (position === 'se') {
        return 'flex-end';
      }
      if (position === 'ne') {
        return direction === 'horizontal' ? 'flex-end' : 'flex-start';
      }
      // otherwise position sw
      return direction === 'vertical' ? 'flex-end' : 'flex-start';
    })();

    const marginStyles = (() => {
      if (!inside) {
        return {};
      }
      const styles: Record<string, string> = {
        alignItems: 'center',
      };
      if (position.includes('n')) {
        styles.top = `${margin.top}px`;
      } else if (position.includes('s')) {
        styles.bottom = `${margin.bottom}px`;
      }
      if (position.includes('w')) {
        styles.left = `${margin.left}px`;
      } else if (position.includes('e')) {
        styles.right = `${margin.right}px`;
      }

      if (['n', 's', 'e', 'w'].includes(position)) {
        styles.justifyContent = 'center';
      }

      if (['n', 's'].includes(position)) {
        styles.left = '0';
        styles.right = '0';
      }

      if (['e', 'w'].includes(position)) {
        styles.top = '0';
        styles.bottom = '0';
      }

      return styles;
    })();

    const styles = styleMap({
      alignSelf,
      ...marginStyles,
    });

    const directionClass =
      direction === 'horizontal' ? 'horizontal' : 'vertical';

    return html`
      <div
        class="legend ${inside ? 'inside' : 'outside'} ${directionClass}"
        style=${styles}
      >
        ${this.data.map(
          ({ color, displayName }) => html`
            <div class="legend-item">
              <div
                class="legend-item-box"
                style=${styleMap({
                  background: color,
                })}
              ></div>
              <span class="legend-item-label">${displayName}</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  renderChart() {
    const { margin, svgWidth, svgHeight, width, height } = this.getDimensions();

    const xScale = getXScale(
      width,
      Math.round(this.viewTime * 1000),
      this.elapsedTimeMs,
    );
    const yScales = this.getYScales().filter(
      ({ chartAxis }) => !chartAxis.hide,
    );

    const lines = yScales.map((yScale) => {
      const line = (data: ChartDatum[]) =>
        LineChart.getPath(
          data,
          (d) => xScale(new Date(d.timeMs)),
          (d) => yScale.scale(d.value),
        );
      return line;
    });

    return svg`
      <svg width=${svgWidth} height=${svgHeight} style="position: absolute">
        <g transform="translate(${margin.left},${margin.top})">
          <defs>
            <clipPath id="clip">
              <rect width=${width} height=${height}></rect>
            </clipPath>
          </defs>
          <g transform="translate(0,${height})">
            ${getRealTimeXAxis(xScale)}
            ${getRealTimeXGrid(xScale, height)}
          </g>
          ${this.renderScales(yScales, 'left')}
          ${this.renderScales(yScales, 'right')}
          <rect class="chart-border" width=${width} height=${height}></rect>
          ${this.data
            .filter(
              ({ hide, yAxis }) =>
                !hide && yAxis < yScales.length && yAxis >= 0,
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
          `,
            )}
        </g>
      </svg>
    `;
  }

  renderScales(yScales: YScale[], side: 'left' | 'right') {
    const { width } = this.getDimensions();

    return svg`
     ${yScales
       .filter((scale) => scale.chartAxis.side === side)
       .map((scale, index) => {
         const xTransform =
           scale.chartAxis.side === 'left' ? -index * 25 : width;

         return svg`
              <g 
                class="axis axis--y" 
                transform="translate(${xTransform}, 0)"
                ${ref((yAxis) => {
                  const axis =
                    scale.chartAxis.side === 'left'
                      ? d3.axisLeft
                      : d3.axisRight;
                  axis(scale.scale)(d3.select(yAxis as SVGGElement));
                })}>
              </g>
              ${
                !scale.chartAxis.hideGridLines
                  ? svg`
                    <g 
                      class="axis-y-grid" 
                      ${ref((yAxisEl) => {
                        const yAxisGrid = d3
                          .axisLeft(scale.scale)
                          .tickSize(-width)
                          .tickFormat('' as any);

                        yAxisGrid(d3.select(yAxisEl as SVGGElement));
                      })}>
                    </g> 
                  `
                  : ''
              }
            `;
       })}
    `;
  }
}

export default LineChart;

if (!customElements.get('frc-line-chart')) {
  customElements.define('frc-line-chart', LineChart);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-line-chart': LineChart;
  }
}
