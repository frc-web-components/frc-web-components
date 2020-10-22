import { LitElement, html } from '@webbitjs/webbit';
import { isElementInViewport } from '../utils';

class WomPreviewBox extends LitElement {

  static get properties() {
    return {
      wom: { type: Object },
      previewedNode: { type: Object },
      background: { type: String },
      border: { type: String },
      zIndex: { type: Number, attribute: 'z-index' },
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
    this.zIndex = 1;
  }

  updated(changedProperties) {
    if (changedProperties.has('border')) {
      this.previewElement.style.border = this.border;
    } 
    
    if (changedProperties.has('zIndex')) {
      this.previewElement.style.zIndex = this.zIndex.toString();
    }
  }

  firstUpdated() {
    this.previewElement = document.createElement('div');
    this.previewElement.style.background = this.background;
    this.previewElement.style.position = 'absolute';
    this.previewElement.addEventListener('click', ev => {

      const { width, height } = this.wom.getDashboardElement().getBoundingClientRect();
      const { clientX, clientY } = ev;

      if ((clientX > width || clientY > height)) {
        return;
      }

      const event = new CustomEvent('boxClick', {
        detail: {}
      });
      this.dispatchEvent(event);
    });
    // this.previewElement.style.pointerEvents = 'none';
    document.body.appendChild(this.previewElement);

    const event = new CustomEvent('boxInitialized', {
      detail: {}
    });
    this.dispatchEvent(event);

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

        this.previewElement.style.display = (x < boundingRect.right) ? 'block' : 'none';
        this.previewElement.style.left = boundedLeft + 'px';
        this.previewElement.style.top = boundedTop + 'px';
        this.previewElement.style.width = boundedWidth + 'px';
        this.previewElement.style.height = boundedHeight + 'px';
        this.previewElement.style.boxSizing = 'border-box';

        this.previewElement.style.borderRight = right > boundingRect.right ? 'none' : this.border;
        this.previewElement.style.borderLeft = x < boundingRect.x ? 'none' : this.border;
        this.previewElement.style.borderTop = y < boundingRect.y ? 'none' : this.border;
        this.previewElement.style.borderBottom = bottom > boundingRect.bottom ? 'none' : this.border;

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