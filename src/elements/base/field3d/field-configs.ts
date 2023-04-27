import { Rotation } from './field-interfaces';

export interface FieldConfig {
  game: string;
  src: string;
  rotations: Rotation[];
  size: [number, number];
  unit: string;
}

const configs: FieldConfig[] = [
  {
    game: 'Charged Up',
    src: '/3d-models/Field3d_2023.glb',
    rotations: [
      { axis: 'x', degrees: 90 },
      { axis: 'z', degrees: 180 },
    ],
    size: [54.27083, 26.2916],
    unit: 'foot',
  },
  {
    game: 'Rapid React',
    src: '/3d-models/Field2d_2022.glb',
    rotations: [{ axis: 'x', degrees: 90 }],
    size: [54, 27],
    unit: 'foot',
  },
];

export default configs;
