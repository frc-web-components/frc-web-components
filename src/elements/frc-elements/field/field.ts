/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { html, svg, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Store, { SourceProvider } from '@webbitjs/store';
import { baseUnit, toBaseConversions, convert, unitAliases } from './units';
import fieldConfig from './field-config';
import fieldElementStyles from './field-element-styles';
import {
  FieldDimensions,
  FieldInfo,
  FieldObjectElement,
  ImageObject,
  PlayingFieldImageRect,
} from './field-interfaces';
import FieldObjectManager from './field-object-manager';

@customElement('frc-field')
export class Field extends LitElement {
  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';
  @property({ type: String }) game = 'Rapid React';
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 1;
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = false;
  @property({ type: Boolean, attribute: 'swap-axes' }) swapAxes = false;

  private _width = 54;
  private _height = 27;
  private _unit = baseUnit;
  private _image = fieldConfig[0]['field-image'];
  private _topLeftFieldCornerX = 0;
  private _topLeftFieldCornerY = 0;
  private _bottomRightFieldCornerX = 0;
  private _bottomRightFieldCornerY = 0;

  private imageObjects: Record<string, ImageObject> = {};
  private fullFieldImageSize: { width: number; height: number } | null = null;
  private field!: HTMLElement;
  private fieldObjectManager!: FieldObjectManager;

  set width(value: number) {
    const oldValue = this._width;
    this._width = value;
    this.requestUpdate('width', oldValue);
  }

  @property()
  get width(): number {
    if (this.game === 'Custom') {
      return this._width;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-size'][0] : this._width;
  }

  set height(value: number) {
    const oldValue = this._height;
    this._height = value;
    this.requestUpdate('height', oldValue);
  }

  @property()
  get height(): number {
    if (this.game === 'Custom') {
      return this._height;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-size'][1] : this._height;
  }

  set unit(value: string) {
    const oldValue = this._unit;
    this._unit = value;
    this.requestUpdate('unit', oldValue);
  }

  @property()
  get unit(): string {
    const unitAliasRecord = unitAliases as Record<string, string>;
    if (this.game === 'Custom') {
      return unitAliasRecord[this._unit];
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? unitAliasRecord[config['field-unit']]
      : unitAliasRecord[this._unit];
  }

  set image(value: string) {
    const oldValue = this._image;
    this._image = value;
    this.requestUpdate('image', oldValue);
  }

  @property()
  get image(): string {
    if (this.game === 'Custom') {
      return this._image;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-image'] : this._image;
  }

  set topLeftFieldCornerX(value: number) {
    const oldValue = this._topLeftFieldCornerX;
    this._topLeftFieldCornerX = value;
    this.requestUpdate('topLeftFieldCornerX', oldValue);
  }

  @property({ attribute: 'top-left-field-corner-x' })
  get topLeftFieldCornerX(): number {
    if (this.game === 'Custom') {
      return this._topLeftFieldCornerX;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['top-left'][0]
      : this._topLeftFieldCornerX;
  }

  set topLeftFieldCornerY(value: number) {
    const oldValue = this._topLeftFieldCornerY;
    this._topLeftFieldCornerY = value;
    this.requestUpdate('topLeftFieldCornerY', oldValue);
  }

  @property({ attribute: 'top-left-field-corner-y' })
  get topLeftFieldCornerY(): number {
    if (this.game === 'Custom') {
      return this._topLeftFieldCornerY;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['top-left'][1]
      : this._topLeftFieldCornerY;
  }

  set bottomRightFieldCornerX(value: number) {
    const oldValue = this._bottomRightFieldCornerX;
    this._bottomRightFieldCornerX = value;
    this.requestUpdate('bottomRightFieldCornerX', oldValue);
  }

  @property({ attribute: 'bottom-right-field-corner-x' })
  get bottomRightFieldCornerX(): number {
    if (this.game === 'Custom') {
      return this._bottomRightFieldCornerX;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['bottom-right'][0]
      : this._bottomRightFieldCornerX;
  }

  set bottomRightFieldCornerY(value: number) {
    const oldValue = this._bottomRightFieldCornerY;
    this._bottomRightFieldCornerY = value;
    this.requestUpdate('bottomRightFieldCornerY', oldValue);
  }

  @property({ attribute: 'bottom-right-field-corner-y' })
  get bottomRightFieldCornerY(): number {
    if (this.game === 'Custom') {
      return this._bottomRightFieldCornerY;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['bottom-right'][1]
      : this._bottomRightFieldCornerY;
  }

  static styles = fieldElementStyles;

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.resizeField();
      this.requestUpdate();
    }

    if (changedProperties.has('image') || changedProperties.has('game')) {
      const fieldImage = this.renderRoot.querySelector('[part=field-image]');
      (fieldImage as any).src = this.image;
      if (typeof this.imageObjects[this.image] === 'undefined') {
        const image = new Image();
        const imageObject = {
          src: this.image,
          width: 0,
          height: 0,
          loaded: false,
        };
        image.onload = () => {
          imageObject.loaded = true;
          imageObject.width = image.width;
          imageObject.height = image.height;
          this.resizeField();
          this.requestUpdate();
        };
        this.imageObjects[this.image] = imageObject;
        image.src = this.image;
      }
      this.resizeField();
      this.requestUpdate();
    }

    if (
      changedProperties.has('sourceKey') ||
      changedProperties.has('sourceProvider')
    ) {
      this.fieldObjectManager.setSource(this.sourceKey, this.sourceProvider);
    }

    this.setPlayingFieldWidthStyles();
  }

  private setPlayingFieldWidthStyles(): void {
    if (this.field) {
      const playingFieldImageRect = this.getPlayingFieldImageRect();
      this.field.style.setProperty(
        '--playing-field-width',
        `${playingFieldImageRect.width}px`
      );
      this.field.style.setProperty(
        '--playing-field-height',
        `${playingFieldImageRect.height}px`
      );
      this.field.style.setProperty(
        '--playing-field-left',
        `${playingFieldImageRect.left - 1}px`
      );
      this.field.style.setProperty(
        '--playing-field-top',
        `${playingFieldImageRect.top - 1}px`
      );
    }
  }

  setObjectPose(element: FieldObjectElement, fieldInfo: FieldInfo): void {
    const {
      unit: elementUnit,
      width: elementWidth,
      height: elementHeight,
      x: elementX,
      y: elementY,
      rot: rotation,
    } = element;
    const { toPx } = fieldInfo;
    // set element pose
    const unit =
      typeof (toBaseConversions as Record<string, number>)[elementUnit] !==
      'undefined'
        ? elementUnit
        : this.unit;
    const width = convert(elementWidth, unit, this.unit);
    const height = convert(elementHeight, unit, this.unit);
    const x = convert(elementX, unit, this.unit);
    const y = convert(elementY, unit, this.unit);

    element.style.width = `${toPx(width)}px`;
    element.style.height = `${toPx(height)}px`;

    const translateY = this.height - y - height / 2;

    const translateX = x - width / 2;

    const translateXPx = `${toPx(translateX) + fieldInfo.xOffset}px`;
    const translateYPx = `${toPx(translateY) + fieldInfo.yOffset}px`;
    const rotate = `rotate(${-rotation + 90}deg)`;

    element.style.transform = `translate(${translateXPx}, ${translateYPx}) ${rotate}`;
  }

  setDrawingPose(element: FieldObjectElement, fieldInfo: FieldInfo): void {
    const { ctx, canvas, bottomCtx, bottomCanvas, rect } = fieldInfo;
    const { unit: elementUnit, rot: rotation } = element;
    const unit =
      typeof (toBaseConversions as Record<string, number>)[elementUnit] !==
      'undefined'
        ? element.unit
        : this.unit;
    const x = convert(element.x, unit, this.unit);
    const y = convert(element.y, unit, this.unit);

    // set element pose
    ctx.save();
    bottomCtx.save();

    ctx.translate(fieldInfo.xOffset * 2, fieldInfo.yOffset * 2);
    bottomCtx.translate(fieldInfo.xOffset * 2, fieldInfo.yOffset * 2);

    const scale = (rect.width * 2) / this.width;
    ctx.scale(scale, scale);
    bottomCtx.scale(scale, scale);

    ctx.translate(x, this.height - y);
    bottomCtx.translate(x, this.height - y);

    ctx.rotate(((90 - rotation) * Math.PI) / 180);
    bottomCtx.rotate(((90 - rotation) * Math.PI) / 180);

    // flip y
    ctx.scale(1, -1);
    bottomCtx.scale(1, -1);

    // scale based on the units the drawing is in
    const unitScale = convert(1, unit, this.unit);
    ctx.scale(unitScale, unitScale);
    bottomCtx.scale(unitScale, unitScale);

    // This is to prevent previous drawings from affecting current drawing
    ctx.beginPath();
    bottomCtx.beginPath();

    (element as any).renderDrawing({
      canvas,
      ctx,
      bottomCanvas,
      bottomCtx,
      scalingFactor: (unitScale * scale) / 2,
    });

    ctx.restore();
    bottomCtx.restore();
  }

  firstUpdated(): void {
    this.field = this.renderRoot.querySelector('[part=field]') as HTMLElement;
    const canvas = this.renderRoot.querySelector(
      '[part=top-canvas]'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const bottomCanvas = this.renderRoot.querySelector(
      '[part=bottom-canvas]'
    ) as HTMLCanvasElement;
    const bottomCtx = bottomCanvas.getContext('2d') as CanvasRenderingContext2D;

    // update object positions and size
    const updateObjectsAndDrawings = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height);
      bottomCtx.beginPath();

      const playingFieldImageRect = this.getPlayingFieldImageRect();
      const xOffset = playingFieldImageRect.left;
      const yOffset = playingFieldImageRect.top;

      const fieldInfo: FieldInfo = {
        canvas,
        ctx,
        bottomCanvas,
        bottomCtx,
        rect: playingFieldImageRect,
        toPx: (length: number) =>
          (length * playingFieldImageRect.width) / this.width,
        toLength: (px: number) =>
          (px * this.width) / playingFieldImageRect.width,
        xOffset,
        yOffset,
      };

      [...this.children].forEach((child) => {
        if ((child.constructor as any).__IS_FIELD_OBJECT__) {
          this.setObjectPose(child as FieldObjectElement, fieldInfo);
          this.setDrawingPose(child as FieldObjectElement, fieldInfo);
        }
      });
      window.requestAnimationFrame(updateObjectsAndDrawings);
    };

    window.requestAnimationFrame(updateObjectsAndDrawings);

    const resizeObserver = new ResizeObserver(() => this.resized());
    resizeObserver.observe(this);

    if (this.store) {
      this.fieldObjectManager = new FieldObjectManager(this, this.store);
    }
  }

  private getImageObject(src: string): ImageObject {
    return (
      this.imageObjects[src] || {
        src,
        width: 0,
        height: 0,
        loaded: false,
      }
    );
  }

  private getPlayingFieldDimensions(): FieldDimensions {
    const imageObject = this.getImageObject(this.image);
    const dimensions = { x1: 0, y1: 0, x2: 0, y2: 0 };

    if (!imageObject.loaded) {
      dimensions.x1 = this.topLeftFieldCornerX || 0;
      dimensions.y1 = this.topLeftFieldCornerY || 0;
      dimensions.x2 = this.bottomRightFieldCornerX || this.width;
      dimensions.y2 =
        dimensions.y1 +
        ((dimensions.x2 - dimensions.x1) * this.height) / this.width;
    } else {
      dimensions.x1 = this.topLeftFieldCornerX || 0;
      dimensions.y1 = this.topLeftFieldCornerY || 0;
      dimensions.x2 = Math.min(
        this.bottomRightFieldCornerX || imageObject.width,
        imageObject.width
      );
      dimensions.y2 = Math.min(
        this.bottomRightFieldCornerY || imageObject.height,
        imageObject.height
      );
    }

    return dimensions;
  }

  private getPlayingFieldImageRect(): PlayingFieldImageRect {
    if (!this.fullFieldImageSize) {
      return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
    }

    const imageObject = this.getImageObject(this.image);
    const fieldDimensions = this.getPlayingFieldDimensions();
    const imageSize = {
      width: imageObject.loaded ? imageObject.width : fieldDimensions.x2,
      height: imageObject.loaded ? imageObject.height : fieldDimensions.y2,
    };

    const multiplier = this.fullFieldImageSize.width / imageSize.width;
    const left = fieldDimensions.x1 * multiplier;
    const right = fieldDimensions.x2 * multiplier;
    const top = fieldDimensions.y1 * multiplier;
    const bottom = fieldDimensions.y2 * multiplier;
    const width = right - left;
    const height = bottom - top;

    return { left, right, top, bottom, width, height };
  }

  private resizeField(): void {
    const fieldElement = this.renderRoot.querySelector(
      '[part=field]'
    ) as HTMLElement;
    const imageObject = this.getImageObject(this.image);
    const elementSize = this.getBoundingClientRect();
    const fieldDimensions = this.getPlayingFieldDimensions();

    const imageSize = {
      width: imageObject.loaded ? imageObject.width : fieldDimensions.x2,
      height: imageObject.loaded ? imageObject.height : fieldDimensions.y2,
    };

    const fieldHeight = !imageSize.width
      ? 0
      : (imageSize.height / imageSize.width) * elementSize.width;

    if (fieldHeight <= elementSize.height) {
      this.fullFieldImageSize = {
        width: elementSize.width,
        height: fieldHeight,
      };
    } else {
      const fieldWidth = !imageSize.height
        ? 0
        : (imageSize.width / imageSize.height) * elementSize.height;
      this.fullFieldImageSize = {
        width: fieldWidth,
        height: elementSize.height,
      };
    }

    fieldElement.style.setProperty(
      '--field-width',
      `${this.fullFieldImageSize.width}px`
    );
    fieldElement.style.setProperty(
      '--field-height',
      `${this.fullFieldImageSize.height}px`
    );
  }

  private resized(): void {
    this.resizeField();
    this.requestUpdate();
  }

  render(): TemplateResult {
    this.setPlayingFieldWidthStyles();
    const playFieldWidth = this.field
      ? parseFloat(
          this.field.style.getPropertyValue('--playing-field-width') || '0'
        )
      : 0;
    const { width, height } = this.field
      ? this.field.getBoundingClientRect()
      : { width: 0, height: 0 };
    const patternSize = (this.gridSize / this.width) * playFieldWidth;

    return html`
      <div part="field">
        <img part="field-image" />
        <div part="playing-field-area">
          ${this.showGrid && this.gridSize > 0
            ? html`
                <div part="grid">
                  ${svg`
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
                  <path d="M ${patternSize} 0 L 0 0 0 ${patternSize}" fill="none" />
                </pattern>
              </defs>
      
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            `}
                </div>
              `
            : ''}
        </div>
        <canvas
          part="bottom-canvas"
          width="${width * 2}"
          height="${height * 2}"
        ></canvas>
        <slot></slot>
        <canvas
          part="top-canvas"
          width="${width * 2}"
          height="${height * 2}"
        ></canvas>
      </div>
    `;
  }
}
