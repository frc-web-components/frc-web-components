import { css } from 'lit';
import { property } from 'lit/decorators.js';
import NumberBar from '../number-bar';

export default class VoltageView extends NumberBar {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 5;
  @property({ type: Number }) center = 0;
  @property({ type: Number }) precision = 2;
  @property({ type: Boolean, attribute: 'hide-text' }) hideText = false;
  @property({ type: Number, attribute: 'num-tick-marks' }) numTickMarks = 3;
  @property({ type: String }) unit = 'V';

  static styles = [
    ...super.styles,
    css`
      [part='bar']::part(foreground) {
        background: var(--frc-voltage-view-foreground-color, #ffbd2f);
      }
    `,
  ];
}

if (!customElements.get('frc-voltage-view')) {
  customElements.define('frc-voltage-view', VoltageView);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-voltage-view': VoltageView;
  }
}
