import { customElement, property, query } from 'lit/decorators.js';
import { html, LitElement, TemplateResult } from 'lit';
import fieldConfigs, { FieldConfig } from './field-configs';
import { baseUnit, toBaseConversions, convert, unitAliases } from './units';

@customElement('frc-field')
export class Field extends LitElement {
  @property({ type: String }) game = fieldConfigs[0].game;
  @property({ type: Array, attribute: 'top-left-clip' }) topLeftClip: [
    number,
    number
  ] = [0, 0];
  @property({ type: Array, attribute: 'bottom-right-clip' }) bottomRightClip: [
    number,
    number
  ] = [100, 100];
  @property({ type: String }) unit = baseUnit;
  @property({ type: Number }) rotation = 0;
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = false;
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 1;

  @query('canvas') canvas: HTMLCanvasElement;

  getConfig(): FieldConfig {
    const config = fieldConfigs.find(({ game }) => game === this.game);
    return config ?? fieldConfigs[0];
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <canvas></canvas> `;
  }
}
