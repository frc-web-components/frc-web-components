import { Webbit, html, svg, css } from '@webbitjs/webbit';

class FieldObject extends Webbit {

  static get styles() {
    return css`
      :host {
        display: inline-block;
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
      image: { type: String },
      unit: { type: String }
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
}

webbitRegistry.define('frc-field-object', FieldObject);