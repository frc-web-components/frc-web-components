import './encoder.tag';
import image from './encoder.png';

dashboard.registerWidget('encoder', {
  label: 'Encoder',
  category: 'Sensors',
  acceptedTypes: ['Encoder', 'Quadrature Encoder'],
  image,
  minX: 6,
  minY: 3
});