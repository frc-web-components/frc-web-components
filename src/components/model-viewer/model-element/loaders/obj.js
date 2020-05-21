import { ObjectLoader } from 'three/examples/jsm/loaders/OBJLoader';

let loader;


export default src => {

  return new Promise((resolve, reject) => {

    const loadHandler = obj => {
      resolve(obj);
    }

    const errorHandler = () => {
      reject();
    }

    if (!loader) {
      loader = new ObjectLoader();
    }

    return loader.load(src, loadHandler, null, errorHandler);

  });
}
