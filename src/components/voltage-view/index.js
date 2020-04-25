import { css } from '@webbitjs/webbit';
import NumberBar from '../number-bar';

class VoltageView extends NumberBar {

  static get styles() {
    return [
      super.styles,
      css`
        [part=bar]::part(foreground) {
          background: #ffbd2f;
        }
      `
    ];
  }
 
  constructor() {
    super();
    this.min = 0;
    this.max = 5;
    this.numTickMarks = 6;
    this.unit = 'V';
  }
}

webbitRegistry.define('frc-voltage-view', VoltageView);