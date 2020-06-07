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
        max-width: 100%;
        max-height: 100%;
        background: var(--container-background);
        color: var(--container-color);
        font-family: var(--container-font-family);
      }
    `;
  }

  static get properties() {
    return {
      display: { type: String, category: 'Styles' },
      width: { type: String, category: 'Styles' },
      height: { type: String, category: 'Styles' },
      background: { type: String, category: 'Styles' },
      color: { type: String, category: 'Styles' },
      fontFamily: { type: String, category: 'Styles' }
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