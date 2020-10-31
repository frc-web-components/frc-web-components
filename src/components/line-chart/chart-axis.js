
import { Webbit, html, css } from '@webbitjs/webbit';

class ChartAxis extends Webbit {

  static get metadata() {
    return {
      displayName: 'Chart Axis',
      category: 'Charts & Graphs',
      description: '.',
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
      axisId: { type: String },
      scaleType: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return ['linear', 'logarithmic'];
        }
      },
      min: { type: Number },
      max: { type: Number },
      label: { type: String },
      tickValues: { type: Array, inputType: 'NumberArray' },
      position: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return ['left', 'right'];
        }
      },
      hideGridLines: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.axisId = '';
    this.scaleType = 'linear';
    this.min = -1;
    this.max = 1;
    this.label = 'Value';
    this.tickValues = [];
    this.position = 'left';
    this.hideGridLines = false;
  }
}

webbitRegistry.define('frc-chart-axis', ChartAxis);