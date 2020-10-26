import { LitElement, html, css } from 'lit-element';

class StylesTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      p {
        margin-top: 0;
        font-weight: bold;
      }

      p span {
        color: purple;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      selectedNode: { type: Object, attribute: false },
      webbitIdInput: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.selectedNode = null;
    this.webbitIdInput = '';
  }

  renderWebbit() {
    return html`
      <p>Styles for <span>${this.selectedNode.getWebbitId()}</span></p>
    `;
  }

  render() {

    if (!this.selectedNode) {
      return html`<p>Select an element to view its styles.</p>`;
    }

    if (this.selectedNode === this.wom.getRootNode()) {
      return html`<p>The styles for the root node cannot be changed.</p>`;
    }

    if (this.selectedNode && !this.selectedNode.isWebbit()) {
      return html`<p>The styles for this element cannot be changed.</p>`;
    }

    if (this.selectedNode && this.selectedNode.isWebbit()) {
      return this.renderWebbit();
    }
  }
}

customElements.define('dashboard-styles-tool', StylesTool);