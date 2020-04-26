import { Webbit, html, css } from '@webbitjs/webbit';

class Label extends Webbit {

  static get styles() {
    return css`
      :host {
        font: inherit;
        display: inline;
      }
    `;
  }

  static get properties() {
    return {
      text: { type: String, primary: true },
    };
  }

  constructor() {
    super();
    this.text = '';
  }

  render() {
    return html`${this.text}`;
  }
}

webbitRegistry.define('frc-label', Label);