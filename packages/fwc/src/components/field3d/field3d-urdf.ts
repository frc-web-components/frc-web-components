import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Group, Object3D, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import URDFLoader from 'urdf-loader';
import {
  getQuaternionFromRotSeq,
  rotation3dToQuaternion,
  getRotation3dFromRotSeq,
} from './utils';
import urdfConfigs from './urdf-configs';
import {
  Pose3d,
  Rotation2d,
  Rotation3d,
  Translation3d,
  Translation2d,
  IField3d,
  UrdfConfig,
} from './field-interfaces';
import { getDirname, joinPaths } from './file-utils';

export default class Urdf3d extends LitElement {
  @state() urdfConfigs = urdfConfigs;
  @property({ type: String }) name = this.urdfConfigs[0].name;
  @property({ type: Object, attribute: 'joint-values' }) jointValues: Record<
    string,
    number
  > = {};
  @property({ type: Array }) pose = [0, 0, 0];
  @state() _translation: Translation3d | Translation2d = [0, 0, 0];
  @state() _rotation: Rotation3d | Rotation2d = [0, 0, 0, 0];

  loader = new GLTFLoader();
  group = new Group();
  object?: Object3D;
  robot?: Object3D;

  getUrdfConfig(): UrdfConfig {
    return (
      this.urdfConfigs.find(({ name }) => name === this.name) ??
      this.urdfConfigs[0]
    );
  }

  getField(): IField3d | undefined {
    const field = this.closest('frc-field3d');

    if (!field) {
      return undefined;
    }

    return field as any as IField3d;
  }

  static updatePose(object: Object3D, pose: Pose3d): void {
    const [x, y, z] = pose.translation;
    object.position.set(x, y, z);
    object.rotation.setFromQuaternion(rotation3dToQuaternion(pose.rotation));
  }

  #emitLoadEvent(): void {
    this.dispatchEvent(
      new CustomEvent('urdfLoad', {
        detail: {
          urdf: this.robot,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  loadRobotModel(): void {
    const field3d = this.getField();
    const urdfConfig = this.getUrdfConfig();
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
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    const urdfDirname = getDirname(urdfConfig.src ?? '');
    loader.packages = {
      '': joinPaths(field3d.assetPathPrefix ?? '', urdfDirname), // The equivalent of a (list of) ROS package(s):// directory
    };

    const urdfLoader: Promise<Object3D> = new Promise((resolve) => {
      if (urdfConfig.src) {
        loader.load(
          joinPaths(field3d.assetPathPrefix ?? '', urdfConfig.src),
          (robot: Object3D) => {
            resolve(robot);
          },
        );
      } else {
        const robot = loader.parse(urdfConfig.content ?? '');
        resolve(robot);
      }
    });

    // Load objects and add them
    const group = new Group();
    this.group = group;
    fieldGroup.add(this.group);
    const object = new Group();
    this.object = object;
    group.add(object);

    object.rotation.setFromQuaternion(
      getQuaternionFromRotSeq(urdfConfig.rotations),
    );
    object.position.set(...urdfConfig.position);

    urdfLoader.then((obj) => {
      this.robot = obj;
      this.updateJoints();
      object.add(obj);
      this.#emitLoadEvent();
    });
  }

  updateJoints() {
    (this.robot as any)?.setJointValues(this.jointValues);
  }

  firstUpdated(): void {
    this.updateUrdfConfigs();
    this.renderObject();

    const field = this.closest('frc-field3d');
    field?.addEventListener('urdfConfigsChange', () => {
      this.updateUrdfConfigs();
    });
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('name')) {
      this.loadRobotModel();
    }

    if (changedProps.has('jointValues')) {
      this.updateJoints();
    }

    if (changedProps.has('pose')) {
      const [x = 0, y = 0, rot = 0] = this.pose;
      this._translation = [x, y];
      this._rotation = rot;
    }
  }

  updateUrdfConfigs() {
    const field = this.getField();
    const newConfigs = field?.urdfConfigs;
    if (newConfigs?.length && newConfigs !== this.urdfConfigs) {
      this.urdfConfigs = newConfigs;
      const hasUrdf = this.urdfConfigs.some(
        (config) => config.name === this.name,
      );
      if (!hasUrdf) {
        this.name = this.urdfConfigs[0].name;
      }
    }
  }

  renderObject(): void {
    if (this.group) {
      Urdf3d.updatePose(this.group, {
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

if (!customElements.get('frc-field3d-urdf')) {
  customElements.define('frc-field3d-urdf', Urdf3d);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field3d-urdf': Urdf3d;
  }
}
