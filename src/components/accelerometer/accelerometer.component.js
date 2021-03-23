import NumberBar from '../number-bar/number-bar.component';
import { define } from '../../webbit';
/**
 * Component for displaying data from a single axis accelerometer.
 *
 * @attr {Number} value - The acceleration
 * @attr {Number} min - The minimum displayed acceleration
 * @attr {Number} max - The maximum displayed acceleration
 * @attr {Number} center - The point at which the number bar starts. If the value is less than the center, the bar be to the left of the center, and to the right otherwise.
 * @attr {Number} precision - The number of decimal places shown in value.
 * @attr {Boolean} hide-text - If true then the value displayed in the bar is hidden.
 * @attr {Number} num-tick-marks - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
 * @attr {String} unit - Displays a unit for the values shown in the axes.
 * @csspart bar - The number bar
 * @csspart axis - The axis below the number bar
 */
class Accelerometer extends NumberBar {

  static get dashboardConfig() {
    return {
      displayName: 'Accelerometer',
      category: 'Robot & Field Info',
      description: 'Component for displaying data from a single axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/accelerometer/',
      slots: [],
      editorTabs: ['properties', 'sources'],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 },
    };
  }

  static get properties() {
    return {
      ...super.properties,
      unit: { type: String, defaultValue: 'g' },
    }
  }
}

define('frc-accelerometer', Accelerometer);
