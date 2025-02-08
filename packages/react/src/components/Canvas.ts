import React from 'react';
import { createComponent } from '@lit/react';
import CanvasWc, {
  CanvasCircle as CanvasCircleWc,
  CanvasGroup as CanvasGroupWc,
  CanvasLine as CanvasLineWc,
  CanvasMjpgStream as CanvasMjpgStreamWc,
  CanvasNGon as CanvasNGonWc,
  CanvasRect as CanvasRectWc,
  CanvasText as CanvasTextWc,
} from '@frc-web-components/fwc/components/canvas';

export const Canvas = createComponent({
  tagName: 'frc-canvas',
  elementClass: CanvasWc,
  react: React,
});

export const CanvasCircle = createComponent({
  tagName: 'frc-canvas-circle',
  elementClass: CanvasCircleWc,
  react: React,
});

export const CanvasGroup = createComponent({
  tagName: 'frc-canvas-group',
  elementClass: CanvasGroupWc,
  react: React,
});

export const CanvasLine = createComponent({
  tagName: 'frc-canvas-line',
  elementClass: CanvasLineWc,
  react: React,
});

export const CanvasMjpgStream = createComponent({
  tagName: 'frc-canvas-mjpg-stream',
  elementClass: CanvasMjpgStreamWc,
  react: React,
});

export const CanvasNGon = createComponent({
  tagName: 'frc-canvas-ngon',
  elementClass: CanvasNGonWc,
  react: React,
});

export const CanvasRect = createComponent({
  tagName: 'frc-canvas-rect',
  elementClass: CanvasRectWc,
  react: React,
});

export const CanvasText = createComponent({
  tagName: 'frc-canvas-text',
  elementClass: CanvasTextWc,
  react: React,
});

export default Canvas;
