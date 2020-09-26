import { Webbit, html, css, FlowLayout } from '@webbitjs/webbit';

export default class FlowLayoutElement extends Webbit {

  static get metadata() {
    return {
      displayName: 'Flow Layout',
      category: 'Layout',
      // description: 'A container where child elements are absolutely positioned.'
    };
  }

  static get properties() {
    return {
      width: { type: String },
      height: { type: String },
      direction: { type: String },
      wrap: { type: String },
      justifyContent: { type: String },
      alignItems: { type: String },
      alignContent: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        width: var(--layout-width);
        height: var(--layout-height);
        flex-direction: var(--layout-direction);
        flex-wrap: var(--layout-wrap);
        justify-content: var(--layout-justify-content);
        align-items: var(--layout-align-items);
        align-content: var(--layout-align-content);
      }
    `;
  }

  constructor() {
    super();
    this.width = '400px';
    this.height = '400px';
    this.direction = 'row';
    this.wrap = 'wrap';
    this.justifyContent = 'flex-start';
    this.alignItems = 'flex-start';
    this.alignContent = 'flex-start';
  }

  placeLayoutElement(element, context) {
    FlowLayout.placeLayoutElement(element, context);
  }

  updated(changedProps) {
    ['width', 'height', 'direction', 'wrap', 'justifyContent', 'alignItems', 'alignContent'].forEach(prop => {
      if (changedProps.has(prop)) {
        const attribute = this.constructor.properties[prop].attribute;
        this.style.setProperty(`--layout-${attribute}`, this[prop]);
      }
    });
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-flow-layout', FlowLayoutElement);