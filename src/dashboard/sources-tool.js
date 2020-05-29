import { LitElement, html, css } from 'lit-element';

class SourcesTool extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px 10px;
        font-family: sans-serif;
      }

      [part=source-fields] {
        display: flex;
      }

      [part=source-fields] vaadin-text-field {
        flex: 1;
        margin-right: 10px;
        min-width: 120px;
        padding-top: 0;
      }

      [part=confirm-button] iron-icon {
        color: green;
      }

      [part=cancel-button] iron-icon {
        color: red;
      }

    `;
  }

  static get properties() {
    return {
      selectedNode: { type: Object, attribute: false }
    };
  }

  constructor() {
    super();
    this.selectedNode = null;
  }

  renderWebbit() {
    return html`
      <div part="source-fields">
        <vaadin-text-field
          label="Source Key"
          clear-button-visible 
          value="Value"
          theme="small"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Source Provider"
          clear-button-visible 
          value="Value"
          theme="small"
        ></vaadin-text-field>
      </div>

      <vaadin-button part="confirm-button" theme="success primary small" aria-label="Confirm">
        Confirm
      </vaadin-button>

      <vaadin-button part="cancel-button" theme="error primary small" aria-label="Cancel">
        Cancel
      </vaadin-button>
    `;
  }


  render() {
    return html`
      ${!this.selectedNode ? html`
        Select an element to view sources.
      ` : ''}
      ${(this.selectedNode && !this.selectedNode.isWebbit()) ? html`
        No sources are available for this element.
      ` : ''}

      ${this.selectedNode && this.selectedNode.isWebbit() ? html`
        ${this.renderWebbit()}
      ` : ''}
    `;
  }
}

customElements.define('dashboard-sources-tool', SourcesTool);