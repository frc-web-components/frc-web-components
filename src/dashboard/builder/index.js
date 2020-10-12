import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
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
      'womNodeDeselect',
      'selectionToolToggle',
      'womNodeAdd', 
      'womNodeRemove',
      'womChange'
    ].forEach(eventName => {
      this.wom.addListener(eventName, () => {
        this.requestUpdate();
      });
    });
  }

  renderSelectionBoxes() {

    let nodes = [];

    if (this.wom.isSelectionEnabled()) {
      nodes = this.wom.getRootNode().getDescendents().concat(this.wom.getRootNode());
    } else if (this.wom.getSelectedNode()) {
      nodes = [this.wom.getSelectedNode()];
    }

    return html`
      ${repeat(nodes, (descendent) => descendent, (descendent, index) => {
        const selectedNode = this.wom.getSelectedNode();
        const isSelected = selectedNode && selectedNode.getNode() === descendent.getNode();
        const border = (isSelected && descendent !== this.wom.getRootNode())
          ? '2px dashed green'
          : 'none';
        return html`
          <wom-preview-box
            background="none"
            border="${border}"
            .wom="${this.wom}"
            .previewedNode="${descendent.getNode()}"
            z-index="${2 + descendent.getLevel()}"
            @boxClick="${() => this.wom.selectNode(descendent)}"
            @boxInitialized="${ev => {
              const target = ev.target || ev.path[0];
              descendent.setSelectionBox(target.previewElement);
            }}"
          ></wom-preview-box>
        `;
      })}
    `;
  }

  render() {
    return html`
      <wom-preview-box
        .wom="${this.wom}"
        .previewedNode="${
          this.wom.getPreviewedNode() 
          && this.wom.getPreviewedNode().getNode()
        }"
        z-index="1"
      ></wom-preview-box>
      ${this.renderSelectionBoxes()}
      <div part="container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('wom-dashboard-builder', DashboardBuilder);