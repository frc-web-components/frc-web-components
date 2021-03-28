import { css } from 'lit-element';
import { Webbit, define } from '../../webbit';

class ChartAxis extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Chart Axis',
      category: 'Charts & Graphs',
      description: '.',
      documentationLink: 'https://frc-web-components.github.io/components/line-chart/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      allowedParents: ['frc-line-chart'],
      movable: false,
      resizable: { left: false, right: false, top: false, bottom: false },
      previewable: false,
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
        defaultValue: 'linear',
        inputType: 'StringDropdown',
        getOptions() {
          return ['linear', 'logarithmic'];
        }
      },
      min: { type: Number, defaultValue: -1 },
      max: { type: Number, defaultValue: 1 },
      label: { type: String, defaultValue: 'Value' },
      tickValues: { type: Array, inputType: 'NumberArray' },
      position: { 
        type: String,
        defaultValue: 'left',
        inputType: 'StringDropdown',
        getOptions() {
          return ['left', 'right'];
        }
      },
      hideGridLines: { type: Boolean }
    };
  }
}

define('frc-chart-axis', ChartAxis);