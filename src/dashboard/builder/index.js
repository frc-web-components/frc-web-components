import { LitElement, html, css } from 'lit-element';
import './wom-preview-box';

class DashboardBuilder extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        width: 70%;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
    };
  }

  constructor() {
    super();
    this.wom = null;
  }

  updated(changedProps) {
    [
      'womNodePreview', 
      'womNodePreviewRemove', 
      'womNodeSelect', 
      'womNodeDeselect'
    ].forEach(eventName => {
      this.wom.addListener(eventName, () => {
        this.requestUpdate();
      });
    });
  }

  render() {
    return html`
      <wom-preview-box
        .wom="${this.wom}"
        .previewedNode="${
          this.wom.getPreviewedNode() 
          && this.wom.getPreviewedNode().getNode()
        }"
      ></wom-preview-box>
      <wom-preview-box
        background="none"
        border="2px dashed green"
        .wom="${this.wom}"
        .previewedNode="${
          this.wom.getSelectedNode() 
          && this.wom.getSelectedNode() !== this.wom.getRootNode()
          && this.wom.getSelectedNode().getNode()
        }"
      ></wom-preview-box>
      <div part="container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wom-dashboard-builder', DashboardBuilder);