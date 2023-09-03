import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export interface ILineChartAxis {
  min: number;
  max: number;
  lockMin: boolean;
  lockMax: boolean;
  autoFit: boolean;
  invert: boolean;
  side: 'left' | 'right';
  hideGridLines: boolean;
}

export default class LineChartAxis
  extends LitElement
  implements ILineChartAxis
{
  @property({ type: Number }) min = -1;
  @property({ type: Number }) max = 1;
  @property({ type: Boolean, attribute: 'lock-min' }) lockMin = false;
  @property({ type: Boolean, attribute: 'lock-max' }) lockMax = false;
  @property({ type: Boolean, attribute: 'auto-fit' }) autoFit = false;
  @property({ type: Boolean }) invert = false;
  @property({ type: String }) side: 'left' | 'right' = 'left';
  @property({ type: Boolean, attribute: 'hide-grid-lines' }) hideGridLines =
    false;
}

if (!customElements.get('frc-line-chart-axis')) {
  customElements.define('frc-line-chart-axis', LineChartAxis);
}
