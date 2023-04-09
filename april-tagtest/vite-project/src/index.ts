import * as THREE from 'three';

const canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
