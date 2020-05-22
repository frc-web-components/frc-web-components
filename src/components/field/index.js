import { Webbit, html, svg, css } from '@webbitjs/webbit';
import { baseUnit, toBaseConversions, convert } from './units';
import './field-object';
import FieldDrawing from './field-drawing';
import './field-trajectory';
import './field-camera';
import './field-robot';


class Field extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 400px;
      }

      [part=field] {
        position: relative;
        width: 100%;
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
      width: { type: Number },
      height: { type: Number },
      image: { type: String },
      gridSize: { type: Number, attribute: 'grid-size' },
      hideGrid: { type: Boolean, attribute: 'hide-grid' },
      swapAxes: { type: Boolean, attribute: 'swap-axes' },
      unit: { type: String }
    };
  }

  constructor() {
    super();
    this.width = 20;
    this.height = 20;
    this.image = '';
    this.gridSize = 1;
    this.hideGrid = false;
    this.swapAxes = false;
    this.objectElements = [];
    this.drawingElements = [];
    this.unit = baseUnit;
  }

  updated(changedProperties) {
    if (changedProperties.has('width') || changedProperties.has('height')) {
      this.resizeField();
    }

    if (changedProperties.has('image')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field]');
      fieldElement.style.setProperty('--field-image', `url(${this.image}`);
    }
  }

  setElementPose(element, fieldInfo, parentInfo) {

    const { toPx, toLength, ctx, canvas, bottomCtx, bottomCanvas, rect } = fieldInfo;

    if (element.tagName === 'FRC-FIELD') {
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
      element.childNodes.forEach(childNode => {
        const { tagName, constructor } = childNode;
        if (tagName === 'FRC-FIELD-OBJECT' || constructor.__IS_FIELD_DRAWING__) {
          this.setElementPose(childNode, fieldInfo, elementInfo)
        }
      });
    } else if (element.tagName === 'FRC-FIELD-OBJECT') {
      // set element pose
      const {  rotation } = element;
      const width = convert(element.width, element.unit || parentInfo.unit, this.unit);
      const height = convert(element.height, element.unit || parentInfo.unit, this.unit);
      const x = convert(element.x, element.unit || parentInfo.unit, this.unit);
      const y = convert(element.y, element.unit || parentInfo.unit, this.unit);

      const widthPx = toPx(width);
      const heightPx = toPx(height);

      element.style.width = toPx(width);
      element.style.height = toPx(height);
      element.style.transformOrigin = parentInfo.isField ? 'center center' : 'auto auto';

      const translateY = parentInfo.isField
        ? (y - width / 2)
        : (x + parentInfo.width / 2 - width / 2);

      const translateX = parentInfo.isField
        ? (x - height / 2)
        : (-y - height / 2 + parentInfo.height / 2);

      element.style.transform = `translate(${toPx(translateY)}px, ${toPx(translateX)}px) rotate(${-rotation + (parentInfo.isField ? 90 : 0)}deg)`;

      // construct parent info for children
      let transformations = parentInfo.transformations;

      if (parentInfo.isField) {
        transformations = transformations.concat([
          { type: 'translation', x: y, y: x },
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
        const { tagName, constructor } = childNode;
        if (tagName === 'FRC-FIELD-OBJECT' || constructor.__IS_FIELD_DRAWING__) {
          this.setElementPose(childNode, fieldInfo, elementInfo)
        }
      });

    } else if (element.constructor.__IS_FIELD_DRAWING__) {
      // set element pose
      ctx.save();
      bottomCtx.save();

      const scale = rect.width * 2 / this.width;
      ctx.scale(scale, scale);
      bottomCtx.scale(scale, scale);

      // transform
      if (parentInfo.transformations.length === 0) {
        parentInfo.transformations.push({ type: 'rotation', rotation: 90 }); 
      }

      parentInfo.transformations.forEach(({ type, x, y, rotation }) => {
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
        source: element.getSource() || {},
        parentWidth: parentInfo.width / unitScale,
        parentHeight: parentInfo.height / unitScale
      });
      
      ctx.restore();
      bottomCtx.restore();
    }
  }

  firstUpdated() {

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

      const rect = this.getBoundingClientRect();
      this.setElementPose(this, {
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
      const { width } = this.getBoundingClientRect();
      const fieldElement = this.shadowRoot.querySelector('[part=field]');
      const height = !this.width ? 0 : (this.height / this.width) * width;
      fieldElement.style.setProperty('--field-height', `${height}px`);
  }

  resized() {
    this.resizeField();
    this.requestUpdate();
  }

  render() {
    
    const { width, height } = this.getBoundingClientRect();
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