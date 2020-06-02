import { LitElement, html, css } from 'lit-element';
import './sources/sources-tool';
import './components/components-tool';

class NewElementPreview extends LitElement {

  static get properties() {
    return {
      selectedNode: { type: Object },
      selectedComponent: { type: String },
      adjacentNode: { type: Object },
      addBefore: { type: Boolean }
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
    this.selectedComponent = '';
    this.displayNode = null;
    this.adjacentNode = null;
    this.addBefore = false;
  }

  firstUpdated() {
    this.displayNode = this.shadowRoot.querySelector('wom-new-element-preview-display');
  }

  addNewElementPreview(insertedNode) {
    if (this.adjacentNode && this.adjacentNode.node.parentNode) {
      this.adjacentNode.node.parentNode.insertBefore(
        insertedNode, 
        this.addBefore ? this.adjacentNode.node : this.adjacentNode.node.nextSibling
      );
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
      if (changedProperties.has('adjacentNode') || changedProperties.has('addBefore')) {
        this.addNewElementPreview(this.displayNode);
      }
    }

    if (changedProperties.has('selectedNode') && this.selectedNode) {
      const newElement = this.displayNode.querySelector(this.selectedComponent);
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