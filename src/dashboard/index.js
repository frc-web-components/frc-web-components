import { LitElement, html, css } from 'lit-element';
import Wom from './wom';
import './wom-viewer';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
      fullscreen: { type: Boolean, reflect: true },
      inspecting: { type: Boolean },
      selectedNode: { type: Object, attribute: false }
    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
      }

      :host([fullscreen]) [part=editor] {
        height: 100vh;
      }

      [part=editor] {
        height: 100%;
      }

      [part=tools-container] {
        position: relative;
        min-width: 300px;
      }

      [part=tools] {
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: scroll;
      }

      [part=top-menu] {
        width: 100%;
        background: #eee;
      }

      [part=top-menu] vaadin-button {
        color: black;
      }

      [part=top-menu] vaadin-button[inspecting] {
        color: blue;
      }

      [part=wom] {
        padding: 5px;
      }
    `
  }

  constructor() {
    super();
    this.wom = null;
    this.editMode = false;
    this.fullscreen = false;
    this.inspecting = false;
    this.selectedNode = null;
  }

  firstUpdated() {
    this.wom = new Wom(this);

    const css = document.createElement('style');
    css.type = 'text/css';
    const styles = 'body { margin: 0; }';

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));
    
    document.getElementsByTagName('head')[0].appendChild(css);

    document.body.addEventListener('keydown', ev => {
      this.onKeyDown(ev);
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('editMode')) {
      if (!this.editMode) {
        this.inspecting = false;
      }
    }
  }

  onKeyDown(ev) {
    // Toggle edit mode
    if (this.fullscreen && ev.shiftKey && ev.code === 'KeyE') {
      this.editMode = !this.editMode;
      this.selectedNode = null;
    }

    if(ev.key === "Escape") {
      this.inspecting = false;
      this.selectedNode = null;
    }
  }

  onInspect() {
    this.inspecting = true;
  }

  onWomNodeSelect(ev) {
    this.selectedNode = ev.detail.node;
  }

  render() {
    return html`
      ${this.editMode ? html`
        <vaadin-split-layout part="editor" theme="small">
          <div>
            <slot></slot>
          </div>
          <div part="tools-container">
            <div part="tools">
              <div part="top-menu">
                <vaadin-button 
                  ?inspecting="${this.inspecting}" 
                  theme="icon tertiary" 
                  @click="${this.onInspect}
                ">
                  <iron-icon icon="vaadin:area-select"></iron-icon>
                </vaadin-button>
              </div>
              <div part="wom">
                <wom-viewer
                  @womNodeSelect="${this.onWomNodeSelect}"
                  level="${0}" 
                  .node="${this.wom.getRootNode()}"
                  .selectedNode="${this.selectedNode}"
                ></wom-viewer>
              </div>

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