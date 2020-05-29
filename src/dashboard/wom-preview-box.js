import { LitElement, html } from '@webbitjs/webbit';

class WomPreviewBox extends LitElement {

  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number },
      width: { type: Number },
      height: { type: Number },
    };
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.previewElement = null;
  }

  firstUpdated() {
    this.previewElement = document.createElement('div');
    this.previewElement.style.background = 'rgba(3, 132, 210, .5)';
    this.previewElement.style.position = 'absolute';
    this.previewElement.style.zIndex = '1';
    this.previewElement.style.pointerEvents = 'none';
    document.body.appendChild(this.previewElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.previewElement.remove();  
  }

  updated() {
    this.setBounds();
  }

  setBounds() {
    this.previewElement.style.top = `${this.y}px`;
    this.previewElement.style.left = `${this.x}px`;
    this.previewElement.style.width = `${this.width}px`;
    this.previewElement.style.height = `${this.height}px`;
  }

  render() {
    return html``;
  }
}

customElements.define('wom-preview-box', WomPreviewBox);