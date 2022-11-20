import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';

export default (path, manager, done) => {
  const ext = path.split(/\./g).pop().toLowerCase();
  switch (ext) {
    case 'gltf':
    case 'glb':
      new GLTFLoader(manager).load(
        path,
        (result) => done(result.scene),
        null,
        (err) => done(null, err)
      );
      break;
    case 'obj':
      new OBJLoader(manager).load(
        path,
        (result) => done(result),
        null,
        (err) => done(null, err)
      );
      break;
    case 'dae':
      new ColladaLoader(manager).load(
        path,
        (result) => done(result.scene),
        null,
        (err) => done(null, err)
      );
      break;
    case 'stl':
      new STLLoader(manager).load(
        path,
        (result) => {
          const material = new THREE.MeshPhongMaterial();
          const mesh = new THREE.Mesh(result, material);
          done(mesh);
        },
        null,
        (err) => done(null, err)
      );
      break;
  }
};
