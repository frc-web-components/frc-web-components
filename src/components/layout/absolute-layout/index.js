import { html, css } from 'lit-element';
import { Webbit, define } from '../../../webbit';

export default class AbsoluteLayout extends Webbit {

  static get dashboardConfig() {
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

  render() {
    return html`
      <slot></slot>
    `;
  }
}

define('frc-absolute-layout', AbsoluteLayout);