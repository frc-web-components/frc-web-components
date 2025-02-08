import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  ArrowHelper,
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
} from 'three';
import { getZeroPose3d, getPose3d, rotation3dToQuaternion } from './utils';
import { IField3d, FieldObject } from './field-interfaces';
import { WebbitConfig } from '@webbitjs/webbit';

export const field3dPoseVisualizerConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Field 3D Pose Visualizer',
    topLevel: false,
  },
  properties: {
    pose: {
      type: 'Array',
      input: { type: 'NumberArray' },
    },
  },
};

/**
 * Creates a bounding box with arrows for each axis to visualize pose.
 * Based off of photonvision code here: https://github.com/PhotonVision/photonvision/blob/master/photon-client/src/components/app/photon-3d-visualizer.vue
 */
export default class PoseVisualizer extends LitElement {
  @property({ type: Array }) pose = [0, 0, 0];
  @state() _pose3d = getZeroPose3d();

  #fieldObject!: FieldObject;

  #cube!: LineSegments;
  #arrowX!: ArrowHelper;
  #arrowY!: ArrowHelper;
  #arrowZ!: ArrowHelper;

  getField(): IField3d {
    const field = this.closest('frc-field3d');
    return field as any as IField3d;
  }

  loadRobotModel(): void {
    this.#fieldObject.create();
  }

  firstUpdated(): void {
    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const edges = new EdgesGeometry(geometry);
    const material = new LineBasicMaterial({ color: 0xf4d225, linewidth: 4 });
    const lineSegments = new LineSegments(edges, material);

    this.#cube = lineSegments;
    this.#arrowX = new ArrowHelper(
      new Vector3(1, 0, 0).normalize(),
      new Vector3(0, 0, 0),
      0.3,
      0xff0000,
      0.1,
      0.05,
    );
    this.#arrowY = new ArrowHelper(
      new Vector3(1, 0, 0).normalize(),
      new Vector3(0, 0, 0),
      0.3,
      0xff0000,
      0.1,
      0.05,
    );
    this.#arrowZ = new ArrowHelper(
      new Vector3(1, 0, 0).normalize(),
      new Vector3(0, 0, 0),
      0.3,
      0xff0000,
      0.1,
      0.05,
    );

    this.#fieldObject = this.getField().createFieldObject({
      onCreate: (object) => {
        const group = object.getGroup();
        group.add(this.#cube);
        group.add(this.#arrowX);
        group.add(this.#arrowY);
        group.add(this.#arrowZ);
      },
    });
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('pose')) {
      this._pose3d = getPose3d(this.pose);
      this.#updateTargets();
    }
  }

  #updateTargets() {
    const quaternion = rotation3dToQuaternion(this._pose3d.rotation);
    const [x, y, z] = this._pose3d.translation;

    this.#cube.position.set(x, y, z);
    this.#cube.rotation.setFromQuaternion(quaternion);

    this.#arrowX.rotation.setFromQuaternion(quaternion);
    this.#arrowX.rotateZ(-Math.PI / 2);
    this.#arrowX.position.set(x, y, z);

    this.#arrowY.rotation.setFromQuaternion(quaternion);
    this.#arrowY.position.set(x, y, z);

    this.#arrowZ.setRotationFromQuaternion(quaternion);
    this.#arrowZ.rotateX(Math.PI / 2);
    this.#arrowZ.position.set(x, y, z);
  }
}

if (!customElements.get('frc-field3d-pose-visualizer')) {
  customElements.define('frc-field3d-pose-visualizer', PoseVisualizer);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field3d-pose-visualizer': PoseVisualizer;
  }
}
