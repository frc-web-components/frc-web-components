import { LitElement, html, css } from '@webbitjs/webbit';
import { isElementInViewport } from './utils';

class WomViewer extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        font-size: 15px;
      }

      :host([adding-element]:not([level="0"])) header:hover, 
      :host([adding-element]:not([level="0"])) header:hover .key, 
      :host([adding-element]:not([level="0"])) header:hover .key label {
        cursor: cell;
      }

      :host([adding-element]:not([level="0"])) header:hover .key {
        box-shadow: 0px var(--add-element-position, 8px) 0px 0px #87b187
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
      addingElement: { type: Boolean, attribute: 'adding-element', reflect: true },
      container: { type: Object }
    };
  }

  constructor() {
    super();
    this.expanded = false;
    this.node = null;
    this.selectedNode = null;
    this.level = 0;
    this.addingElement = false;
    this.headerNode = null;
    this.container = null;
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.requestUpdate();
  }

  expand() {
    this.expanded = true;
    this.requestUpdate();
  }

  hasChildren() {
    return this.node.hasChildren();
  }

  isSelected() {
    return this.selectedNode === this.node;
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedNode')) {
      if (this.selectedNode && this.selectedNode.isDescendant(this.node)) {
        this.expanded = true;
        this.requestUpdate();
      }

      if (
        this.selectedNode && 
        this.selectedNode === this.node && 
        !isElementInViewport(this.headerNode, this.container)
      ) {
        this.headerNode.scrollIntoView();
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

    // Don't allow the root node to be selected
    if (this.level === 0) {
      return;
    }

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

  onAddElementPreview(ev) {

    // Don't allow elements to be added before or after root node
    if (this.level === 0) {
      return;
    }

    const target = this.headerNode;
    const offset = target.offsetTop;
    const height = target.clientHeight;
    const y = ev.pageY;
    var loc = Math.abs(offset - y);
    if (loc < height / 2) {
      target.style.setProperty('--add-element-position', '-8px'),
      this.dispatchAddElementPreview(true);
    }
    else {
      target.style.setProperty('--add-element-position', '8px')
      this.dispatchAddElementPreview(false);
    }
  }

  dispatchAddElementPreview(before) {    
    const event = new CustomEvent('womNodeAddElementPreview', {
      bubbles: true,
      composed: true,
      detail: {
        node: this.node,
        before,
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
          @mousemove="${this.onAddElementPreview}"
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
                .container="${this.container}"
                level="${this.level + 1}"
                ?adding-element="${this.addingElement}"
              ></wom-viewer>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('wom-viewer', WomViewer);