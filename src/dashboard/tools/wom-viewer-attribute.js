import { LitElement, html, css } from '@webbitjs/webbit';

class WomViewerAttribute extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
        color: gray;
      }

      [part=attribute] {
        color: brown;
      }

      slot {
        color: blue;
        display: inline-block;
        vertical-align: bottom;
      }
    `;
  }

  static get properties() {
    return {
      attribute: { type: String }
    };
  }

  constructor() {
    super();
    this.attribute = '';
  }

  render() {
    return html`
      <span part="attribute">${this.attribute}</span>="<slot></slot>"
    `;
  }
}

customElements.define('wom-viewer-attribute', WomViewerAttribute);