type Dims = { width: number; height: number };

export interface ImageObject extends Dims {
  src: string;
  loaded: boolean;
  image: HTMLImageElement;
}

export default class FieldImages {
  #images: Record<string, ImageObject> = {};
  #onImageLoadCallbacks: Map<symbol, (src: string) => unknown> = new Map();

  getImage(src: string): ImageObject {
    if (typeof this.#images[src] === 'undefined') {
      const image = new Image();
      const imageObject = {
        src,
        width: 0,
        height: 0,
        loaded: false,
        image,
      };
      image.onload = () => {
        imageObject.loaded = true;
        imageObject.width = image.width;
        imageObject.height = image.height;
        [...this.#onImageLoadCallbacks.values()].forEach((callback) => {
          callback(src);
        });
      };
      this.#images[src] = imageObject;
      image.src = src;
    }
    return this.#images[src];
  }

  static getBoundingBoxDims(image: Dims, rotationRadians: number): Dims {
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

  static fitImageInsideBox(image: Dims, boundingBox: Dims): Dims {
    if (
      (boundingBox.width / image.width) * image.height <=
      boundingBox.height
    ) {
      return {
        width: boundingBox.width,
        height: (boundingBox.width / image.width) * image.height,
      };
    }
    return {
      width: (boundingBox.height / image.height) * image.width,
      height: boundingBox.height,
    };
  }

  onImageLoad(callback: (src: string) => unknown): () => void {
    const uniqueId = Symbol('image');
    this.#onImageLoadCallbacks.set(uniqueId, callback);
    return () => {
      this.#onImageLoadCallbacks.delete(uniqueId);
    };
  }
}
