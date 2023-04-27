import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { property, query } from 'lit/decorators.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getQuaternionFromRotSeq } from './utils';
import robotConfigs, { RobotConfig } from './robot-configs';
import fieldConfigs, { FieldConfig } from './field-configs';

// function rgbtohex() {

// }

export class Field3d extends LitElement {
  private ORBIT_FIELD_DEFAULT_TARGET = new THREE.Vector3(0, 0.5, 0);
  private ORBIT_FIELD_DEFAULT_POSITION = new THREE.Vector3(0, 6, -12);
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

  private wpilibCoordinateGroup!: THREE.Group; // Rotated to match WPILib
  private wpilibFieldCoordinateGroup!: THREE.Group; // Field coordinates (origin at driver stations and flipped based on alliance)

  scene = new THREE.Scene();
  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;

  @query('canvas') canvas!: HTMLCanvasElement;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  getCamera(): THREE.PerspectiveCamera {
    const rect = this.getBoundingClientRect();

    const camera = new THREE.PerspectiveCamera(
      50,
      rect.width / rect.height,
      0.1,
      100
    );
    // camera.position.z = 0;
    // camera.position.y = 10;
    // camera.rotateX(30);

    return camera;
  }

  static getOrbitControls(
    camera: THREE.Camera,
    canvas: HTMLElement
  ): OrbitControls {
    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 30;
    controls.enabled = true;
    controls.update();
    return controls;
  }

  static addLights(scene: THREE.Scene): void {
    const color = 0xffffff;
    const pointLightIntensity = 0.2;
    const light = new THREE.PointLight(color, pointLightIntensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const skyColor = 0xffffff;
    const groundColor = 0x444444;
    const hemisphereLightIntensity = 1;
    const hemisphereLight = new THREE.HemisphereLight(
      skyColor,
      groundColor,
      hemisphereLightIntensity
    );
    scene.add(hemisphereLight);
  }

  initScene(): void {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    const rect = this.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    // this.scene.background = new THREE.Color(0xffffff);

    this.wpilibCoordinateGroup = new THREE.Group();
    this.scene.add(this.wpilibCoordinateGroup);
    this.wpilibCoordinateGroup.rotation.setFromQuaternion(this.WPILIB_ROTATION);
    this.wpilibFieldCoordinateGroup = new THREE.Group();
    this.wpilibCoordinateGroup.add(this.wpilibFieldCoordinateGroup);
  }

  static adjustMaterials(group: THREE.Group): void {
    group.traverse((node: THREE.Object3D) => {
      const mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
      if (mesh.isMesh && mesh.material instanceof THREE.MeshStandardMaterial) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.metalness = 0;
        material.roughness = 1;
      }
    });
  }

  loadFieldModel(fieldConfig: FieldConfig): void {
    const loader = new GLTFLoader();
    loader.load(fieldConfig.src, (gltf) => {
      this.wpilibCoordinateGroup.add(gltf.scene);
      Field3d.adjustMaterials(gltf.scene);
      gltf.scene.rotation.setFromQuaternion(
        getQuaternionFromRotSeq(fieldConfig.rotations)
      );
    });
  }

  loadRobotModel(robotConfig: RobotConfig): void {
    const loader = new GLTFLoader();
    loader.load(robotConfig.src, (gltf) => {
      this.wpilibCoordinateGroup.add(gltf.scene);
      Field3d.adjustMaterials(gltf.scene);
      gltf.scene.rotation.setFromQuaternion(
        getQuaternionFromRotSeq(robotConfig.rotations)
      );
      gltf.scene.position.set(...robotConfig.position);
    });
  }

  firstUpdated(): void {
    this.initScene();

    // Create Objects
    this.camera = this.getCamera();
    this.controls = Field3d.getOrbitControls(this.camera, this.canvas);

    this.camera.position.copy(this.ORBIT_FIELD_DEFAULT_POSITION);
    this.controls.target.copy(this.ORBIT_FIELD_DEFAULT_TARGET);

    // add objects to scene
    Field3d.addLights(this.scene);
    this.loadFieldModel(fieldConfigs[0]);
    this.loadRobotModel(robotConfigs[0]);

    this.renderField();
  }

  renderField(): void {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => {
      this.renderField();
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  render() {
    return html` <canvas></canvas> `;
  }
}

if (!customElements.get('frc-field3d')) {
  customElements.define('frc-field3d', Field3d);
}
