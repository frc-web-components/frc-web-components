import { LitElement, html, css } from 'lit-element';
import Wom from './wom';
import './wom-viewer';
import './wom-preview-box';
import './tools-bottom';
import './wom-new-element-preview';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
      fullscreen: { type: Boolean, reflect: true },
      selectedNode: { type: Object, attribute: false },
      selectedNodeMethod: { type: String, attribute: false },
      previewedNode: { type: Object, attribute: false },
      selectedComponent: { type: String, attribute: 'selected-component', reflect: true },
      toolsTopElement: { type: Object },
      elementPreviewAdjacentNode: { type: Object },
      elementPreviewPlacement: { type: String }

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
 
      [part=editor] {
        height: 100%;
      }

      [part=tools-container] {
        position: relative;
        min-width: 350px;
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
    this.selectedNodeMethod = '';
    this.dashboardNode = null;
    this.selectedComponent = '';
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

  updated(changedProperties) {
    if (changedProperties.has('editMode')) {
      if (!this.editMode) {
        if (this.wom) {
          this.wom.destroy();
        }
      } else {
        this.wom = new Wom(this);
        this.dashboardNode = this.shadowRoot.querySelector('[part=dashboard]');
        this.toolsTopElement = this.shadowRoot.querySelector('[part="tools-top"]');
        this.requestUpdate();
      }
    }
  }

  onKeyDown(ev) {
    // Toggle edit mode
    if (this.fullscreen && ev.shiftKey && ev.code === 'KeyE') {
      this.editMode = !this.editMode;
      this.selectedNode = null;
      this.selectedNodeMethod = '';
      this.selectedComponent = '';
    }

    if(ev.key === "Escape") {
      this.selectedNode = null;
      this.selectedNodeMethod = '';
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

  onDashboardWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;
    this.selectedNodeMethod = 'dashboard';
  }

  onWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;
    this.selectedNodeMethod = 'womViewer';
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

  onWomNodeAddElementPreview(ev) {
    const { node, before } = ev.detail;
    const placement = before ? 'before' : 'after';
    if (
      node !== this.elementPreviewAdjacentNode ||
      placement !== this.elementPreviewPlacement
    ) {
    this.elementPreviewAdjacentNode = node;
    this.elementPreviewPlacement = placement;
    }
  }

  onWomNodePrependElementPreview(ev) {
    const { node } = ev.detail;
    this.elementPreviewAdjacentNode = node;
    this.elementPreviewPlacement = 'inside';
  }

  onDashboardToolsTabChange() {
    this.selectedComponent = '';
  }

  onDashhboardComponentSelected(ev) {
    const { name } = ev.detail;
    this.selectedComponent = name;
  }
  
  onWomNodeAdd() {
    this.selectedComponent = '';
  }

  render() {
    return html`
      ${this.editMode ? html`
        <vaadin-split-layout part="editor" theme="small">
          <div 
            part="dashboard"
            @womNodeMouseenter="${this.onWomNodeMouseenter}"
            @womNodeMouseleave="${this.onWomNodeMouseleave}"
            @womNodeSelect="${this.onDashboardWomNodeSelect}"
            style="width: 70%"
          >
            <wom-preview-box
              .parentNode="${this.dashboardNode}"
              .previewedNode="${this.previewedNode}"
              .selectedNode="${this.selectedNode}"
            ></wom-preview-box>
            <wom-new-element-preview
              .selectedComponent="${this.selectedComponent}"
              .selectedNode="${this.selectedNode}"
              .selectedNodeMethod="${this.selectedNodeMethod}"
              .adjacentNode="${this.elementPreviewAdjacentNode}"
              placement="${this.elementPreviewPlacement}"
              @womNodeAdd="${this.onWomNodeAdd}"
              .parentNode="${this.dashboardNode}"
            ></wom-new-element-preview>
            <slot></slot>
          </div>
          <div part="tools-container" style="width: 30%">
            <div part="tools">
              <div part="top-menu"></div>
              <vaadin-split-layout part="tools-splitter" theme="small" orientation="vertical">
                <div part="tools-top" style="height: 40%">
                  <div part="wom">
                    ${this.wom ? html`
                      <wom-viewer
                        @womNodeSelect="${this.onWomNodeSelect}"
                        @womSlotNodeSelect="${this.onWomNodeSelect}"
                        @womNodePreview="${this.onWomNodePreview}"
                        @womNodePreviewEnd="${this.onWomNodePreviewEnd}"
                        @womNodeAddElementPreview="${this.onWomNodeAddElementPreview}"
                        @womNodePrependElementPreview="${this.onWomNodePrependElementPreview}"
                        level="${0}" 
                        .node="${this.wom.getRootNode()}"
                        .selectedNode="${this.selectedNode}"
                        .container="${this.toolsTopElement}"
                        ?adding-element="${!!this.selectedComponent}"
                      ></wom-viewer>
                    ` : ''}
                  </div>
                </div>
                <dashboard-tools-bottom
                  part="tools-bottom"
                  style="height: 60%"
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