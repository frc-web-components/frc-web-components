import { LitElement, html, css } from '@webbitjs/webbit';

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
        padding-left: 3px;
      }
      header .key label {
        overflow: auto;
        white-space: nowrap;
        text-overflow: clip;
        padding-left: 8px;
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
        padding-left: var(--header-key-padding-left);
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
      node: { type: Object },
      selectedNode: { type: Object },
      level: { type: Number },
    };
  }

  constructor() {
    super();
    this.expanded = false;
    this.node = null;
    this.selectedNode = null;
    this.level = 0;
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.requestUpdate();
  }

  hasChildren() {
    return this.node.hasChildren();
  }

  isSelected() {
    return this.selectedNode === this.node;
  }

  firstUpdated() {
    const headerNode = this.shadowRoot.querySelector('header');
    headerNode.style.setProperty(
      '--header-key-padding-left', 
      `${12 * this.level + 5}px`
    );
  }

  onSelect(ev) {
    const [target] = ev.path;

    // select if click element isn't caret
    if (target.nodeName !== 'IRON-ICON') {
      const event = new CustomEvent('womNodeSelect', {
        bubbles: true,
        composed: true,
        detail: {
          node: this.node
        }
      });
      this.dispatchEvent(event);
    }
  }

  onPreview(ev) {
    const event = new CustomEvent('womNodePreview', {
      bubbles: true,
      composed: true,
      detail: {
        node: this.node
      }
    });
    this.dispatchEvent(event);
  }

  onPreviewEnd() {
    const event = new CustomEvent('womNodePreviewEnd', {
      bubbles: true,
      composed: true,
      detail: {
        node: this.node
      }
    });
    this.dispatchEvent(event);
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
            ${this.hasChildren() ? html`
              <span class="caret" @click="${this.toggleExpand}">
                <iron-icon icon="vaadin:angle-right"></iron-icon>
                <iron-icon icon="vaadin:angle-down"></iron-icon>
              </span>
            `: ''}
            <label>${this.node.getName()}</label>
          </span>
        </header>
        ${this.hasChildren() && this.expanded ? html`
          <div class="nodes">
            ${this.node.getChildren().map(node => html`
              <wom-viewer 
                .node="${node}"
                .selectedNode="${this.selectedNode}"
                level="${this.level + 1}"
              ></wom-viewer>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('wom-viewer', WomViewer);