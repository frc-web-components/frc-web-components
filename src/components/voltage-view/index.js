import { css } from '@webbitjs/webbit';
import NumberBar from '../number-bar';

class VoltageView extends NumberBar {

  static get metadata() {
    return {
      displayName: 'Voltage View',
      category: 'Robot & Field Info',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/voltage-view/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 }
    };
  }

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