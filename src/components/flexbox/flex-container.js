import { html, css } from '@webbitjs/webbit';
import Container from '../container';

class FlexContainer extends Container {

  static get metadata() {
    return {
      displayName: 'Flex Container',
      category: 'Layout',
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          flex-direction: var(--container-direction);
          flex-wrap: var(--container-wrap);
          justify-content: var(--container-justify-content);
          align-items: var(--container-align-items);
          align-content: var(--container-align-content);
        }
      `
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      direction: { type: String },
      wrap: { type: String },
      justifyContent: { type: String },
      alignItems: { type: String },
      alignContent: { type: String },
    };
  }

  constructor() {
    super();
    this.display = 'flex';
    this.direction = 'row';
    this.wrap = 'wrap';
    this.justifyContent = 'flex-start';
    this.alignItems = 'flex-start';
    this.alignContent = 'flex-start';
  }

  render() {
    return html`   
      <slot></slot>
    `;
  }

  updated(changedProps) {

    super.updated(changedProps);

    ['direction', 'wrap', 'justifyContent', 'alignItems', 'alignContent'].forEach(prop => {
      if (changedProps.has(prop)) {
        const attribute = this.constructor.properties[prop].attribute;
        this.style.setProperty(`--container-${attribute}`, this[prop]);
      }
    });
  }
}

webbitRegistry.define('frc-flex-container', FlexContainer);