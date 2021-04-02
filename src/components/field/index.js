import { html, css, svg } from 'lit-element';
import { Webbit, define } from '../../webbit';
import { baseUnit, toBaseConversions, convert, unitAliases } from './units';
import './field-object';
import './field-trajectory';
import './field-camera';
import './field-robot';


const fieldConfig = [
  {
    "game" : "Infinite Recharge",
    "field-image" : "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2020-Field.png",
    "field-corners": {
        "top-left" : [96, 25],
        "bottom-right" : [1040, 514]
    },
    "field-size" : [52.4375, 26.9375],
    "field-unit" : "foot"
  },
  {
    "game" : "Destination: Deep Space",
    "field-image" : "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2019-field.jpg",
    "field-corners": {
      "top-left" : [217, 40],
      "bottom-right" : [1372, 615]
    },
    "field-size" : [54, 27],
    "field-unit" : "foot"
  },
  {
    "game": "FIRST Power Up",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2018-field.jpg",
    "field-corners": {
      "top-left": [125, 20],
      "bottom-right": [827, 370]
    },
    "field-size": [54, 27],
    "field-unit": "feet"
  },
  {
    "game": "Barrel Racing Path",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2021-barrel.png",
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400]
    },
    "field-size": [30, 15],
    "field-unit": "feet"
  },
  {
    "game": "Bounce Path",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2021-bounce.png",
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400]
    },
    "field-size": [30, 15],
    "field-unit": "feet"
  },
  {
    "game": "Galactic Search A",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2021-galacticsearcha.png",
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400]
    },
    "field-size": [30, 15],
    "field-unit": "feet"
  },
  {
    "game": "Galactic Search B",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2021-galacticsearchb.png",
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400]
    },
    "field-size": [30, 15],
    "field-unit": "feet"
  },
  {
    "game": "Slalom Path",
    "field-image": "https://rawcdn.githack.com/wpilibsuite/PathWeaver/036ca81bfc58eeeba047ec469edc54f33831a4c4/src/main/resources/edu/wpi/first/pathweaver/2021-slalom.png",
    "field-corners": {
      "top-left": [20, 20],
      "bottom-right": [780, 400]
    },
    "field-size": [30, 15],
    "field-unit": "feet"
  }
]

