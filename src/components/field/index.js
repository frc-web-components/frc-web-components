import { Webbit, html, svg, css } from '@webbitjs/webbit';
import { baseUnit, toBaseConversions, convert } from './units';
import './field-object';
import './field-trajectory';
import './field-camera';
import './field-robot';

const fieldConfig = [
  {
    label: '2018 Field',
    image: 'https://rawcdn.githack.com/frc-web-components/frc-web-components/c33169e74cc12943d310f18c05d0d2495bed54df/field-images/2018-field.jpg',
    size: { width: 54, height: 27, unit: 'ft' },
  },
  {
    label: '2019 Field',
    image: 'https://rawcdn.githack.com/frc-web-components/frc-web-components/c33169e74cc12943d310f18c05d0d2495bed54df/field-images/2019-field.jpg',
    size: { width: 54, height: 27, unit: 'ft' },
  },
  {
    label: '2020 Field',
    image: 'https://rawcdn.githack.com/frc-web-components/frc-web-components/c33169e74cc12943d310f18c05d0d2495bed54df/field-images/2020-field.png',
    size: { width: 52.4375, height: 26.9375, unit: 'ft' },
  },
]

class Field extends Webbit {

  static get metadata() {
    return {
      displayName: 'Field',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      allowedChildren: ['frc-field-object', 'frc-field-camera', 'frc-field-drawing', 'frc-field-trajectory', 'frc-field-robot'],

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
      width: { 
        type: Number,
        get() {
          const config = fieldConfig.find(field => field.label === this._image);
          return config && this._useFieldConfig ? config.size.width : this._width;
        }
      },
      height: { 
        type: Number,
        get() {
          const config = fieldConfig.find(field => field.label === this._image);
          return config && this._useFieldConfig ? config.size.height : this._height;
        }
      },
      unit: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        },
        get() {
          const config = fieldConfig.find(field => field.label === this._image);
          return config && this._useFieldConfig ? config.size.unit : this._unit;
        }
      },
      image: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return fieldConfig.map(field => field.label);
        },
        get() {
          const config = fieldConfig.find(field => field.label === this._image);
          return config ? config.image : this._image;
        },
        set(image) {
          const config = fieldConfig.find(field => field.image === image);
          return config ? config.label : image;
        }
      },
      useFieldConfig: { type: Boolean },
      gridSize: { type: Number },
      hideGrid: { type: Boolean },
      swapAxes: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.width = 54;
    this.height = 27;
    this.image = '';
    this.useFieldConfig = false;
    this.gridSize = 1;
    this.hideGrid = false;
    this.swapAxes = false;
    this.objectElements = [];
    this.unit = baseUnit;
  }

  updated(changedProperties) {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.resizeField();
    }

    if (changedProperties.has('image') || changedProperties.has('useFieldConfig')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field]');
      fieldElement.style.setProperty('--field-image', `url(${this.image}`);
      this.resizeField();
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
    this.childNodes.forEach(childNode => {
      this.setObjectPose(childNode, fieldInfo, elementInfo);
      this.setDrawingPose(childNode, fieldInfo, elementInfo);
    });
  }

  setObjectPose(element, fieldInfo, parentInfo) {
    const { toPx } = fieldInfo;
    // set element pose
    const rotation = element.rot;
    const width = convert(element.width, element.unit || parentInfo.unit, this.unit);
    const height = convert(element.height, element.unit || parentInfo.unit, this.unit);
    const x = convert(element.x, element.unit || parentInfo.unit, this.unit);
    const y = convert(element.y, element.unit || parentInfo.unit, this.unit);

    element.style.width = `${toPx(width)}px`;
    element.style.height = `${toPx(height)}px`;
    // element.style.transformOrigin = parentInfo.isField ? 'center center' : 'auto auto';

    const translateY = parentInfo.isField
      ? (parentInfo.height - y - height / 2)
      : (-y + parentInfo.height / 2 - height / 2);

    const translateX = parentInfo.isField
      ? (x - width / 2)
      : (x - width / 2 + parentInfo.width / 2);

    element.style.transform = `translate(${toPx(translateX)}px, ${toPx(translateY)}px) rotate(${-rotation + (parentInfo.isField ? 90 : 0)}deg)`;

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
      unit: element.unit || parentInfo.unit
    };

    // set child poses relative to parent
    element.childNodes.forEach(childNode => {
      this.setObjectPose(childNode, fieldInfo, elementInfo);
      this.setDrawingPose(childNode, fieldInfo, elementInfo);
    });
  }

  setDrawingPose(element, fieldInfo, parentInfo) {

    const { ctx, canvas, bottomCtx, bottomCanvas, rect } = fieldInfo;

    const rotation = element.rot;
    const height = convert(element.height, element.unit || parentInfo.unit, this.unit);
    const x = convert(element.x, element.unit || parentInfo.unit, this.unit);
    const y = convert(element.y, element.unit || parentInfo.unit, this.unit);

    // set element pose
    ctx.save();
    bottomCtx.save();

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
    const unitScale = convert(1, element.unit || parentInfo.unit, this.unit);
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
      source: element.getSource() || {}
    });
    
    ctx.restore();
    bottomCtx.restore();
  }

  firstUpdated() {
    super.firstUpdated();

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
      this.setFieldPose({
        canvas,
        ctx,
        bottomCanvas,
        bottomCtx,
        rect,
        toPx: (length) => length * rect.width / this.width,
        toLength: (px) => px * this.width / rect.width,
      });
      window.requestAnimationFrame(updateObjectsAndDrawings);
    };

    window.requestAnimationFrame(updateObjectsAndDrawings);
  }

  resizeField() {
      const { width, height } = this.getBoundingClientRect();
      const fieldElement = this.shadowRoot.querySelector('[part=field]');
      const fieldHeight = !this.width ? 0 : (this.height / this.width) * width;

      if (fieldHeight <= height) {
        fieldElement.style.setProperty('--field-width', `${width}px`);
        fieldElement.style.setProperty('--field-height', `${fieldHeight}px`);
      } else {
        const fieldWidth = !this.height ? 0 : (this.width / this.height) * height;
        fieldElement.style.setProperty('--field-width', `${fieldWidth}px`);
        fieldElement.style.setProperty('--field-height', `${height}px`);
      }
  }

  resized() {
    this.resizeField();
    this.requestUpdate();
  }

  render() {
    
    const { width, height } = this.field ? this.field.getBoundingClientRect() : { width: 0, height: 0 };
    const patternSize = (this.gridSize / this.width) * width;

    return html`   
      <div part="field">
        ${!this.hideGrid && this.gridSize > 0 ? html`
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
        <canvas part="bottom-canvas" width="${width * 2}" height="${height * 2}"></canvas>
        <slot></slot>
        <canvas part="top-canvas" width="${width * 2}" height="${height * 2}"></canvas>
      </div>
    `;
  }
}

webbitRegistry.define('frc-field', Field);