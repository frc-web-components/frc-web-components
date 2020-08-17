import { LitElement, html, css } from 'lit-element';

class StylesTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
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
    return html`
      ${!this.selectedNode ? html`
        Select an element to view its styles.
      ` : ''}
      ${(this.selectedNode && !this.selectedNode.isWebbit()) ? html`
        The styles for this element cannot be changed.
      ` : ''}

      ${this.selectedNode && this.selectedNode.isWebbit() ? html`
        ${this.renderWebbit()}
      ` : ''}
    `;
  }
}

customElements.define('dashboard-styles-tool', StylesTool);