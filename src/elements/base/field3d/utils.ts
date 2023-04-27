import * as THREE from 'three';
import { Rotation } from './field-interfaces';

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
