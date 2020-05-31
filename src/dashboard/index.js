import { LitElement, html, css } from 'lit-element';
import Wom from './wom';
import './wom-viewer';
import './wom-preview-box';
import './tools-bottom';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
      fullscreen: { type: Boolean, reflect: true },
      selectedNode: { type: Object, attribute: false },
      previewedNode: { type: Object, attribute: false },
      previewX: { type: Number, attribute: false },
      previewY: { type: Number, attribute: false },
      previewWidth: { type: Number, attribute: false },
      previewHeight: { type: Number, attribute: false },
      selectedComponent: { type: String, attribute: 'selected-component', reflect: true }
    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
        position: relative;
      }

      :host([fullscreen]) [part=editor] {
        height: 100vh;
      }

      :host([selected-component]:not([selected-component=""])) [part=dashboard],
      :host([selected-component]:not([selected-component=""])) [part=dashboard] * {
        cursor: cell !important;
      }
 
      [part=editor] {
        height: 100%;
      }

      [part=tools-container] {
        position: relative;
        min-width: 300px;
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
        display: none;
      }

      [part=top-menu] vaadin-button {
        color: black;
      }


      [part=wom] {
        padding: 5px;
      }

      [part=previewed-node] {
        display: block;
        background: rgba(3, 132, 200, .4);
        position: absolute;
        top: var(--preview-top, 50px);
        left: var(--preview-left, 50px);
        width: var(--preview-width, 100px);
        height: var(--preview-height, 100px);
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
    this.fullscreen = false;
    this.selectedNode = null;
    this.dashboardNode = null;
    this.previewX = 0;
    this.previewY = 0;
    this.previewWidth = 0;
    this.previewHeight = 0;
    this.selectedComponent = '';
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


    const setPreviewBounds = () => { 
      if (this.editMode && this.previewedNode) {
        const boundingRect = this.dashboardNode.getBoundingClientRect();
        const { x, y, width, height } = this.previewedNode.getNode().getBoundingClientRect();
        this.previewX = Math.max(x, boundingRect.x);
        this.previewY = Math.max(y, boundingRect.y);
        this.previewWidth = Math.min(width, boundingRect.right - x);
        this.previewHeight = Math.min(height, boundingRect.height - y);
      }
      window.requestAnimationFrame(setPreviewBounds);
    };
    window.requestAnimationFrame(setPreviewBounds);
  }

  updated(changedProperties) {
    if (changedProperties.has('editMode')) {
      if (!this.editMode) {
        if (this.wom) {
          this.wom.destroy();
        }
      } else {
        this.wom = new Wom(this);
        this.dashboardNode = this.shadowRoot.querySelector('[part=dashboard]');
        this.requestUpdate();
      }
    }
  }

  onKeyDown(ev) {
    // Toggle edit mode
    if (this.fullscreen && ev.shiftKey && ev.code === 'KeyE') {
      this.editMode = !this.editMode;
      this.selectedNode = null;
      this.selectedComponent = '';
    }

    if(ev.key === "Escape") {
      this.selectedNode = null;
      this.selectedComponent = '';
    }
  }

  onWomNodeMouseenter(ev) {
    const { node } = ev.detail;
    if (!this.previewedNode || node.getLevel() >= this.previewedNode.getLevel()) {
      this.previewedNode = node;
    }
  }

  onWomNodeMouseleave(ev) {
    const { node } = ev.detail;
    if (this.previewedNode === node) {
      this.previewedNode = null;
    }
  }

  onWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;
  }

  onWomNodePreview(ev) {
    this.previewedNode = ev.detail.node;
  }

  onWomNodePreviewEnd(ev) {
    const { node } = ev.detail;
    if (this.previewedNode === node) {
      this.previewedNode = null;
    }
  }

  onDashboardToolsTabChange() {
    this.selectedComponent = '';
  }

  onDashhboardComponentSelected(ev) {
    const { name } = ev.detail;
    this.selectedComponent = name;
  }

  render() {
    return html`
      ${this.editMode ? html`
        <vaadin-split-layout part="editor" theme="small">
          <div 
            part="dashboard"
            @womNodeMouseenter="${this.onWomNodeMouseenter}"
            @womNodeMouseleave="${this.onWomNodeMouseleave}"
            @womNodeSelect="${this.onWomNodeSelect}"
          >
            ${this.previewedNode ? html`
              <wom-preview-box
                x="${this.previewX}"
                y="${this.previewY}"
                width="${this.previewWidth}"
                height="${this.previewHeight}"
              ></wom-preview-box>
            `: ''}
            <slot></slot>
          </div>
          <div part="tools-container">
            <div part="tools">
              <div part="top-menu"></div>
              <vaadin-split-layout part="tools-splitter" theme="small" orientation="vertical">
                <div part="tools-top">
                  <div part="wom">
                    ${this.wom ? html`
                      <wom-viewer
                        @womNodeSelect="${this.onWomNodeSelect}"
                        @womNodePreview="${this.onWomNodePreview}"
                        @womNodePreviewEnd="${this.onWomNodePreviewEnd}"
                        level="${0}" 
                        .node="${this.wom.getRootNode()}"
                        .selectedNode="${this.selectedNode}"
                      ></wom-viewer>
                    ` : ''}
                  </div>
                </div>
                  <dashboard-tools-bottom 
                    part="tools-bottom"
                    .selectedNode="${this.selectedNode}"
                    @dashboardToolsTabChange="${this.onDashboardToolsTabChange}"
                    @dashhboardComponentSelected="${this.onDashhboardComponentSelected}"
                    selected-component="${this.selectedComponent}"
                  >

                  </dashboard-tools-bottom>        
              </vaadin-split-layout>

            </div>
          </div>
        </vaadin-split-layout>
      `: html`
        <slot></slot>
      `}
    `;
  }
}

export default WebbitDashboard;