import { LitElement, html, css } from '@webbitjs/webbit';
import { isElementInViewport } from '../utils';
import './wom-slot-node';
import './wom-viewer-attribute';

class WomViewer extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        font-size: 15px;
      }

      header {
        padding: 3px 0;
        display: flex;
      }

      header.selected {
        background-color: #ddd;
      }

      header:not(.selected):hover {
        background-color: #eee;
      }

      header .key {
        white-space: nowrap;
        width: 100%;
      }

      header .key, header .value {
        box-sizing: border-box;
      }
      header .key .caret + label {
        padding-top: 2px;
        padding-left: 2px;
      }
      header .key label {
        overflow: auto;
        white-space: nowrap;
        text-overflow: clip;
        padding-left: 2px;
        flex: 1;
      }
      header .key label::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .type::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .key {
        margin-left: var(--header-key-margin-left);
        width: calc(100% - var(--header-key-margin-left, 0px));
        color: purple;
        display: flex;
      }
      header .caret [icon] {
        cursor: pointer;
        font-size: 10px;
        display: none;
        width: 14px;
        height: auto;
        color: black;
      }
      header.expanded .caret [icon$="angle-down"] {
        display: inline-block;
      }
      header.collapsed .caret [icon$="angle-right"] {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      expanded: { type: Boolean },
      slot: { type: String },
      node: { type: Object },
      selectedNode: { type: Object },
      level: { type: Number },
      container: { type: Object }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.expanded = false;
    this.slot = '';
    this.node = null;
    this.selectedNode = null;
    this.level = 0;
    this.headerNode = null;
    this.container = null;
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  expand() {
    this.expanded = true;
  }

  hasChildren() {
    return this.node.hasChildren();
  }

  isSelected() {
    if (!this.selectedNode) {
      return false;
    }

    return this.selectedNode.getNode() === this.node.getNode();
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode')) {
      if (this.selectedNode && this.selectedNode.isDescendant(this.node)) {
        this.expanded = true;
      }

      if (
        this.selectedNode && 
        this.selectedNode === this.node && 
        !isElementInViewport(this.headerNode, this.container)
      ) {
        if ('scrollIntoViewIfNeeded' in this.headerNode) {
          this.headerNode.scrollIntoViewIfNeeded();
        }
      }
    }
  }

  firstUpdated() {
    this.headerNode = this.shadowRoot.querySelector('header');
    this.headerNode.style.setProperty(
      '--header-key-margin-left', 
      `${16 * this.level + 5}px`
    );

  }

  onSelect(ev) {

    const target = ev.target || ev.path[0];

    // select if click element isn't caret
    if (target.nodeName !== 'IRON-ICON') {
      this.wom.selectNode(this.node);
    }
  }

  onPreview(ev) {
    this.wom.previewNode(this.node);
  }

  onPreviewEnd() {
    if (this.wom.getPreviewedNode().getNode() === this.node.getNode()) {
      this.wom.removeNodePreview();
    }
  }

  hasSlots() {
    return this.node.getSlots().length > 0;
  }
  
  getSlottedChildren() {
    return this.node.getSlots().map(slot => {
      return {
        slot,
        children: this.node.getChildrenBySlot(slot)
      };
    });
  }

  renderAttributes() {
    const webbitId = this.node.getWebbitId();

    if (!webbitId) {
      return '';
    }

    return html`
      <wom-viewer-attribute attribute="id">${webbitId}</wom-viewer-attribute>
    `;
  }

  render() {

    return html`
      <div class="node">
        <header 
          class="${this.expanded ? 'expanded' : 'collapsed'} ${this.isSelected() ? 'selected' : ''}"
          @click="${this.onSelect}"  
          @mouseenter="${this.onPreview}"
          @mouseleave="${this.onPreviewEnd}"
        >
          <span class="key">
            ${this.hasSlots() ? html`
              <span class="caret" @click="${this.toggleExpand}">
                <iron-icon icon="vaadin:angle-right"></iron-icon>
                <iron-icon icon="vaadin:angle-down"></iron-icon>
              </span>
            ` : ''}
            <label>
              ${this.node.getDisplayName()}
              ${this.renderAttributes()}
            </label>
          </span>
        </header>
        ${this.expanded && this.hasSlots() ? html`
          <div class="nodes">
            ${this.getSlottedChildren().map(({ slot, children }) => html`
              <wom-slot-node
                .wom="${this.wom}"
                .parentNode="${this.node}"
                slot="${slot}"
                level="${this.level + 1}"
              ></wom-slot-node>
              ${children.map(node => html`
                <wom-viewer
                  .wom="${this.wom}"
                  slot="${slot}"
                  .node="${node}"
                  .selectedNode="${this.selectedNode}"
                  .container="${this.container}"
                  level="${this.level + 1}"
                ></wom-viewer>
              `)}
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('wom-viewer', WomViewer);