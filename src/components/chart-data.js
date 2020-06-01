
import { Webbit, html, css } from '@webbitjs/webbit';

class ChartData extends Webbit {

  static get metadata() {
    return {
      displayName: 'Chart Data',
      category: 'Charts & Graphs',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/line-chart/'
    };
  }

  static get styles() {
    return css`
      :host { 
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Number, primary: true },
      label: { type: String },
      color: { type: String }
    };
  }

  constructor() {
    super();
    this.value = 0;
    this.label = '';
    this.color = '';
  }
}

webbitRegistry.define('frc-chart-data', ChartData);