import './gyro.tag';
import image from './gyro.png';

dashboard.registerWidget('gyro', {
  label: 'Gyro',
  category: 'Sensors',
  acceptedTypes: ['Gyro'],
  image,
  minX: 6,
  minY: 6
});