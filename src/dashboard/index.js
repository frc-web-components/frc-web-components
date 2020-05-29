import { LitElement, html, css } from 'lit-element';
import Wom from './wom';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
      fullscreen: { type: Boolean, reflect: true },
      inspecting: { type: Boolean }
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
    `
  }

  constructor() {
    super();
    this.wom = null;
    this.editMode = false;
    this.fullscreen = false;
    this.inspecting = false;
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
      console.log('...');
      this.editMode = !this.editMode;
    }

    if(ev.key === "Escape") {
      this.inspecting = false;
    }
  }

  onInspect() {
    this.inspecting = true;
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