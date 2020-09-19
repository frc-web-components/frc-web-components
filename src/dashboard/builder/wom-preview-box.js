import { LitElement, html } from '@webbitjs/webbit';
import { isElementInViewport } from '../utils';

class WomPreviewBox extends LitElement {

  static get properties() {
    return {
      wom: { type: Object },
      previewedNode: { type: Object },
      background: { type: String },
      border: { type: String },
    };
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.wom = null;
    this.previewElement = null;
    this.previewedNode = null;
    this.background = 'rgba(3, 132, 210, .5)';
    this.border = 'none';
  }

  updated(changedProperties) {

    if (changedProperties.has('wom')) {
      this.wom.addListener('womNodeSelect', (ev) => {
        const { node } = ev.detail;
        // if (!isElementInViewport(
        //   node.getNode(), 
        //   this.wom.getDashboardElement()
        // ))
        // node.getNode().scrollIntoView();
      });
    }
  }

  firstUpdated() {
    this.previewElement = document.createElement('div');
    this.previewElement.style.background = this.background;
    this.previewElement.style.border = this.border;
    this.previewElement.style.position = 'absolute';
    this.previewElement.style.zIndex = '1';
    this.previewElement.style.pointerEvents = 'none';
    document.body.appendChild(this.previewElement);


    const setPreviewBounds = () => { 
      if (this.previewedNode && this.wom) {
        const boundingRect = this.wom.getDashboardElement().getBoundingClientRect();
        const { x, y, width, height, bottom, right } = this.previewedNode.getBoundingClientRect();        
        
        const boundedLeft = Math.max(x, boundingRect.x);
        const boundedTop = Math.max(y, boundingRect.y);
        const boundedRight = Math.min(right, boundingRect.right);
        const boundedBottom = Math.min(bottom, boundingRect.bottom);
        const boundedWidth = boundedRight - boundedLeft;
        const boundedHeight = boundedBottom - boundedTop;

        this.previewElement.style.display = 'block';
        this.previewElement.style.left = boundedLeft + 'px';
        this.previewElement.style.top = boundedTop + 'px';
        this.previewElement.style.width = boundedWidth + 'px';
        this.previewElement.style.height = boundedHeight + 'px';
      } else {
        this.previewElement.style.display = 'none';
      }
      window.requestAnimationFrame(setPreviewBounds);
    };
    window.requestAnimationFrame(setPreviewBounds);
  }



  disconnectedCallback() {
    super.disconnectedCallback();
    this.previewElement.remove();  
  }

  render() {
    return html``;
  }
}

customElements.define('wom-preview-box', WomPreviewBox);