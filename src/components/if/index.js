import { Webbit, html, css } from '@webbitjs/webbit';

class If extends Webbit {

  static get metadata() {
    return {
      displayName: 'If',
      category: 'Layout',
      description: 'Component for conditionally displaying content.',
      slots: ['default', 'if-true', 'if-false']
      // documentationLink: 'https://frc-web-components.github.io/components/3-axis-accelerometer/'
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = false;
  }

  render() {
    if (this.value) {
      return html`
        <slot></slot>
        <slot name="if-true"></slot>
      `;
    }
    return html`
      <slot name="if-false"></slot>
    `;
  }
}

webbitRegistry.define('frc-if', If);