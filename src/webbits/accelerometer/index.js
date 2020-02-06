import './accelerometer.tag';
import './accelerometer-props.tag';
import image from './accelerometer.png';

dashboard.registerWidget('accelerometer', {
  label: 'Accelerometer',
  category: 'Sensors',
  acceptedTypes: ['Accelerometer'],
  image,
  minX: 3,
  minY: 2,
  properties: {
    tag: 'accelerometer-props',
    defaults: {
      showText: true,
      numDecimals: 2,
      showTickMarks: true,
      min: -1,
      max: 1
    }
  }
});