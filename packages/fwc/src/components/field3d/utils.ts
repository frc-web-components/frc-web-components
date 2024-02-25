import { Object3D, Quaternion, Vector3 } from 'three';
import {
  Pose3d,
  Rotation,
  Rotation3d,
  Translation3d,
} from './field-interfaces';

// https://github.com/Mechanical-Advantage/AdvantageScope/blob/main/src/shared/visualizers/ThreeDimensionVisualizer.ts#L909
export function getQuaternionFromRotSeq(rotations: Rotation[]): Quaternion {
  const quaternion = new Quaternion();
  rotations.forEach((rotation) => {
    const axis = new Vector3(0, 0, 0);
    if (rotation.axis === 'x') axis.setX(1);
    if (rotation.axis === 'y') axis.setY(1);
    if (rotation.axis === 'z') axis.setZ(1);
    const radians = (rotation.degrees * Math.PI) / 180;
    quaternion.premultiply(new Quaternion().setFromAxisAngle(axis, radians));
  });
  return quaternion;
}

export function getRotation3dFromRotSeq(rotations: Rotation[]): Rotation3d {
  const [x, y, z, w] = getQuaternionFromRotSeq(rotations);
  return [w, x, y, z];
}

export function rotation3dToQuaternion(input: Rotation3d): Quaternion {
  return new Quaternion(input[1], input[2], input[3], input[0]);
}

export function getPose3d(pose: number[]): Pose3d {
  // Rotation2d: [x, y, yaw]
  if (pose.length === 3) {
    const [x, y, yaw] = pose;
    return {
      translation: [x, y, 0],
      rotation: getRotation3dFromRotSeq([{ axis: 'z', degrees: yaw }]),
    };
    // [x, y, z, yaw]
  } else if (pose.length === 4) {
    const [x, y, z, yaw] = pose;
    return {
      translation: [x, y, z],
      rotation: getRotation3dFromRotSeq([{ axis: 'z', degrees: yaw }]),
    };
  } else if (pose.length === 6) {
    const [x, y, z, roll, pitch, yaw] = pose;
    return {
      translation: [x, y, z],
      rotation: getRotation3dFromRotSeq([
        { axis: 'x', degrees: roll },
        { axis: 'y', degrees: pitch },
        { axis: 'z', degrees: yaw },
      ]),
    };
  } else if (pose.length === 7) {
    const translation = pose.slice(0, 3) as Translation3d;
    const rotation = pose.slice(3, 7) as Rotation3d;
    return { translation, rotation };
  }
  return getZeroPose3d();
}

export function getZeroPose3d(): Pose3d {
  return {
    translation: [0, 0, 0],
    rotation: [0, 0, 0, 0],
  };
}

export function updatePose(object: Object3D, pose: Pose3d): void {
  const [x, y, z] = pose.translation;
  object.position.set(x, y, z);
  object.rotation.setFromQuaternion(rotation3dToQuaternion(pose.rotation));
}
