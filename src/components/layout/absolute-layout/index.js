import { Webbit, html, css, AbsoluteLayout } from '@webbitjs/webbit';

export default class AbsoluteLayoutElement extends Webbit {

  static get metadata() {
    return {
      displayName: 'Absolute Layout',
      category: 'Layout',
      description: 'A container where child elements are absolutely positioned.'
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
      }
    `;
  }

  constructor() {
    super();
  }

  placeLayoutElement(element, context) {
    AbsoluteLayout.placeLayoutElement(element, context);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-absolute-layout', AbsoluteLayoutElement);