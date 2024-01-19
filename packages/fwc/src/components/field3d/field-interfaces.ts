import { Group } from 'three';

export interface Rotation {
  axis: 'x' | 'y' | 'z';
  degrees: number;
}

export type Translation2d = [number, number]; // meters (x, y)
export type Rotation2d = number; // radians
export type Pose2d = {
  translation: Translation2d;
  rotation: Rotation2d;
};

export type Translation3d = [number, number, number]; // meters (x, y, z)
export type Rotation3d = [number, number, number, number]; // radians (w, x, y, z)
export type Pose3d = {
  translation: Translation3d;
  rotation: Rotation3d;
};

export interface ObjectConfig {
  name: string;
  src: string;
  rotations: Rotation[];
  position: [number, number, number];
  components?: {
    name: string;
    src: string;
    rotations: Rotation[];
    position: [number, number, number];
  }[];
}

export interface UrdfConfig {
  name: string;
  content?: string;
  src?: string;
  rotations: Rotation[];
  position: [number, number, number];
}

export interface IField3d {
  getFieldGroup: () => Group;
  assetPathPrefix?: string;
  objectConfigs: ObjectConfig[];
  urdfConfigs: UrdfConfig[];
}
