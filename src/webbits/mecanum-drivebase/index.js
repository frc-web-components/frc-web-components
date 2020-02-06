import './mecanum-drivebase.tag';
import image from './mecanum-drivebase.png';

dashboard.registerWidget('mecanum-drivebase', {
  label: 'Mecanum Drivebase',
  category: 'Basic',
  acceptedTypes: ['MecanumDrive'],
  image,
  minX: 7,
  minY: 5
});