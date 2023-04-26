import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { property, query } from 'lit/decorators.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// function rgbtohex() {

// }

export class Field3d extends LitElement {
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
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.z = 0;
    camera.position.y = 10;
    camera.rotateX(30);
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
  }

  firstUpdated(): void {
    this.initScene();

    // Create Objects
    this.camera = this.getCamera();
    this.controls = Field3d.getOrbitControls(this.camera, this.canvas);

    // add objects to scene
    Field3d.addLights(this.scene);
    const loader = new GLTFLoader();
    loader.load('Field3d_2023.glb', (gltf) => {
      this.scene.add(gltf.scene);

      gltf.scene.traverse((node: THREE.Object3D) => {
        const mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
        if (
          mesh.isMesh &&
          mesh.material instanceof THREE.MeshStandardMaterial
        ) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 1;
        }
      });
    });

    // render scene periodically
    setInterval(() => {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // cube.rotation.z += 0.01;
      this.renderer.render(this.scene, this.camera);
    }, 1000 / 90);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  render() {
    return html` <canvas></canvas> `;
  }
}

if (!customElements.get('frc-field3d')) {
  customElements.define('frc-field3d', Field3d);
}
