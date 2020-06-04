import { LitElement, html, css } from 'lit-element';
import './sources/sources-tool';
import './components/components-tool';
import { isElementInViewport } from './utils';


class NewElementPreview extends LitElement {

  static get properties() {
    return {
      selectedNode: { type: Object },
      selectedNodeMethod: { type: String },
      parentNode: { type: Object },
      selectedComponent: { type: String },
      adjacentNode: { type: Object },
      placement: { type: String },
      slot: { type: String }
    };
  }

  static get styles() {
    return css`
      wom-new-element-preview-display {
        display: none !important;
      }
    `;
  }

  constructor() {
    super();
    this.selectedNode = null;
    this.selectedNodeMethod = '';
    this.parentNode = null;
    this.selectedComponent = '';
    this.displayNode = null;
    this.adjacentNode = null;
    this.placement = 'before';
    this.slot = '';
  }

  firstUpdated() {
    this.displayNode = this.shadowRoot.querySelector('wom-new-element-preview-display');
  }

  addNewElementPreview(insertedNode) {

    if (this.adjacentNode && this.placement === 'inside') {
      this.adjacentNode.getNode().prepend(insertedNode);

      // scroll inserted node into view
      if (!isElementInViewport(insertedNode, this.parentNode)) {
        insertedNode.scrollIntoView();
      }
    } 
    else if (this.adjacentNode && this.adjacentNode.node.parentNode) {
      this.adjacentNode.node.parentNode.insertBefore(
        insertedNode, 
        this.placement === 'before' ? this.adjacentNode.node : this.adjacentNode.node.nextSibling
      );

      // scroll inserted node into view
      if (!isElementInViewport(insertedNode, this.parentNode)) {
        insertedNode.scrollIntoView();
      }
    }
  }

  createNewElement() {
    this.displayNode.innerHTML = '';
    if (this.selectedComponent) {
      this.displayNode.innerHTML = `
        <${this.selectedComponent}></${this.selectedComponent}>
      `;
      const newElement = this.displayNode.querySelector(this.selectedComponent);
      newElement.updateComplete.then(() => {
        this.displayNode.style.display = window.getComputedStyle(newElement).display;
      });
    }
  }

  updated(changedProperties) {


    if (changedProperties.has('selectedComponent')) {
      if (this.selectedComponent) {
        this.createNewElement();
      } else {
        this.displayNode.remove();
      }
    }

    if (this.selectedComponent) {
      if (changedProperties.has('adjacentNode') || changedProperties.has('placement')) {
        this.addNewElementPreview(this.displayNode);
        this.displayNode.setAttribute('slot', this.slot === 'default' ? '' : this.slot);
      }
    }

    if (
      (changedProperties.has('selectedNode') || changedProperties.has('selectedNodeMethod')) && 
      this.selectedNode && 
      this.selectedNodeMethod === 'womViewer' &&
      this.selectedComponent
    ) {
      const newElement = this.displayNode.querySelector(this.selectedComponent);
      newElement.setAttribute('slot', this.slot === 'default' ? '' : this.slot);
      this.addNewElementPreview(newElement);
      
      const event = new CustomEvent('womNodeAdd', {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  render() {
    return html`
      <wom-new-element-preview-display
        style="
          border: 2px dashed darkgreen;
          opacity: .5;
          display: block;
        "
      >

      </wom-new-element-preview-display>
    `;
  }
}

customElements.define('wom-new-element-preview', NewElementPreview);