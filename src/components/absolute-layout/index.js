import { Webbit, html, css } from '@webbitjs/webbit';

export default class AbsoluteLayout extends Webbit {

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
    const { x, y } = context;
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    this.append(element);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-absolute-layout', AbsoluteLayout);