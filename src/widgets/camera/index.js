import './camera.tag';
import image from './camera.png';

dashboard.registerWidget('camera', {
  label: 'Camera',
  category: 'Sensors',
  acceptedTypes: ['Camera'],
  image,
  minX: 3,
  minY: 3
});