class Field extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Field',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      allowedChildren: ['frc-field-object', 'frc-field-camera', 'frc-field-trajectory', 'frc-field-robot'],
      dashboardHtml: `
        <frc-field game="Infinite Recharge">
          <frc-field-robot></frc-field-robot>
        </frc-field>
      `
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 400px;
      }

      [part=field] {
        position: relative;
        width: var(--field-width, 100%);
        height: var(--field-height, 400px);
        background-image: var(--field-image);
        background-size: cover;
      }

      [part=playing-field-area] {
        position: absolute;
        left: var(--playing-field-left, 0);
        top: var(--playing-field-top, 0);
        width: var(--playing-field-width, 100%);
        height: var(--playing-field-height, 100%);
        border: 2px solid yellow;
        box-sizing: border-box;
      }

      [part=grid] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      [part=grid] path {
        stroke: var(--frc-grid-line-color, gray);
        stroke-width: var(--frc-grid-line-width, 1);
      }

      [part=top-canvas], [part=bottom-canvas] {
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
  }

  static get properties() {
    return {
      game: {
        type: String,
        defaultValue: 'FIRST Power Up',
        inputType: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return fieldConfig.map(field => field.game).concat('Custom');
        },
      },
      width: { 
        type: Number,
        defaultValue: 54,
        get() {
          if (this._game === 'Custom') {
            return this._width;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-size'][0] : this._width;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      height: { 
        type: Number,
        defaultValue: 27,
        get() {
          if (this._game === 'Custom') {
            return this._height;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-size'][1] : this._height;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      unit: { 
        type: String,
        defaultValue: baseUnit,
        inputType: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
        get() {
          if (this._game === 'Custom') {
            return unitAliases[this._unit];
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-unit'] : unitAliases[this._unit];
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      image: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return fieldConfig.map(field => field['field-image']);
        },
        get() {
          if (this._game === 'Custom') {
            return this._image;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-image'] : this._image;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        },
      },
      topLeftFieldCornerX: {
        type: Number,
        get() {
          if (this._game === 'Custom') {
            return this._topLeftFieldCornerX;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-corners']['top-left'][0] : this._topLeftFieldCornerX;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      topLeftFieldCornerY: {
        type: Number,
        get() {
          if (this._game === 'Custom') {
            return this._topLeftFieldCornerY;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-corners']['top-left'][1] : this._topLeftFieldCornerY;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      bottomRightFieldCornerX: {
        type: Number,
        get() {
          if (this._game === 'Custom') {
            return this._bottomRightFieldCornerX;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-corners']['bottom-right'][0] : this._bottomRightFieldCornerX;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      bottomRightFieldCornerY: {
        type: Number,
        get() {
          if (this._game === 'Custom') {
            return this._bottomRightFieldCornerY;
          } 
          const config = fieldConfig.find(field => field.game === this._game);
          return config ? config['field-corners']['bottom-right'][1] : this._bottomRightFieldCornerY;
        },
        isDisabled({ game }) {
          return game !== 'Custom';
        }
      },
      gridSize: { type: Number, defaultValue: 1 },
      showGrid: { type: Boolean },
      swapAxes: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.objectElements = [];
    this.imageObjects = {};
    this.fullFieldImageSize = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.resizeField();
      this.requestUpdate();

    }

    if (changedProperties.has('image') || changedProperties.has('game')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field]');
      fieldElement.style.setProperty('--field-image', `url(${this.image}`);
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
      this.field.style.setProperty('--playing-field-width', `${playingFieldImageRect.width}px`);
      this.field.style.setProperty('--playing-field-height', `${playingFieldImageRect.height}px`);
      this.field.style.setProperty('--playing-field-left', `${playingFieldImageRect.left - 1}px`);
      this.field.style.setProperty('--playing-field-top', `${playingFieldImageRect.top - 1}px`);
    }
  }

  setFieldPose(fieldInfo) {

    // construct info for children
    const elementInfo = {
      transformations: [],
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      rotation: 0,
      isField: true,
      unit: this.unit,
    };

    // set child poses relative to parent
    [...this.children].forEach(child => {
      if (child.constructor.__IS_FIELD_OBJECT__) {
        this.setObjectPose(child, fieldInfo, elementInfo);
        this.setDrawingPose(child, fieldInfo, elementInfo);
      }
    });
  }

  setObjectPose(element, fieldInfo, parentInfo) {
    const { toPx } = fieldInfo;
    // set element pose
    const rotation = element.rot;
    const unit = typeof toBaseConversions[element.unit] !== 'undefined' ? element.unit : parentInfo.unit;
    const width = convert(element.width, unit, this.unit);
    const height = convert(element.height, unit, this.unit);
    const x = convert(element.x, unit, this.unit);
    const y = convert(element.y, unit, this.unit);

    element.style.width = `${toPx(width)}px`;
    element.style.height = `${toPx(height)}px`;
    // element.style.transformOrigin = parentInfo.isField ? 'center center' : 'auto auto';

    const translateY = parentInfo.isField
      ? (parentInfo.height - y - height / 2)
      : (-y + parentInfo.height / 2 - height / 2);

    const translateX = parentInfo.isField
      ? (x - width / 2)
      : (x - width / 2 + parentInfo.width / 2);

    const translateXPx = `${toPx(translateX) + (parentInfo.isField ? fieldInfo.xOffset : 0)}px`;
    const translateYPx = `${toPx(translateY) + (parentInfo.isField ? fieldInfo.yOffset : 0)}px`;
    // const translateYPx = `${toPx(parentInfo.height - y - height / 2 )}px`;
    const rotate = `rotate(${-rotation + (parentInfo.isField ? 90 : 0)}deg)`;
    // const rotate =  `rotate(0deg)`;

    element.style.transform = `translate(${translateXPx}, ${translateYPx}) ${rotate}`;

    // construct parent info for children
    let transformations = parentInfo.transformations;

    if (parentInfo.isField) {
      transformations = transformations.concat([
        { type: 'translation', x: x, y: this.height - y },
        { type: 'rotation', rotation: 90 - rotation },
      ]);
    } else {
      transformations = transformations.concat([
        { type: 'translation', x, y: -y },
        { type: 'rotation', rotation: -rotation },
      ]);
    }

    const elementInfo = {
      transformations,
      x,
      y,
      width,
      height,
      rotation,
      unit
    };

    // set child poses relative to parent
    [...element.children].forEach(child => {
      if (child.__IS_FIELD_OBJECT__) {
        this.setObjectPose(child, fieldInfo, elementInfo);
        this.setDrawingPose(child, fieldInfo, elementInfo);
      }
    });
  }

  setDrawingPose(element, fieldInfo, parentInfo) {

    const { ctx, canvas, bottomCtx, bottomCanvas, rect } = fieldInfo;

    const rotation = element.rot;
    const unit = typeof toBaseConversions[element.unit] !== 'undefined' ? element.unit : parentInfo.unit;
    const x = convert(element.x, unit, this.unit);
    const y = convert(element.y, unit, this.unit);

    // set element pose
    ctx.save();
    bottomCtx.save();

    ctx.translate(fieldInfo.xOffset * 2, fieldInfo.yOffset * 2);
    bottomCtx.translate(fieldInfo.xOffset * 2, fieldInfo.yOffset * 2);


    const scale = rect.width * 2 / this.width;
    ctx.scale(scale, scale);
    bottomCtx.scale(scale, scale);

    let transformations = [...parentInfo.transformations];

    // transform
    if (transformations.length === 0) {
      transformations = transformations.concat([
        { type: 'translation', x, y: parentInfo.height - y },
        { type: 'rotation', rotation: 90 - rotation }
      ])
    } else {
      transformations = transformations.concat([
        { type: 'translation', x, y: -y },
        { type: 'rotation', rotation: -rotation },
      ]);
    }

    transformations.forEach(({ type, x, y, rotation }) => {
      if (type === 'translation') {
        ctx.translate(x, y);
        bottomCtx.translate(x, y);
      } else {
        ctx.rotate(rotation * Math.PI / 180);
        bottomCtx.rotate(rotation * Math.PI / 180);
      }
    });

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
      scalingFactor: unitScale * scale / 2, 
    });
    
    ctx.restore();
    bottomCtx.restore();
  }

  firstUpdated() {

    this.field = this.shadowRoot.querySelector('[part=field]');;
    const field = this.field;
    const canvas = this.shadowRoot.querySelector('[part=top-canvas]');
    const ctx = canvas.getContext("2d");

    const bottomCanvas = this.shadowRoot.querySelector('[part=bottom-canvas]');
    const bottomCtx = bottomCanvas.getContext("2d");
    
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
        toPx: (length) => length * playingFieldImageRect.width / this.width,
        toLength: (px) => px * this.width / playingFieldImageRect.width,
        xOffset,
        yOffset,
      });
      window.requestAnimationFrame(updateObjectsAndDrawings);
    };

    window.requestAnimationFrame(updateObjectsAndDrawings);
  }

  getImageObject(src) {
    return this.imageObjects[src] || {
      src,
      width: 0,
      height: 0,
      loaded: false,
    };
  }

  getPlayingFieldDimensions() {
    const imageObject = this.getImageObject(this.image);
    const dimensions = { x1: 0, y1: 0, x2: 0, y2: 0 };

    if (!imageObject.loaded) {
      dimensions.x1 = this.topLeftFieldCornerX || 0;
      dimensions.y1 = this.topLeftFieldCornerY || 0;
      dimensions.x2 = this.bottomRightFieldCornerX || this.width;
      dimensions.y2 = dimensions.y1 + (dimensions.x2 - dimensions.x1) * this.height / this.width;
    } else {
      dimensions.x1 = this.topLeftFieldCornerX || 0;
      dimensions.y1 = this.topLeftFieldCornerY || 0;
      dimensions.x2 = Math.min(this.bottomRightFieldCornerX || imageObject.width, imageObject.width);
      dimensions.y2 = Math.min(this.bottomRightFieldCornerY || imageObject.height, imageObject.height);
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
      height: imageObject.loaded ? imageObject.height : fieldDimensions.y2
    };

    const multiplier =  this.fullFieldImageSize.width / imageSize.width;
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
      height: imageObject.loaded ? imageObject.height : fieldDimensions.y2
    };

    const fieldHeight = !imageSize.width ? 0 : (imageSize.height / imageSize.width) * elementSize.width;

    if (fieldHeight <= elementSize.height) {
      this.fullFieldImageSize = { width: elementSize.width, height: fieldHeight };
    } else {
      const fieldWidth = !imageSize.height ? 0 : (imageSize.width / imageSize.height) * elementSize.height;
      this.fullFieldImageSize = { width: fieldWidth, height: elementSize.height };
    }

    fieldElement.style.setProperty('--field-width', `${this.fullFieldImageSize.width}px`);
    fieldElement.style.setProperty('--field-height', `${this.fullFieldImageSize.height}px`);
  }

  resized() {
    this.resizeField();
    this.requestUpdate();
  }

  render() {
    
    this.setPlayingFieldWidthStyles();
    const playFieldWidth =  this.field ? parseFloat(this.field.style.getPropertyValue('--playing-field-width') || 0) : 0;
    const { width, height } = this.field ? this.field.getBoundingClientRect() : { width: 0, height: 0 };
    const patternSize = (this.gridSize / this.width) * playFieldWidth;

    console.log('playing field width:', playFieldWidth);

    return html`   
      <div part="field">
        <div part="playing-field-area">
          ${this.showGrid && this.gridSize > 0 ? html`
            <div part="grid">
              ${svg`
                <svg width="100%" height="100%">
                  <defs>
                    <pattern 
                      id="grid" 
                      width="${patternSize}" 
                      height="${patternSize}" 
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M ${patternSize} 0 L 0 0 0 ${patternSize}" fill="none" />
                    </pattern>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              `}
            </div>
          ` : ''}
        </div>
        <canvas part="bottom-canvas" width="${width * 2}" height="${height * 2}"></canvas>
        <slot></slot>
        <canvas part="top-canvas" width="${width * 2}" height="${height * 2}"></canvas>
      </div>
    `;
  }
}

define('frc-field', Field);