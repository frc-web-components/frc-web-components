import { LitElement, html, css } from 'lit-element';
import Wom from './wom';
import './wom-viewer';
import './tools-bottom';
import AddNode from './actions/add-node';
import RemoveNode from './actions/remove-node';
import './builder/index';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      wom: { type: Object },
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
      toolsTopElement: { type: Object },

    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
        position: relative;
      }

      :host(:not([edit-mode])) {
        min-height: 100vh;
      }

      :host [part=editor] {
        height: 100vh;
      }

      [part=container] {
        height: auto;
      }

      [part=tools-container] {
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


      [part=wom] {
        padding: 5px;
      }

      [part=tools-top], [part=tools-bottom] {
        min-height: 10%;
      }

      [part=tools-splitter] {
        height: 100%;
        flex: 1;
      }

      dashboard-tools-bottom {
        overflow: unset;
      }
    `
  }

  constructor() {
    super();
    this.wom = null;
    this.editMode = false;
    this.dashboardNode = null;
    this.newElementPreview = null;
    this.toolsTopElement = null;
    this.womViewerNode = null;
  }

  firstUpdated() {
    const css = document.createElement('style');
    css.type = 'text/css';
    const styles = 'body { margin: 0; }';

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));
    
    document.getElementsByTagName('head')[0].appendChild(css);

    document.body.addEventListener('keydown', ev => {
      this.onKeyDown(ev);
    });

    this.addEventListener('womChange', () => {
      if (!this.womViewerNode) {
        this.womViewerNode = this.shadowRoot.querySelector('wom-viewer');
      }
      this.womViewerNode.requestUpdate();
    });
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

  updated(changedProperties) {
    if (changedProperties.has('editMode')) {
      if (!this.editMode) {
        if (this.wom) {
          this.wom.destroy();
        }
      } else {
        this.dashboardNode = this.shadowRoot.querySelector('[part=dashboard]');
        this.toolsTopElement = this.shadowRoot.querySelector('[part="tools-top"]');
        this.wom = new Wom(this, this.dashboardNode);
        this.addWomListeners();

        // add actions
        this.wom.addAction('addNode', new AddNode());
        this.wom.addAction('removeNode', new RemoveNode());
      }
    }
  }

  onKeyDown(ev) {
    // Toggle edit mode
    if (ev.shiftKey && ev.code === 'KeyE') {
      this.editMode = !this.editMode;
    }

    if(ev.key === "Escape") {
      if (this.wom.getSelectedActionId()) {
        this.wom.deselectAction();
      } else {
        this.wom.deselectNode();
      }
    }
  }

  onWomNodePreview(ev) {
    this.wom.previewNode(ev.detail.node);
  }

  onWomNodePreviewEnd(ev) {
    const { node } = ev.detail;
    if (this.wom.getPreviewedNode() === node) {
      this.wom.removeNodePreview();
    }
  }
  
  onRemoveElement() {
    this.wom.selectAction('removeNode');
  }

  render() {
    return html`
      ${this.editMode ? html`
        <vaadin-split-layout part="editor" theme="small">
          <wom-dashboard-builder part="dashboard" .wom="${this.wom}">
            <slot></slot>
          </wom-dashboard-builder>
          <div part="tools-container" style="width: 30%">
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
                        @womNodePreview="${this.onWomNodePreview}"
                        @womNodePreviewEnd="${this.onWomNodePreviewEnd}"
                        .node="${this.wom.getRootNode()}"
                        .selectedNode="${this.wom ? this.wom.getSelectedNode() : null}"
                        .container="${this.toolsTopElement}"
                        ?adding-element="${this.wom && this.wom.getSelectedActionId() === 'addNode'}"
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
          </div>
        </vaadin-split-layout>
      `: html`
        <div part="container">
          <slot></slot>
        </div>
      `}
    `;
  }
}

export default WebbitDashboard;