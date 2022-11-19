import { html, css, LitElement } from 'lit';
import { toBaseConversions } from './units';

export const elementName = 'frc-field-object';

export const elementConfig = {
  dashboard: {
    displayName: 'Field Object',
    topLevel: false,
    layout: {
      resizable: {
        horizontal: false,
        vertical: false,
      },
      movable: false,
    },
  },
  properties: {
    x: { type: Number },
    y: { type: Number },
    rot: { type: Number },
    width: { type: Number, defaultValue: 1 },
    height: { type: Number, defaultValue: 1 },
    unit: {
      type: String,
      defaultValue: 'inherit',
      input: {
        type: 'StringDropdown',
        getOptions() {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
      },
    },
    image: { type: String },
    draw: { type: String },
  },
};

export default class FieldObject extends LitElement {
  static __IS_FIELD_OBJECT__ = true;

  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      position: absolute;
    }

    [part='field-object'] {
      width: 100%;
      height: 100%;
      background-image: var(--field-object-image);
      background-size: cover;
    }
  `;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.width = 1;
    this.height = 1;
    this.unit = 'inherit';
    this.image = '';
    this.draw = '';
    this.drawFunction = new Function();
  }

  updated(changedProperties) {
    if (changedProperties.has('image')) {
      const fieldElement = this.shadowRoot.querySelector('[part=field-object]');
      fieldElement.style.setProperty(
        '--field-object-image',
        `url(${this.image}`
      );
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
    } catch (e) {
      console.error(`Error drawing element:`, e);
    }
  }
}

customElements.define(elementName, FieldObject);
