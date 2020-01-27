import { Widget, html, css } from '@lit-dashboard/lit-dashboard';
import { registerWidget } from '@lit-dashboard/lit-dashboard/app';
import '@google/model-viewer';

class ModelViewer extends Widget {

  static get styles() {
    return css`
      :host { 
        display: block; 
        width: 500px;
        height: 500px;
      }

      model-viewer {
        display: block;
        width: var(--model-width, 0);
        height: var(--model-height, 0);
      }
    `;
  }

  static get properties() {
    return {
      src: { type: String }
    };
  }

  constructor() {
    super();
    
  }

  updated() {
    
  }

  onModelLoad() {
    const modelNode = this.shadowRoot.querySelector('model-viewer');

    modelNode.style.setProperty('--model-width', '100%');
    modelNode.style.setProperty('--model-height', '100%');

  }

  render() {

    return html`
        <model-viewer 
          @load="${this.onModelLoad}"
          src="${this.src}" 
          alt="A 3D model of an astronaut"
          auto-rotate
          camera-controls
          background-color="lightgray"
        >
        </model-viewer>
    `;
  }
}

registerWidget('cad-viewer', {
  class: ModelViewer,
  label: 'CAD Viewer',
  category: 'FRC',
  acceptedTypes: ['String'],
});