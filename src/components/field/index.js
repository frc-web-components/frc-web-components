import { Webbit, html, svg, css } from '@webbitjs/webbit';

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
      hideGrid: { type: Boolean, attribute: 'hide-grid' }
    };
  }

  constructor() {
    super();
    this.width = 20;
    this.height = 20;
    this.image = '';
    this.gridSize = 1;
    this.hideGrid = false;
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

  getAxisPositions(length) {
    const positions = [];
    for (let position = 0; position < length; position += this.gridSize) {
      positions.push(position);
    }
    return positions;
  }

  render() {
    
    const { width } = this.getBoundingClientRect();
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
        <slot></slot>
      </div>
    `;
  }
}

webbitRegistry.define('frc-field', Field);