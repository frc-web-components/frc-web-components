import NumberBar from '../number-bar';

/**
 * Component for displaying data from a single axis accelerometer.
 *
 * @attr {Number} value - The acceleration
 * @attr {Number} min - The minimum displayed acceleration
 * @attr {Number} max - The maximum displayed acceleration
 * @attr {Number} center - The point at which the number bar starts. If the x, y and z values are less than the center, the bar be to the left of the center, and to the right otherwise.
 * @attr {Number} precision - The number of decimal places shown in the x, y and z values.
 * @attr {Boolean} hide-text - If true then the x, y and z values displayed in the bars are hidden.
 * @attr {Number} num-tick-marks - Controls the number of tick marks shown in the axis at the bottom of the component. If 0 the axis is hidden.
 * @attr {String} unit - Displays a unit for the values shown in the axes.
 * @csspart bar - The number bar
 * @csspart axis - The axis below the number bar
 */
class Accelerometer extends NumberBar {

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.center = 0;
    this.precision = 2;
    /**
     * @attr hide-text
     */
    this.hideText = false;
    /**
     * @attr num-tick-marks
     */
    this.numTickMarks = 3;
    this.unit = 'g';
  }
}

customElements.define('frc-accelerometer', Accelerometer);

webbitRegistry.addExisting('frc-accelerometer', {
  displayName: 'Accelerometer',
  category: 'Robot & Field Info',
  description: 'Component for displaying data from a single axis accelerometer.',
  documentationLink: 'https://frc-web-components.github.io/components/accelerometer/',
  slots: [],
  editorTabs: ['properties', 'sources'],
  resizable: { left: true, right: true },
  minSize: { width: 80, height: 10 },
  properties: {
    value: { type: Number, primary: true },
    min: { type: Number },
    max: { type: Number },
    center: { type: Number },
    precision: { type: Number },
    hideText: { type: Boolean },
    numTickMarks: { type: Number },
    unit: { type: String }
  }
});