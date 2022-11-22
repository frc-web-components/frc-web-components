export interface ImageObject {
  src: string;
  width: number;
  height: number;
  loaded: boolean;
}

export interface PlayingFieldImageRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface FieldInfo {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bottomCanvas: HTMLCanvasElement;
  bottomCtx: CanvasRenderingContext2D;
  rect: PlayingFieldImageRect;
  toPx: (length: number) => number;
  toLength: (px: number) => number;
  xOffset: number;
  yOffset: number;
}

export type FieldObjectElement = HTMLElement & {
  unit: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rot: number;
};

export interface FieldDimensions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
