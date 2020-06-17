import { LitElement, html } from 'lit-element';
import '../sources/sources-tool';
import '../components/components-tool';

class NewElementPreviewBox extends LitElement {

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
    if (changedProps.has('wom') && this.wom) {
      this.wom.addListener('womPreviewNodeAdd', ev => {
        this.previewedNode = ev.detail.node;
      });
      this.wom.addListener('womPreviewNodeRemove', () => {
        this.previewedNode = null;
      });
    }
  }

  render() {
    return html`
      <wom-preview-box
        .wom="${this.wom}"
        .previewedNode="${this.previewedNode}"
        background="rgba(255, 255, 255, .5)"
        border="2px dashed green"
      ></wom-preview-box>
    `;
  }
}

customElements.define('wom-new-element-preview-box', NewElementPreviewBox);