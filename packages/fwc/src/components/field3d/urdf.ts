import { html, css, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  Group,
  Camera,
  PointLight,
  HemisphereLight,
  Color,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  PlaneGeometry,
} from 'three';
import URDFLoader from 'urdf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import urdfConfigs from './urdf-configs';
import './field3d-object';
import './field3d-urdf';
import { UrdfConfig } from './field-interfaces';
import { getDirname, joinPaths } from './file-utils';
import { getQuaternionFromRotSeq } from './utils';

// https://toji.dev/webxr-scene-optimization/
export default class Urdf extends LitElement {
  @property({ type: Array }) urdfConfigs = urdfConfigs;
  @property({ type: String }) name = this.urdfConfigs[0].name;
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    'black';
  @property({ type: Boolean, attribute: 'enable-vr' }) enableVR = false;
  @property({ type: String }) assetPathPrefix?: string;
  @property({ type: Object }) angles: Record<string, number> = {};

  scene = new Scene();
  renderer?: WebGLRenderer;
  camera!: PerspectiveCamera;
  controls!: OrbitControls;

  @query('canvas') canvas!: HTMLCanvasElement;
  @query('.container') container!: HTMLCanvasElement;
  private vrButton!: HTMLElement;

  group = new Group();
  object?: Object3D;
  robot?: Object3D;

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

  private getCamera(): PerspectiveCamera {
    const rect = this.getBoundingClientRect();

    const camera = new PerspectiveCamera(
      50,
      rect.width / rect.height,
      0.1,
      100,
    );

    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0.5);
    camera.up.set(0, 0, 1);

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
      hemisphereLightIntensity,
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

  private updateCanvasSize() {
    const rect = this.getBoundingClientRect();
    this.renderer?.setSize(rect.width, rect.height);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
  }

  firstUpdated(): void {
    this.initRenderer();

    // Create Objects
    this.camera = this.getCamera();
    this.controls = Urdf.getOrbitControls(this.camera, this.canvas);

    // add objects to scene
    Urdf.addLights(this.scene);

    const planeGeometry = new PlaneGeometry(5, 5, 20, 20); // Adjust the size as needed

    const planeMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: DoubleSide,
      wireframe: true,
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    this.scene.add(plane);

    const resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
    });
    resizeObserver.observe(this);
  }

  getUrdfConfig(): UrdfConfig {
    return (
      this.urdfConfigs.find(({ name }) => name === this.name) ??
      this.urdfConfigs[0]
    );
  }

  updateAngles() {
    (this.robot as any)?.setAngles(this.angles);
  }

  #emitLoadEvent(): void {
    this.dispatchEvent(
      new CustomEvent('urdfLoad', {
        detail: {
          urdf: this.robot,
        },
      }),
    );
  }

  loadRobotModel(): void {
    const urdfConfig = this.getUrdfConfig();

    // Create promises to load objects
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    const urdfDirname = getDirname(urdfConfig.src ?? '');
    loader.packages = {
      '': joinPaths(this.assetPathPrefix ?? '', urdfDirname), // The equivalent of a (list of) ROS package(s):// directory
    };

    const urdfLoader: Promise<Object3D> = new Promise((resolve) => {
      if (urdfConfig.src) {
        loader.load(
          joinPaths(this.assetPathPrefix ?? '', urdfConfig.src),
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

    this.scene.add(this.group);
    const object = new Group();
    this.object = object;
    group.add(object);

    object.rotation.setFromQuaternion(
      getQuaternionFromRotSeq(urdfConfig.rotations),
    );
    object.position.set(...urdfConfig.position);

    urdfLoader.then((obj) => {
      this.robot = obj;
      this.updateAngles();
      object.add(obj);
      this.#emitLoadEvent();
    });
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('urdfConfigs') || changedProps.has('name')) {
      const hasUrdf = this.urdfConfigs.some(
        (config) => config.name === this.name,
      );
      if (!hasUrdf) {
        this.name = this.urdfConfigs[0].name;
      }
      this.loadRobotModel();
    }
    if (changedProps.has('backgroundColor')) {
      this.scene.background = new Color(this.backgroundColor);
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

  render(): TemplateResult {
    return html` <div class="container">
      <canvas></canvas>
    </div>`;
  }
}

if (!customElements.get('frc-urdf')) {
  customElements.define('frc-urdf', Urdf);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-urdf': Urdf;
  }
}
