import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const ChartLegendPositions = [
  'nw',
  'n',
  'ne',
  'w',
  'e',
  'sw',
  's',
  'se',
] as const;
export type ChartLegendPosition = (typeof ChartLegendPositions)[number];
export type ChartLegendDirection = 'horizontal' | 'vertical';

export interface IChartLegend {
  position: ChartLegendPosition;
  direction: ChartLegendDirection;
  hide: boolean;
  inside: boolean;
}

export default class LineChartLegend
  extends LitElement
  implements IChartLegend
{
  @property({ type: String }) position: ChartLegendPosition = 'n';
  @property({ type: String }) direction: ChartLegendDirection = 'horizontal';
  @property({ type: Boolean }) hide = false;
  @property({ type: Boolean }) inside = false;
}

if (!customElements.get('frc-line-chart-legend')) {
  customElements.define('frc-line-chart-legend', LineChartLegend);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-line-chart-legend': LineChartLegend;
  }
}
