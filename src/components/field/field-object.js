import { Webbit, html, css } from '@webbitjs/webbit';
import { toBaseConversions } from './units';

export default class FieldObject extends Webbit {

  static get metadata() {
    return {
      displayName: 'Field Object',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      allowedParents: ['frc-field-object', 'frc-field'],
      allowedChildren: ['frc-field-object', 'frc-field-camera'],
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        position: relative;
      }

      [part=field-object] {
        width: 100%;
        height: 100%;
        background-image: var(--field-object-image);
        background-size: cover;
      }
    `;
  }

  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number },
      rot: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { 
        type: String,
        inputType: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        }
      },
      image: { type: String },
      draw: { 
        type: Function,
        converter: (value) => {
          return typeof value === 'function' ? value : eval(value);
        }
      },
    };
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.width = 1;
    this.height = 1;
    this.image = '';
    this.unit = '';
    this.draw = () => {};
  }

  updated(changedProperties) {
    if (changedProperties.has('image')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field-object]');
      fieldElement.style.setProperty('--field-object-image', `url(${this.image}`);
    }
  }

  resized() {
    this.requestUpdate();
  }


  render() {
    return html`   
      <div part="field-object">
        <slot></slot>
      </div>
    `;
  }

  renderDrawing(args) {
    this.draw.bind(args)();
  }
}

webbitRegistry.define('frc-field-object', FieldObject);