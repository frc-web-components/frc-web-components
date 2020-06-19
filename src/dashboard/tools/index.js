import { LitElement, html, css } from 'lit-element';
import './tools-bottom';
import './wom-viewer';

class WomTools extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        width: 30%;
        position: relative;
        min-width: 400px;
        z-index: 2;
      }

      [part=tools] {
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: scroll;
        display: flex;
        flex-direction: column;
      }

      [part=top-menu] {
        width: 100%;
        background: #eee;
        display: block;
      }

      [part=top-menu] vaadin-button {
        color: black;
      }

      [part=tools-top], [part=tools-bottom] {
        min-height: 10%;
      }

      [part=tools-top] {
        margin: 5px;
      }

      [part=tools-splitter] {
        height: 100%;
        flex: 1;
      }

      dashboard-tools-bottom {
        overflow: unset;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.toolsTopElement = null;
  }

  addWomListeners() {
    [
      'womNodeSelect', 'womNodeDeselect', 'womActionSelect',
      'womNodeTarget', 'womActionDeselect', 'womActionExecute',
      'womActionContextSet', 'womNodeAdd', 'womNodeRemove',
      'womChange', 'womNodePreview', 'womNodePreviewRemove'
    ].forEach(eventName => {
      this.wom.addListener(eventName, () => {
        this.requestUpdate();
      });
    });
  }
  
  firstUpdated() {
    this.toolsTopElement = this.shadowRoot.querySelector('[part="tools-top"]');
  }

  updated(changedProps) {
    if (changedProps.has('wom') && this.wom) {
      this.addWomListeners();
      this.wom.addListener('womChange', () => {
        if (!this.womViewerNode) {
          this.womViewerNode = this.shadowRoot.querySelector('wom-viewer');
        }
        this.womViewerNode.requestUpdate();
      });
    }
  }

  onRemoveElement() {
    this.wom.selectAction('removeNode');
  }

  render() {
    return html`
      <div part="tools">
        <div part="top-menu">
          <vaadin-button 
            theme="icon tertiary" 
            aria-label="Remove element"
            @click="${this.onRemoveElement}"
          >
            <iron-icon icon="vaadin:trash"></iron-icon>
          </vaadin-button>
        </div>
        <vaadin-split-layout part="tools-splitter" theme="small" orientation="vertical">
          <div part="tools-top" style="height: 40%">
            <div part="wom">
              ${this.wom ? html`
                <wom-viewer
                  .wom="${this.wom}"
                  .node="${this.wom.getRootNode()}"
                  .selectedNode="${this.wom ? this.wom.getSelectedNode() : null}"
                  .container="${this.toolsTopElement}"
                  ?adding-element="${this.wom && this.wom.getSelectedActionId() === 'addNode'}"
                  level="0"
                ></wom-viewer>
              ` : ''}
            </div>
          </div>
          <dashboard-tools-bottom
            part="tools-bottom"
            style="height: 60%"
            .wom="${this.wom}"
          >
          </dashboard-tools-bottom>        
        </vaadin-split-layout>
      </div>
    `;
  }
}

customElements.define('dashboard-wom-tools', WomTools);