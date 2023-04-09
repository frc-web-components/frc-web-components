import { html, css, LitElement, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, query } from 'lit/decorators.js';
import * as THREE from 'three';
// function rgbtohex() {

// }
@customElement('my-element')
export class MyElement extends LitElement {
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

  firstUpdated(): void {
    const rect = this.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });

    const scene = new THREE.Scene();

    // add camera
    const camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.z = 2;
    camera.position.x = 0;

    // create cube
    const boxWidth = 2;
    const boxHeight = 0.5;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial({ color: 9827634 }); // greenish blue //noice

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 1;

    scene.add(cube);

    // create oval thing
    const ovalWidth = 1;
    const ovalSegments = 12;
    const ovalAngle = 50;
    const ovalGeometry = new THREE.CircleGeometry(
      ovalWidth,
      ovalSegments,
      ovalAngle
    );

    const ovalColor = 0x00aaff;
    const redColor = 0;
    const blueColor = 0;
    const greenColor = 255;

    const ovalMaterial = new THREE.MeshPhongMaterial({ color: ovalColor });

    const oval = new THREE.Mesh(ovalGeometry, ovalMaterial);
    oval.position.x = 1;

    scene.add(oval);

    // light
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-2, 2, 8);
    scene.add(light);

    // render scene
    renderer.setSize(rect.width, rect.height);
    renderer.render(scene, camera);

    setInterval(() => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.01;
      renderer.render(scene, camera);
    }, 1000 / 90);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
  render() {
    return html` <canvas></canvas> `;
  }
}
