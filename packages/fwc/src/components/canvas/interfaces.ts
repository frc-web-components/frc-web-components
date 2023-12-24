export interface CanvasObjectApi {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  domRect: DOMRect;
}

export interface CanvasObject {
  draw: (api: CanvasObjectApi) => unknown;
}
