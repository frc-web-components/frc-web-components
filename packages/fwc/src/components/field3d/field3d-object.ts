import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Group, Object3D, Mesh, MeshStandardMaterial } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  getQuaternionFromRotSeq,
  rotation3dToQuaternion,
  getRotation3dFromRotSeq,
} from './utils';
import objectConfigs from './object-configs';
import {
  Pose3d,
  Rotation2d,
  Rotation3d,
  Translation3d,
  Translation2d,
  ObjectConfig,
  IField3d,
} from './field-interfaces';
import { joinPaths } from './file-utils';

export default class Object3d extends LitElement {
  @state() objectConfigs = objectConfigs;
  @property({ type: String }) name = this.objectConfigs[0].name;
  @property({ type: Array }) pose = [0, 0, 0];
  @property({ type: Array }) translation?: Translation3d | Translation2d;
  @property({ type: Array }) rotation?: Rotation3d | Rotation2d;
  @state() _translation: Translation3d | Translation2d = [0, 0, 0];
  @state() _rotation: Rotation3d | Rotation2d = [0, 0, 0, 0];

  loader = new GLTFLoader();
  group = new Group();
  object?: Object3D;

  getObjectConfig(): ObjectConfig {
    return (
      this.objectConfigs.find(({ name }) => name === this.name) ??
      this.objectConfigs[0]
    );
  }

  getField(): IField3d | undefined {
    const field = this.closest('frc-field3d');

    if (!field) {
      return undefined;
    }

    return field as any as IField3d;
  }

  static adjustMaterials(group: Group): void {
    group.traverse((node: Object3D) => {
      const mesh = node as Mesh; // Traverse function returns Object3d or Mesh
      if (mesh.isMesh && mesh.material instanceof MeshStandardMaterial) {
        const material = mesh.material as MeshStandardMaterial;
        material.metalness = 0;
        material.roughness = 1;
      }
    });
  }

  static updatePose(object: Object3D, pose: Pose3d): void {
    const [x, y, z] = pose.translation;
    object.position.set(x, y, z);
    object.rotation.setFromQuaternion(rotation3dToQuaternion(pose.rotation));
  }

  loadRobotModel(): void {
    const field3d = this.getField();
    const objectConfig = this.getObjectConfig();
    if (!field3d) {
      return;
    }

    // Remove groups
    const fieldGroup = field3d.getFieldGroup();
    fieldGroup.remove(this.group);
    if (this.object) {
      this.group.remove(this.object);
    }

    // Create promises to load objects
    const components = objectConfig.components ?? [];
    const objectSrcs = [objectConfig.src].concat(
      components.map(({ src }) => src),
    );
    const objectLoaders: Promise<GLTF>[] = objectSrcs.map(
      (src) =>
        new Promise((resolve) => {
          this.loader.load(
            joinPaths(field3d.assetPathPrefix ?? '', src),
            (gltf) => resolve(gltf),
          );
        }),
    );

    // Load objects and add them
    const group = new Group();
    this.group = group;
    fieldGroup.add(this.group);
    const object = new Group();
    this.object = object;
    group.add(object);

    object.rotation.setFromQuaternion(
      getQuaternionFromRotSeq(objectConfig.rotations),
    );
    object.position.set(...objectConfig.position);

    Promise.all(objectLoaders).then((gltfs) => {
      gltfs.forEach((gltf) => {
        Object3d.adjustMaterials(gltf.scene);
        object.add(gltf.scene);
      });
    });
  }

  firstUpdated(): void {
    this.updateObjectConfigs();
    this.renderObject();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('name')) {
      this.loadRobotModel();
    }
    if (
      changedProps.has('translation') ||
      changedProps.has('rotation') ||
      changedProps.has('pose')
    ) {
      if (this.translation || this.rotation) {
        this._translation = this.translation ?? [0, 0, 0];
        this._rotation = this.rotation ?? [0, 0, 0, 0];
      } else if (this.pose.length >= 7) {
        this._translation = this.pose.slice(0, 3) as Translation3d;
        this._rotation = this.pose.slice(3, 7) as Rotation3d;
      } else {
        const [x = 0, y = 0, rot = 0] = this.pose;
        this._translation = [x, y];
        this._rotation = rot;
      }
    }
  }

  updateObjectConfigs() {
    const field = this.getField();
    const newConfigs = field?.objectConfigs;
    if (newConfigs?.length && newConfigs !== this.objectConfigs) {
      this.objectConfigs = newConfigs;
      const hasObject = this.objectConfigs.some(
        (config) => config.name === this.name,
      );
      if (!hasObject) {
        this.name = this.objectConfigs[0].name;
      }
    }
  }

  renderObject(): void {
    if (this.group) {
      Object3d.updatePose(this.group, {
        translation:
          this._translation.length === 2
            ? [...this._translation, 0]
            : this._translation,
        rotation:
          typeof this._rotation === 'number'
            ? getRotation3dFromRotSeq([{ axis: 'z', degrees: this._rotation }])
            : this._rotation,
      });
    }

    requestAnimationFrame(() => {
      this.renderObject();
    });
  }
}

if (!customElements.get('frc-field3d-object')) {
  customElements.define('frc-field3d-object', Object3d);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field3d-object': Object3d;
  }
}
