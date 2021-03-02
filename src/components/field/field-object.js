import { Webbit, html, css } from '@webbitjs/webbit';
import { toBaseConversions } from './units';

export default class FieldObject extends Webbit {

  static get __IS_FIELD_OBJECT__() {
    return true;
  }

  static get dashboardConfig() {
    return {
      displayName: 'Field Object',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      allowedParents: ['frc-field-object', 'frc-field', 'frc-field-robot'],
      allowedChildren: ['frc-field-object', 'frc-field-camera'],
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        position: absolute;
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
          return ['inherit', ...Object.keys(toBaseConversions)];
        }
      },
      image: { type: String },
      draw: { type: String, inputType: 'Function' },
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
    this.unit = 'inherit';
    this.draw = '';
    this.drawFunction = new Function();
  }

  updated(changedProperties) {
    if (changedProperties.has('image')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field-object]');
      fieldElement.style.setProperty('--field-object-image', `url(${this.image}`);
    }

    if (changedProperties.has('draw')) {
      this.drawFunction = new Function(this.draw);
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
    try {
      this.drawFunction.bind({
        ...args,
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
        rot: this.rot,
        image: this.image,
        unit: this.unit,
      })();
    } catch(e) {
      console.error(`Error drawing element:`, e);
    }
  }
}

webbitRegistry.define('frc-field-object', FieldObject);