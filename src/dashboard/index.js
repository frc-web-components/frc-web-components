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
      selectedComponent: { type: String, attribute: 'selected-component', reflect: true },
      toolsTopElement: { type: Object }
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
    this.dashboardNode = null;
    this.selectedComponent = '';
    this.newElementPreview = null;
    this.toolsTopElement = null;
  }

  getChildNumber(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  }

  addNewElementPreview(insertedNode, node, before) {

    if (!node.parentNode) {
      return;
    }

    if (before) {
      node.parentNode.insertBefore(insertedNode, node);
    } else {
      node.parentNode.insertBefore(insertedNode, node.nextSibling);
    }
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


    const newElementPreview = document.createElement('div');
    newElementPreview.style.border = '2px dashed darkgreen';
    newElementPreview.style.opacity = '.5';

    this.newElementPreview = newElementPreview;
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

    if (changedProperties.has('selectedComponent')) {
      this.newElementPreview.innerHTML = '';
      if (this.selectedComponent) {
        this.newElementPreview.innerHTML = `
          <${this.selectedComponent}></${this.selectedComponent}>
        `;
        const newElement = this.newElementPreview.querySelector(this.selectedComponent);
        newElement.updateComplete.then(() => {
          this.newElementPreview.style.display = window.getComputedStyle(newElement).display;
        });
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

  onDashboardWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;
  }

  onWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;

    if (this.elementPreviewAdjacentNode) {
      const newElement = this.newElementPreview.querySelector(this.selectedComponent);
      const { node, before } = this.elementPreviewAdjacentNode;
      this.addNewElementPreview(newElement, node.node, before);
      this.newElementPreview.remove();
      this.selectedComponent = '';
    }
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
    if (this.selectedComponent) {
      const { node, before } = ev.detail;

      if (
        !this.elementPreviewAdjacentNode || 
        this.elementPreviewAdjacentNode.node !== node ||
        this.elementPreviewAdjacentNode.before !== before
      ) {
        this.elementPreviewAdjacentNode = { before, node };
        this.addNewElementPreview(this.newElementPreview, node.node, before);
      }
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
            @womNodeSelect="${this.onDashboardWomNodeSelect}"
            style="width: 70%"
          >
            <wom-preview-box
              .parentNode="${this.dashboardNode}"
              .previewedNode="${this.previewedNode}"
              .selectedNode="${this.selectedNode}"
            ></wom-preview-box>
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
                        @womNodePreview="${this.onWomNodePreview}"
                        @womNodePreviewEnd="${this.onWomNodePreviewEnd}"
                        @womNodeAddElementPreview="${this.onWomNodeAddElementPreview}"
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