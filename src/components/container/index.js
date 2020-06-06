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
    };
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.width = 'auto';
    this.height = 'auto';
    this.background = 'none';
    this.color = 'inherit';
  }

  render() {
    return html`   
      <slot></slot>
    `;
  }

  updated(changedProps) {
    ['display', 'width', 'height', 'background', 'color'].forEach(prop => {
      if (changedProps.has(prop)) {
        this.style.setProperty(`--container-${prop}`, this[prop]);
      }
    });
  }
}

webbitRegistry.define('frc-container', Container);