import { Rotation } from './field-interfaces';

export interface RobotConfig {
  name: string;
  src: string;
  rotations: Rotation[];
  position: [number, number, number];
}

const configs: RobotConfig[] = [
  {
    name: 'KitBot',
    src: '/3d-models/Robot_KitBot.glb',
    rotations: [{ axis: 'z', degrees: 90 }],
    position: [0.12, 3.15, 0],
  },
];

export default configs;
