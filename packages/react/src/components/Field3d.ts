import React from 'react';
import { createComponent } from '@lit/react';
import Field3dWc, {
  Field3dObject as Field3dObjectWc,
  Field3dUrdf as Field3dUrdfWc,
  Urdf as UrdfWc,
  Field3dPoseVisualizer as Field3dPoseVisualizerWc,
} from '@frc-web-components/fwc/components/field3d';

export const Field3d = createComponent({
  tagName: 'frc-field3d',
  elementClass: Field3dWc,
  react: React,
});

export const Field3dObject = createComponent({
  tagName: 'frc-field3d-object',
  elementClass: Field3dObjectWc,
  react: React,
});

export const Field3dUrdf = createComponent({
  tagName: 'frc-field3d-urdf',
  elementClass: Field3dUrdfWc,
  react: React,
  events: {
    onurdfload: 'urdfLoad',
  },
});

export const Urdf = createComponent({
  tagName: 'frc-urdf',
  elementClass: UrdfWc,
  react: React,
  events: {
    onurdfload: 'urdfLoad',
  },
});

export const Field3dPoseVisualizer = createComponent({
  tagName: 'frc-field3d-pose-visualizer',
  elementClass: Field3dPoseVisualizerWc,
  react: React,
});

export default Field3d;
