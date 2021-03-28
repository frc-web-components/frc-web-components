
import { css } from 'lit-element';
import { Webbit, define } from '../webbit';

class ChartData extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Chart Data',
      category: 'Charts & Graphs',
      description: 'Used to show a single data point on a line chart.',
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
      axisId: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          const chart = this.parentElement;
          return chart.axisElements.map(axis => axis.axisId);
        }
      },
      value: { type: Number, primary: true },
      label: { type: String },
      color: { type: String, inputType: 'ColorPicker' }
    };
  }

}

define('frc-chart-data', ChartData);