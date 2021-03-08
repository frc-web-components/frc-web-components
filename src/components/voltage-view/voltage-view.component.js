import { css } from 'lit-element';
import NumberBar from '../number-bar/number-bar.component';

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
    this.value = 0;
    this.min = 0;
    this.max = 5;
    this.center = 0;
    this.precision = 2;
    /**
     * @attr hide-text
     */
    this.hideText = false;
    /**
     * @attr num-tick-marks
     */
    this.numTickMarks = 6;
    this.unit = 'V';
  }
}

customElements.define('frc-voltage-view', VoltageView);

webbitRegistry.addExisting('frc-voltage-view', {
  displayName: 'Voltage View',
  category: 'Robot & Field Info',
  description: 'Component for displaying the voltage of a device.',
  documentationLink: 'https://frc-web-components.github.io/components/voltage-view/',
  slots: [],
  resizable: { left: true, right: true },
  minSize: { width: 80, height: 10 },
  properties: {
    value: { type: Number, primary: true, defaultValue: 0 },
    min: { type: Number, defaultValue: -1 },
    max: { type: Number, defaultValue: 1 },
    center: { type: Number, defaultValue: 0 },
    precision: { type: Number, defaultValue: 2 },
    hideText: { type: Boolean, defaultValue: false },
    numTickMarks: { type: Number, defaultValue: 3 },
    unit: { type: String, defaultValue: 'V' }
  }
});