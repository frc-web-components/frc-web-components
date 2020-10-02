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
        max-width: 100%;
        max-height: 100%;
        width: 100vw;
        height: 100vh;
        position: relative;
      }

      ::slotted(*) {
        position: absolute;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

webbitRegistry.define('frc-absolute-layout', AbsoluteLayout);