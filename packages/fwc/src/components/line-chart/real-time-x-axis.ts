import { TemplateResult, svg } from 'lit';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';

export function getXScale(
  width: number,
  totalTimeMs: number,
  elapsedTime: number,
): d3.ScaleTime<number, number, never> {
  const xScale = d3
    .scaleTime()
    .domain([elapsedTime - totalTimeMs, elapsedTime])
    .range([0, width]);
  return xScale;
}

export default function getRealTimeXAxis(
  xScale: d3.ScaleTime<number, number, never>,
): TemplateResult {
  const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
    const date = d as Date;
    const diff = date.getTime() / 1000;
    return `${diff}`;
  });

  return svg`
    <g 
      class="axis axis--x" 
      ${ref((xAxisEl) => {
        xAxis(d3.select(xAxisEl as SVGGElement));
      })}>
    </g> 
  `;
}

export function getRealTimeXGrid(
  xScale: d3.ScaleTime<number, number, never>,
  height: number,
): TemplateResult {
  const xAxisGrid = d3
    .axisBottom(xScale)
    .tickSize(-height)
    .tickFormat('' as any);

  return svg`
    <g 
      class="axis-x-grid" 
      ${ref((xAxisEl) => {
        xAxisGrid(d3.select(xAxisEl as SVGGElement));
      })}>
    </g> 
  `;
}
