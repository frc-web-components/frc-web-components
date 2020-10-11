
import { Webbit, html, css } from '@webbitjs/webbit';

class ChartData extends Webbit {

  static get metadata() {
    return {
      displayName: 'Chart Data',
      category: 'Charts & Graphs',
      description: 'Used to show a single data point on a line chart.',
      documentationLink: 'https://frc-web-components.github.io/components/line-chart/',
      slots: [],
      allowedParents: ['frc-line-chart'],
      movable: false,
      resizable: { left: false, right: false, top: false, bottom: false }
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