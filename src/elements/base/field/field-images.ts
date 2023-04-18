export interface ImageObject {
  src: string;
  width: number;
  height: number;
  loaded: boolean;
}

export default class FieldImages {
  #images: Record<string, ImageObject> = {};
  #onImageLoadCallbacks: Record<symbol, (src: string) => unknown> = {};

  getImage(src: string): ImageObject {
    if (typeof this.#images[src] === 'undefined') {
      const image = new Image();
      const imageObject = {
        src,
        width: 0,
        height: 0,
        loaded: false,
      };
      image.onload = () => {
        imageObject.loaded = true;
        imageObject.width = image.width;
        imageObject.height = image.height;
        Object.values(this.#onImageLoadCallbacks).forEach((callback: any) => {
          callback(src);
        });
      };
      this.#images[src] = imageObject;
      image.src = src;
    }
    return this.#images[src];
  }

  static getBoundingBoxDims(
    image: ImageObject,
    rotationRadians: number
  ): { width: number; height: number } {
    const boundingBoxWidth =
      Math.abs(image.width * Math.cos(rotationRadians)) +
      Math.abs(image.height * Math.sin(rotationRadians));
    const boundingBoxHeight =
      Math.abs(image.width * Math.sin(rotationRadians)) +
      Math.abs(image.height * Math.cos(rotationRadians));

    return {
      width: boundingBoxWidth,
      height: boundingBoxHeight,
    };
  }

  onImageLoad(callback: (src: string) => unknown): () => void {
    const uniqueId = Symbol('image');
    this.#onImageLoadCallbacks[uniqueId] = callback;
    return () => {
      delete this.#onImageLoadCallbacks[uniqueId];
    };
  }
}
