import { css } from 'lit-element';
import NumberBar from '../number-bar/number-bar.component';
import { define } from '../../webbit';


 /**
 * Component for displaying the voltage of a device.
 *
 * @attr {Number} value - The voltage
 * @attr {Number} min - The minimum displayed voltage 
 * @attr {Number} max - The maximum displayed voltage
 * @attr {Number} center - The point at which the number bar starts. If the value is less than the center, the bar be to the left of the center, and to the right otherwise.
 * @attr {Number} precision - The number of decimal places shown in value.
 * @attr {Boolean} hide-text - If true then the value displayed in the bar is hidden.
 * @attr {Number} num-tick-marks - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
 * @attr {String} unit - Displays a unit for the values shown in the axes.
 * @csspart bar - The number bar
 * @csspart axis - The axis below the number bar
 */
class VoltageView extends NumberBar {

  static get dashboardConfig() {
    return {
      displayName: 'Voltage View',
      category: 'Robot & Field Info',
      description: 'Component for displaying the voltage of a device.',
      documentationLink: 'https://frc-web-components.github.io/components/voltage-view/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 },
    };
  }

  static get properties() {
    return {
      ...super.properties,
      min: { 
        type: Number,
        defaultValue: 0, 
        get() {
          return Math.min(this._min, this._max);
        }
      },
      max: { 
        type: Number, 
        defaultValue: 5,
        get() {
          return Math.max(this._min, this._max);
        }
      },
      numTickMarks: { 
        type: Number,
        defaultValue: 6,
        get() {
          return Math.max(0, this._numTickMarks);
        }
      },
      unit: { type: String, defaultValue: 'V' },
    }
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
}

define('frc-voltage-view', VoltageView);
