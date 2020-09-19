import { Webbit, html, css } from '@webbitjs/webbit';

export default class Container extends Webbit {

  static get metadata() {
    return {
      displayName: 'Container',
      category: 'Layout',
      description: 'A container for other components.'
    };
  }

  static get styles() {
    return css`
      :host {
        display: var(--container-display);
        width: var(--container-width);
        height: var(--container-height);
        margin: var(--container-margin);
        padding: var(--container-padding);
        box-sizing: var(--container-box-sizing);
        max-width: 100%;
        max-height: 100%;
        background: var(--container-background);
        color: var(--container-color);
        font-family: var(--container-font-family);
        text-align: var(--container-text-align);
        font-size: var(--container-font-size);
        font-weight: var(--container-font-weight);
      }
    `;
  }

  static get properties() {
    return {
      display: { type: String, category: 'Styles' },
      width: { type: String, category: 'Styles' },
      height: { type: String, category: 'Styles' },
      margin: { type: String, category: 'Styles' },
      padding: { type: String, category: 'Styles' },
      boxSizing: { type: String, category: 'Styles' },
      background: { type: String, category: 'Styles' },
      color: { type: String, category: 'Styles' },
      fontFamily: { type: String, category: 'Styles' },
      fontSize: { type: String, category: 'Styles' },
      fontWeight: { type: String, category: 'Styles' },
      textAlign: { type: String, category: 'Styles' },
    };
  }

  constructor() {
    super();
    this.display = 'inline-block';
    this.width = 'auto';
    this.height = 'auto';
    this.margin = '0px';
    this.padding = '5px';
    this.boxSizing = 'border-box';
    this.background = 'none';
    this.color = 'inherit';
    this.fontFamily = 'inherit';
    this.fontSize = 'inherit';
    this.fontWeight = 'inherit';
    this.textAlign = 'inherit';
  }

  render() {
    return html`   
      <slot></slot>
    `;
  }

  updated(changedProps) {
    ['display', 'width', 'height', 'margin', 
    'padding', 'boxSizing', 'background', 'color', 'fontFamily',
    'fontSize', 'fontWeight', 'textAlign'].forEach(prop => {
      if (changedProps.has(prop)) {
        const attribute = this.constructor.properties[prop].attribute;
        this.style.setProperty(`--container-${attribute}`, this[prop]);
      }
    });
  }
}

webbitRegistry.define('frc-container', Container);