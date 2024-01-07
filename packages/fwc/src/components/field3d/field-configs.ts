import { Rotation } from './field-interfaces';

export interface FieldConfig {
  game: string;
  src: string;
  rotations: Rotation[];
  size: [number, number];
  unit: string;
}

export const configs: FieldConfig[] = [
  {
    game: 'Crescendo',
    src: '/3d-models/Field3d_2024.glb',
    rotations: [
      { axis: 'x', degrees: 90 },
      { axis: 'z', degrees: 180 },
    ],
    size: [54.2708333, 26.9375],
    unit: 'foot',
  },
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
    src: '/3d-models/Field3d_2022.glb',
    rotations: [{ axis: 'x', degrees: 90 }],
    size: [54, 27],
    unit: 'foot',
  },
  {
    game: 'Infinite Recharge',
    src: '/3d-models/Field3d_2021.glb',
    rotations: [
      { axis: 'x', degrees: 90 },
      { axis: 'z', degrees: 90 },
    ],
    size: [52.4375, 26.9375],
    unit: 'foot',
  },
  {
    game: 'Evergreen',
    src: '/3d-models/Field3d_Evergreen.glb',
    rotations: [{ axis: 'x', degrees: 90 }],
    size: [54, 27],
    unit: 'foot',
  },
];

export default configs;
