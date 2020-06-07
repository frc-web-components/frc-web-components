import { Webbit, html, css } from '@webbitjs/webbit';

export default class Container extends Webbit {

  static get metadata() {
    return {
      displayName: 'Container',
      category: 'Layout',
    };
  }

  static get styles() {
    return css`
      :host {
        display: var(--container-display);
        width: var(--container-width);
        height: var(--container-height);
        background: var(--container-background);
        color: var(--container-color);
        font-family: var(--container-font-family);
      }
    `;
  }

  static get properties() {
    return {
      display: { type: String },
      width: { type: String },
      height: { type: String },
      background: { type: String },
      color: { type: String },
      fontFamily: { type: String }
    };
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.width = 'auto';
    this.height = 'auto';
    this.background = 'none';
    this.color = 'inherit';
    this.fontFamily = 'sans-serif';
  }

  render() {
    return html`   
      <slot></slot>
    `;
  }

  updated(changedProps) {
    ['display', 'width', 'height', 'background', 'color', 'fontFamily'].forEach(prop => {
      if (changedProps.has(prop)) {
        const attribute = this.constructor.properties[prop].attribute;
        this.style.setProperty(`--container-${attribute}`, this[prop]);
      }
    });
  }
}

webbitRegistry.define('frc-container', Container);