import { TemplateResult, svg } from 'lit';
import * as d3 from 'd3';
import { ref } from 'lit/directives/ref.js';

export function getXAxis(
  width: number,
  totalTimeMs: number,
  elapsedTime: number
) {
  const xScale = d3
    .scaleTime()
    .domain([elapsedTime - totalTimeMs, elapsedTime])
    .range([0, width]);
  return xScale;
}

export default function getRealTimeXAxis(
  width: number,
  totalTimeMs: number,
  elapsedTime: number
): TemplateResult {
  const x = getXAxis(width, totalTimeMs, elapsedTime);

  const xAxis = d3.axisBottom(x).tickFormat((d) => {
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
