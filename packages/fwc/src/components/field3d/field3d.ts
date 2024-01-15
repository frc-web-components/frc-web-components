import { html, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import {
  Vector3,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  Group,
  Camera,
  PointLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Color,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { getQuaternionFromRotSeq, rotation3dToQuaternion } from './utils';
import fieldConfigs, { FieldConfig } from './field-configs';
import objectConfigs from './object-configs';
import { Pose3d, IField3d } from './field-interfaces';
import { convert } from '../field/units';
import './field3d-object';
import './field3d-urdf';

const joinPaths = (start: string, end: string) =>
  `${start.replace(/\/$/, '')}/${end.replace(/^\//, '')}`;

// https://toji.dev/webxr-scene-optimization/
export default class Field3d extends LitElement implements IField3d {
  @property({ type: Array }) fieldConfigs = fieldConfigs;
  @property({ type: Array }) objectConfigs = objectConfigs;
  @property({ type: String }) game = this.fieldConfigs[0].game;
  @property({ type: String }) origin: 'red' | 'blue' = 'red';
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    'black';
  @property({ type: Boolean, attribute: 'enable-vr' }) enableVR = false;
  @property({ type: String }) assetPathPrefix?: string;

  private ORBIT_FIELD_DEFAULT_TARGET = new Vector3(0, 0.5, 0);
  private ORBIT_FIELD_DEFAULT_POSITION = new Vector3(0, 6, -12);
  private WPILIB_ROTATION = getQuaternionFromRotSeq([
    {
      axis: 'x',
      degrees: -90,
    },
    {
      axis: 'y',
      degrees: 180,
    },
  ]);

  private wpilibCoordinateGroup!: Group; // Rotated to match WPILib
  private wpilibFieldCoordinateGroup!: Group; // Field coordinates (origin at driver stations and flipped based on alliance)

  scene = new Scene();
  renderer?: WebGLRenderer;
  camera!: PerspectiveCamera;
  controls!: OrbitControls;
  loader = new GLTFLoader();
  fieldObject?: Object3D;

  @query('canvas') canvas!: HTMLCanvasElement;
  @query('.container') container!: HTMLCanvasElement;
  private vrButton!: HTMLElement;

  static styles = css`
    :host {
      position: relative;
      display: block;
      width: 700px;
      height: 400px;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  private getFieldConfig(): FieldConfig {
    return (
      this.fieldConfigs.find(({ game }) => game === this.game) ??
      this.fieldConfigs[0]
    );
  }

  private getCamera(): PerspectiveCamera {
    const rect = this.getBoundingClientRect();

    const camera = new PerspectiveCamera(
      50,
      rect.width / rect.height,
      0.1,
      100
    );

    return camera;
  }

  static getOrbitControls(camera: Camera, canvas: HTMLElement): OrbitControls {
    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 30;
    controls.enabled = true;
    controls.update();
    return controls;
  }

  static addLights(scene: Scene): void {
    const color = 0xffffff;
    const pointLightIntensity = 0.2;
    const light = new PointLight(color, pointLightIntensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const skyColor = 0xffffff;
    const groundColor = 0x444444;
    const hemisphereLightIntensity = 1;
    const hemisphereLight = new HemisphereLight(
      skyColor,
      groundColor,
      hemisphereLightIntensity
    );
    scene.add(hemisphereLight);
  }

  private initRenderer(): void {
    if (!this.canvas) {
      return;
    }
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    const rect = this.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.vrButton = VRButton.createButton(this.renderer);
    this.renderer.xr.enabled = this.enableVR;
    this.renderer.setAnimationLoop(() => this.renderField());
  }

  private initScene(): void {
    this.wpilibCoordinateGroup = new Group();
    this.scene.add(this.wpilibCoordinateGroup);
    this.wpilibCoordinateGroup.rotation.setFromQuaternion(this.WPILIB_ROTATION);
    this.wpilibFieldCoordinateGroup = new Group();
    this.wpilibCoordinateGroup.add(this.wpilibFieldCoordinateGroup);
  }

  private updateCanvasSize() {
    const rect = this.getBoundingClientRect();
    this.renderer?.setSize(rect.width, rect.height);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
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
    object.position.set(y, -x, z);
    object.rotation.setFromQuaternion(rotation3dToQuaternion(pose.rotation));
  }

  private loadFieldModel(fieldConfig: FieldConfig): void {
    if (this.fieldObject) {
      this.wpilibCoordinateGroup.remove(this.fieldObject);
    }
    const src = joinPaths(this.assetPathPrefix ?? '', fieldConfig.src);
    this.loader.load(src, (gltf) => {
      this.fieldObject = gltf.scene;
      this.wpilibCoordinateGroup.add(gltf.scene);
      Field3d.adjustMaterials(gltf.scene);
      gltf.scene.rotation.setFromQuaternion(
        getQuaternionFromRotSeq(fieldConfig.rotations)
      );
    });
  }

  getFieldGroup(): Group {
    return this.wpilibFieldCoordinateGroup;
  }

  firstUpdated(): void {
    this.initScene();
    this.initRenderer();

    // Create Objects
    this.camera = this.getCamera();
    this.controls = Field3d.getOrbitControls(this.camera, this.canvas);

    this.camera.position.copy(this.ORBIT_FIELD_DEFAULT_POSITION);
    this.controls.target.copy(this.ORBIT_FIELD_DEFAULT_TARGET);

    // add objects to scene
    Field3d.addLights(this.scene);

    const resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
    });
    resizeObserver.observe(this);
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('fieldConfig')) {
      const hasGame = this.fieldConfigs.some(
        (config) => config.game === this.game
      );
      if (!hasGame) {
        this.game = this.fieldConfigs[0].game;
      }
    }
    if (changedProps.has('game')) {
      this.loadFieldModel(this.getFieldConfig());
    }
    if (changedProps.has('backgroundColor')) {
      this.scene.background = new Color(this.backgroundColor);
    }

    if (changedProps.has('origin')) {
      const fieldConfig = this.getFieldConfig();

      if (fieldConfig) {
        const isBlue = this.origin !== 'red';
        this.wpilibFieldCoordinateGroup.setRotationFromAxisAngle(
          new Vector3(0, 0, 1),
          isBlue ? 0 : Math.PI
        );
        this.wpilibFieldCoordinateGroup.position.set(
          convert(fieldConfig.size[0] / 2, fieldConfig.unit, 'm') *
            (isBlue ? -1 : 1),
          convert(fieldConfig.size[1] / 2, fieldConfig.unit, 'm') *
            (isBlue ? -1 : 1),
          0
        );
      }
    }

    if (changedProps.has('enableVR')) {
      if (this.enableVR) {
        this.container.appendChild(this.vrButton);
      } else {
        this.vrButton.remove();
      }
      if (this.renderer) {
        this.renderer.xr.enabled = this.enableVR;
      }
    }
  }

  renderField(): void {
    this.renderer?.render(this.scene, this.camera);
    this.controls.update();
  }

  connectedCallback() {
    super.connectedCallback();
    this.initRenderer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.renderer?.dispose();
    this.renderer = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html` <div class="container">
      <canvas></canvas>
    </div>`;
  }
}

if (!customElements.get('frc-field3d')) {
  customElements.define('frc-field3d', Field3d);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field3d': Field3d;
  }
}
