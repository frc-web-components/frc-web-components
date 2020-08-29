import { LitElement, html, css } from 'lit-element';
import './wom-preview-box';
import './wom-new-element-preview-box';

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
      previewedNode: { type: Object }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.previewedNode = null;
  }

  updated(changedProps) {
    if (changedProps.has('wom')) {
      if (!this.wom) {
        this.previewedNode = null;
      } else {
        this.wom.addListener('womNodePreview', (ev) => {
          this.previewedNode = ev.detail.node;
        });
        this.wom.addListener('womNodePreviewRemove', (ev) => {
          this.previewedNode = null;
        });
      }
    }
  }

  onAdd() {
    const { targetedNode } = this.wom.getActionContext();

    if (this.wom.getSelectedActionId() === 'addNode') {
      if (targetedNode) {
        console.log('target ndoe:');
        this.wom.targetNode(targetedNode);
      }
    }
  }

  render() {
    return html`
      ${this.wom.getSelectedActionId() !== 'addNode' ? html`
        <wom-preview-box
          .wom="${this.wom}"
          .previewedNode="${this.previewedNode && this.previewedNode.getNode()}"
        ></wom-preview-box>
      ` : ''}
      <wom-new-element-preview-box
        .wom="${this.wom}"
      ></wom-new-element-preview-box>
      <div part="container" @click="${this.onAdd}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wom-dashboard-builder', DashboardBuilder);