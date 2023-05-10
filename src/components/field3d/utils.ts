import * as THREE from 'three';
import { Rotation, Rotation3d } from './field-interfaces';

// https://github.com/Mechanical-Advantage/AdvantageScope/blob/main/src/shared/visualizers/ThreeDimensionVisualizer.ts#L909
export function getQuaternionFromRotSeq(
  rotations: Rotation[]
): THREE.Quaternion {
  const quaternion = new THREE.Quaternion();
  rotations.forEach((rotation) => {
    const axis = new THREE.Vector3(0, 0, 0);
    if (rotation.axis === 'x') axis.setX(1);
    if (rotation.axis === 'y') axis.setY(1);
    if (rotation.axis === 'z') axis.setZ(1);
    const radians = (rotation.degrees * Math.PI) / 180;
    quaternion.premultiply(
      new THREE.Quaternion().setFromAxisAngle(axis, radians)
    );
  });
  return quaternion;
}

export function getRotation3dFromRotSeq(rotations: Rotation[]): Rotation3d {
  const [x, y, z, w] = getQuaternionFromRotSeq(rotations);
  return [w, x, y, z];
}

export function rotation3dToQuaternion(input: Rotation3d): THREE.Quaternion {
  return new THREE.Quaternion(input[1], input[2], input[3], input[0]);
}
