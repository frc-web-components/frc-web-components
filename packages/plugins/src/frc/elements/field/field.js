import { html, css, svg, LitElement } from 'lit';
import { baseUnit, toBaseConversions, convert, unitAliases } from './units';
import fieldConfig from './field-config';

export const elementName = 'frc-field';

export const elementConfig = {
  dashboard: {
    displayName: 'Field',
  },
  properties: {
    game: {
      type: String,
      defaultValue: 'Rapid React',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return fieldConfig.map((field) => field.game).concat('Custom');
        },
      },
    },
    width: {
      type: Number,
      defaultValue: 54,
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    height: {
      type: Number,
      defaultValue: 27,
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    unit: {
      type: String,
      defaultValue: baseUnit,
      input: {
        type: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    image: {
      type: String,
      input: {
        type: 'StringDropdown',
        defaultValue: fieldConfig[0]['field-image'],
        enableUpload: true,
        getOptions() {
          return fieldConfig.map((field) => field['field-image']);
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    topLeftFieldCornerX: {
      type: Number,
      attribute: 'top-left-field-corner-x',
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    topLeftFieldCornerY: {
      type: Number,
      attribute: 'top-left-field-corner-y',
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    bottomRightFieldCornerX: {
      type: Number,
      attribute: 'bottom-right-field-corner-x',
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    bottomRightFieldCornerY: {
      type: Number,
      attribute: 'bottom-right-field-corner-y',
      input: {
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
    },
    gridSize: { type: Number, attribute: 'grid-size', defaultValue: 1 },
    showGrid: { type: Boolean, attribute: 'show-grid' },
    swapAxes: { type: Boolean, attribute: 'swap-axes' },
  },
  slots: [
    {
      name: '',
      allowedChildren: [
        'frc-field-camera',
        'frc-field-robot',
        'frc-field-trajectory',
        'frc-field-object',
      ],
    },
  ],
  demos: [
    {
      html: `
      <frc-field>
        <frc-field-robot source-key="/SmartDashboard/Field/Robot"></frc-field-robot>
        <frc-field-trajectory source-key="/SmartDashboard/Field/traj"></frc-field-trajectory>
      </frc-field>
    `,
    },
  ],
};

class Field extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 400px;
      overflow: hidden;
    }

    [part='field'] {
      position: relative;
      width: var(--field-width, 100%);
      height: var(--field-height, 400px);
      background-image: var(--field-image);
      background-size: cover;
    }

    [part='field-image'] {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    [part='playing-field-area'] {
      position: absolute;
      left: var(--playing-field-left, 0);
      top: var(--playing-field-top, 0);
      width: var(--playing-field-width, 100%);
      height: var(--playing-field-height, 100%);
      border: 2px solid yellow;
      box-sizing: border-box;
    }

    [part='grid'] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    [part='grid'] path {
      stroke: var(--frc-grid-line-color, gray);
      stroke-width: var(--frc-grid-line-width, 1);
    }

    [part='top-canvas'],
    [part='bottom-canvas'] {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    ::slotted(frc-field-object) {
      position: absolute;
    }

    /* [part=field] frc-field-object {
      position: absolute;
    } */
  `;

  constructor() {
    super();
    this.objectElements = [];
    this.imageObjects = {};
    this.fullFieldImageSize = null;

    // default props
    this.game = 'Rapid React';
    this._width = 54;
    this._height = 27;
    this._unit = baseUnit;
    this._image = fieldConfig[0]['field-image'];
    this._topLeftFieldCornerX = 0;
    this._topLeftFieldCornerY = 0;
    this._bottomRightFieldCornerX = 0;
    this._bottomRightFieldCornerY = 0;
    this.gridSize = 1;
    this.showGrid = false;
    this.swapAxes = false;
  }

  get width() {
    if (this.game === 'Custom') {
      return this._width;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-size'][0] : this._width;
  }

  set width(value) {
    const oldValue = this._width;
    this._width = value;
    this.requestUpdate('width', oldValue);
  }

  get height() {
    if (this.game === 'Custom') {
      return this._height;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-size'][1] : this._height;
  }

  set height(value) {
    const oldValue = this._height;
    this._height = value;
    this.requestUpdate('height', oldValue);
  }

  get unit() {
    if (this.game === 'Custom') {
      return unitAliases[this._unit];
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? unitAliases[config['field-unit']] : unitAliases[this._unit];
  }

  set unit(value) {
    const oldValue = this._unit;
    this._unit = value;
    this.requestUpdate('unit', oldValue);
  }

  get image() {
    if (this.game === 'Custom') {
      return this._image;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config ? config['field-image'] : this._image;
  }

  set image(value) {
    const oldValue = this._image;
    this._image = value;
    this.requestUpdate('image', oldValue);
  }

  get topLeftFieldCornerX() {
    if (this.game === 'Custom') {
      return this._topLeftFieldCornerX;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['top-left'][0]
      : this._topLeftFieldCornerX;
  }

  set topLeftFieldCornerX(value) {
    const oldValue = this._topLeftFieldCornerX;
    this._topLeftFieldCornerX = value;
    this.requestUpdate('topLeftFieldCornerX', oldValue);
  }

  get topLeftFieldCornerY() {
    if (this.game === 'Custom') {
      return this._topLeftFieldCornerY;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['top-left'][1]
      : this._topLeftFieldCornerY;
  }

  set topLeftFieldCornerY(value) {
    const oldValue = this._topLeftFieldCornerY;
    this._topLeftFieldCornerY = value;
    this.requestUpdate('topLeftFieldCornerY', oldValue);
  }

  get bottomRightFieldCornerX() {
    if (this.game === 'Custom') {
      return this._bottomRightFieldCornerX;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['bottom-right'][0]
      : this._bottomRightFieldCornerX;
  }

  set bottomRightFieldCornerX(value) {
    const oldValue = this._bottomRightFieldCornerX;
    this._bottomRightFieldCornerX = value;
    this.requestUpdate('bottomRightFieldCornerX', oldValue);
  }

  get bottomRightFieldCornerY() {
    if (this.game === 'Custom') {
      return this._bottomRightFieldCornerY;
    }
    const config = fieldConfig.find((field) => field.game === this.game);
    return config
      ? config['field-corners']['bottom-right'][1]
      : this._bottomRightFieldCornerY;
  }

  set bottomRightFieldCornerY(value) {
    const oldValue = this._bottomRightFieldCornerY;
    this._bottomRightFieldCornerY = value;
    this.requestUpdate('bottomRightFieldCornerY', oldValue);
  }

  updated(changedProperties) {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.resizeField();
      this.requestUpdate();
    }

    if (changedProperties.has('image') || changedProperties.has('game')) {
      const fieldImage = this.shadowRoot.querySelector('[part=field-image]');
      fieldImage.src = this.image;
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

    this.setPlayingFieldWidthStyles();
  }

  setPlayingFieldWidthStyles() {
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

  setFieldPose(fieldInfo) {
    [...this.children].forEach((child) => {
      if (child.constructor.__IS_FIELD_OBJECT__) {
        this.setObjectPose(child, fieldInfo);
        this.setDrawingPose(child, fieldInfo);
      }
    });
  }

  setObjectPose(element, fieldInfo, parentInfo) {
    const { toPx } = fieldInfo;
    // set element pose
    const rotation = element.rot;
    const unit =
      typeof toBaseConversions[element.unit] !== 'undefined'
        ? element.unit
        : this.unit;
    const width = convert(element.width, unit, this.unit);
    const height = convert(element.height, unit, this.unit);
    const x = convert(element.x, unit, this.unit);
    const y = convert(element.y, unit, this.unit);

    element.style.width = `${toPx(width)}px`;
    element.style.height = `${toPx(height)}px`;

    const translateY = this.height - y - height / 2;

    const translateX = x - width / 2;

    const translateXPx = `${toPx(translateX) + fieldInfo.xOffset}px`;
    const translateYPx = `${toPx(translateY) + fieldInfo.yOffset}px`;
    const rotate = `rotate(${-rotation + 90}deg)`;

    element.style.transform = `translate(${translateXPx}, ${translateYPx}) ${rotate}`;
  }

  setDrawingPose(element, fieldInfo) {
    const { ctx, canvas, bottomCtx, bottomCanvas, rect } = fieldInfo;

    const rotation = element.rot;
    const unit =
      typeof toBaseConversions[element.unit] !== 'undefined'
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

    element.renderDrawing({
      canvas,
      ctx,
      bottomCanvas,
      bottomCtx,
      scalingFactor: (unitScale * scale) / 2,
    });

    ctx.restore();
    bottomCtx.restore();
  }

  firstUpdated() {
    this.field = this.shadowRoot.querySelector('[part=field]');
    const field = this.field;
    const canvas = this.shadowRoot.querySelector('[part=top-canvas]');
    const ctx = canvas.getContext('2d');

    const bottomCanvas = this.shadowRoot.querySelector('[part=bottom-canvas]');
    const bottomCtx = bottomCanvas.getContext('2d');

    // update object positions and size
    const updateObjectsAndDrawings = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height);
      bottomCtx.beginPath();
      const rect = field.getBoundingClientRect();

      const playingFieldImageRect = this.getPlayingFieldImageRect();
      const xOffset = playingFieldImageRect.left;
      const yOffset = playingFieldImageRect.top;

      this.setFieldPose({
        canvas,
        ctx,
        bottomCanvas,
        bottomCtx,
        rect: playingFieldImageRect,
        toPx: (length) => (length * playingFieldImageRect.width) / this.width,
        toLength: (px) => (px * this.width) / playingFieldImageRect.width,
        xOffset,
        yOffset,
      });
      window.requestAnimationFrame(updateObjectsAndDrawings);
    };

    window.requestAnimationFrame(updateObjectsAndDrawings);

    const resizeObserver = new ResizeObserver(() => this.resized());
    resizeObserver.observe(this);
  }

  getImageObject(src) {
    return (
      this.imageObjects[src] || {
        src,
        width: 0,
        height: 0,
        loaded: false,
      }
    );
  }

  getPlayingFieldDimensions() {
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

  getPlayingFieldImageRect() {
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

  resizeField() {
    const fieldElement = this.shadowRoot.querySelector('[part=field]');
    const imageObject = this.getImageObject(this.image);
    const elementSize = this.getBoundingClientRect();
    const fieldDimensions = this.getPlayingFieldDimensions();

    let imageSize = {
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

  resized() {
    this.resizeField();
    this.requestUpdate();
  }

  render() {
    this.setPlayingFieldWidthStyles();
    const playFieldWidth = this.field
      ? parseFloat(
          this.field.style.getPropertyValue('--playing-field-width') || 0
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

customElements.define(elementName, Field);
