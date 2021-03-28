import { FlowLayout } from '@webbitjs/webbit';
import { html, css } from 'lit-element';
import { Webbit, define } from '../../../webbit';

export default class FlowLayoutElement extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Flow Layout',
      category: 'Layout',
      // description: 'A container where child elements are absolutely positioned.'
    };
  }

  static get properties() {
    return {
      width: { type: String, defaultValue: '400px' },
      height: { type: String, defaultValue: '400px' },
      direction: { type: String, defaultValue: 'row' },
      wrap: { type: String, defaultValue: 'wrap' },
      justifyContent: { type: String, defaultValue: 'flex-start' },
      alignItems: { type: String, defaultValue: 'flex-start' },
      alignContent: { type: String, defaultValue: 'flex-start' },
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

define('frc-flow-layout', FlowLayoutElement);