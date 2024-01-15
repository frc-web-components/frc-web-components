/* eslint-disable no-underscore-dangle */
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  WebGLRenderer,
  Group,
  Object3D,
  Mesh,
  MeshStandardMaterial,
  LoadingManager,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import URDFLoader from 'urdf-loader';
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
  IField3d,
} from './field-interfaces';

const urdf = `
<robot name="myRobot">
     
<material name="blue">
  <color rgba="0 0 1 1" />
</material>

<link name="link1">
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0" />
    <geometry>
      <box size="1 1 1" />
    </geometry>
    <material>
      <color rgba="0 1 0 1" />
    </material>
  </visual>
</link>

<link name="link2">
  <visual>
    
    <origin xyz="0 0 1" rpy="1.57 0 0" />
    <geometry>
      <cylinder radius=".5" length="2" />
    </geometry>
    <material name="brick" />
  </visual>
</link>
<link name="link3">
  <visual>
    <origin xyz="0 0 -1.5" />
    <geometry>
      <sphere radius="1" />
    </geometry>
    <material name="blue" />
  </visual>
</link>
</robot>

`;

export default class Urdf3d extends LitElement {
  @property({ type: String, attribute: 'urdf-source' }) urdfSrc = '';
  @property({ type: Object }) angles: Record<string, number> = {};
  @property({ type: Array }) position = [0, 0, 0];
  @property({ type: Array }) pose = [0, 0, 0];
  @state() _translation: Translation3d | Translation2d = [0, 0, 0];
  @state() _rotation: Rotation3d | Rotation2d = [0, 0, 0, 0];

  renderer!: WebGLRenderer;
  loader = new GLTFLoader();
  group = new Group();
  object?: Object3D;
  robot?: Object3D;

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
    // const objectConfig = this.getObjectConfig();
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
    // const components = objectConfig.components ?? [];
    // const objectSrcs = [objectConfig.src].concat(
    //   components.map(({ src }) => src)
    // );

    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    loader.packages = {
      '': '/urdf', // The equivalent of a (list of) ROS package(s):// directory
    };

    const objectLoaders: Promise<Object3D> = new Promise((resolve) => {
      loader.load(
        this.urdfSrc, // The path to the URDF within the package OR absolute
        (robot: Object3D) => {
          // The robot is loaded!
          resolve(robot);
        }
      );
    });

    // Load objects and add them
    const group = new Group();
    this.group = group;
    fieldGroup.add(this.group);
    const object = new Group();
    this.object = object;
    group.add(object);

    // const robot = loader.parse(urdf);
    // object.add(robot);

    // console.log('robot:', robot);

    // object.rotation.setFromQuaternion(
    //   getQuaternionFromRotSeq(objectConfig.rotations)
    // );
    // object.position.set(...objectConfig.position);
    const [x, y, z] = this.position;
    object.position.set(x, y, z);

    objectLoaders.then((obj) => {
      this.robot = obj;
      console.log('urdf obj:', obj);
      this.updateAngles();

      object.add(obj);
    });

    // Promise.all(objectLoaders).then((objs) => {
    //   // Object3d.adjustMaterials(obj);
    //   objs.forEach((obj) => {
    //     object.add(obj);
    //   });
    // });
  }

  updateAngles() {
    (this.robot as any)?.setAngles(this.angles);
  }

  firstUpdated(): void {
    this.renderObject();
    this.loadRobotModel();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('urdfSrc')) {
      this.loadRobotModel();
    }

    if (changedProps.has('angles')) {
      this.updateAngles();
    }

    if (changedProps.has('pose')) {
      const [x = 0, y = 0, rot = 0] = this.pose;
      this._translation = [x, y];
      this._rotation = rot;
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
