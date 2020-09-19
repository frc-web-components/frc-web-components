import { LitElement, html, css } from 'lit-element';
import './wom-preview-box';
import './wom-new-element-preview-box';
import Wom from '../wom';

class DashboardBuilder extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        width: 70%;
      }

      [part=edit-container] {
        position: relative;
      }

      [part=original-wom] {
        opacity: 0;
      }

      [part=copy-wom] {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }

    `;
  }

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
    if (changedProps.has('wom')) {
      if (!this.wom) {
        this.previewedNode = null;
      } else {
        this.wom.addListener('womNodePreview', (ev) => {
          this.previewedNode = ev.detail.node;
        });
        this.wom.addListener('womNodePreviewRemove', (ev) => {
          this.previewedNode = null;
        });
      }
    }
  }

  firstUpdated() {

    this.wom.addListener('womActionSelect', () => {
      this.requestUpdate();
    });

    this.wom.addListener('womActionDeselect', () => {
      this.requestUpdate();
    });

    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        const { addedNodes } = mutation;
        if (addedNodes.length > 0) {
          const editContainer = [...addedNodes].find(element => {
            return (
              element.nodeName === 'DIV'
              && element.getAttribute('part') === 'edit-container'
            );
          });
          if (editContainer) {
            const copyElement = editContainer.querySelector('[part=copy-wom]');
            this.wom.getRootNode().getChildren().forEach(womNode => {
              let clonedNode = womNode.getNode().cloneNode(true);
              copyElement.appendChild(clonedNode);
              const copyWom = new Wom(copyElement);
              copyWom.setDashboardElement(this);
              this.wom.setActionContext(this.wom.getSelectedActionId(), {
                copyWom
              });
            });
          }

        }
      }
    });
    observer.observe(this.shadowRoot, {
      childList: true,
      subtree: true,
    });
  }

  render() {
    return html`
      <wom-preview-box
        .wom="${this.wom}"
        .previewedNode="${this.previewedNode && this.previewedNode.getNode()}"
      ></wom-preview-box>
      <wom-new-element-preview-box
        .wom="${this.wom}"
      ></wom-new-element-preview-box>
      <div part="container">
        ${this.wom.getSelectedActionId() === 'addNode' ? html`
          <div part="edit-container">
            <div part="copy-wom">
            </div>
            <div part="original-wom">
              <slot></slot>
            </div>
          </div>
        ` : html`
          <slot></slot>
        `}
        
      </div>
    `;
  }
}

customElements.define('wom-dashboard-builder', DashboardBuilder);