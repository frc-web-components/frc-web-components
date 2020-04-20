import './3-axis-accelerometer.tag';
import './3-axis-accelerometer-props.tag';
import image from './3-axis-accelerometer.png';

dashboard.registerWidget('three-axis-accelerometer', {
  label: '3-Axis Accelerometer',
  category: 'Sensors',
  acceptedTypes: ['3AxisAccelerometer'],
  image,
  minX: 4,
  minY: 4,
  properties: {
    tag: 'three-axis-accelerometer-props',
    defaults: {
      range: 2,
      showText: true,
      numDecimals: 2,
      showTickMarks: true,
    }
  }
});