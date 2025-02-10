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

export class FieldObject {
  #field3d: IField3d;
  #onCreate?: (object: FieldObject) => unknown;
  #onRemove?: (object: FieldObject) => void;

  #group: Group = new Group();

  constructor(
    field3d: IField3d,
    onCreate?: (object: FieldObject) => unknown,
    onRemove?: (oobject: FieldObject) => unknown,
  ) {
    this.#field3d = field3d;
    this.#onCreate = onCreate;
    this.#onRemove = onRemove;
    this.create();
  }

  create() {
    const fieldGroup = this.#field3d.getFieldGroup();
    fieldGroup.remove(this.#group);
    this.#onRemove?.(this);

    const group = new Group();
    this.#group = group;
    fieldGroup.add(this.#group);
    this.#onCreate?.(this);
  }

  getGroup(): Group {
    return this.#group;
  }

  getField3d(): IField3d {
    return this.#field3d;
  }
}

export interface IField3d {
  createFieldObject: (config?: {
    onCreate?: (object: FieldObject) => unknown;
    onRemove?: (oobject: FieldObject) => unknown;
  }) => FieldObject;
  getFieldGroup: () => Group;
  assetPathPrefix?: string;
  objectConfigs: ObjectConfig[];
  urdfConfigs: UrdfConfig[];
}
