import { LitElement, html, css } from '@webbitjs/webbit';

class WomSlotNode extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        font-size: 15px;
      }
      
      header {
        padding: 3px 0;
        display: flex;
      }

      header .key {
        white-space: nowrap;
        width: 100%;
      }

      header .key, header .value {
        box-sizing: border-box;
      }
     
      header .key label {
        overflow: auto;
        white-space: nowrap;
        text-overflow: clip;
        padding-left: 2px;
        flex: 1;
        margin-top: 5px;
      }
      header .key label::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .type::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .key {
        margin-left: var(--header-key-margin-left);
        color: black;
        display: flex;
        font-size: 11px;
        font-weight: bold;
        letter-spacing: .7px;
        text-transform: uppercase;
      }
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      parentNode: { type: Object },
      slot: { type: String },
      level: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.parentNode = null;
    this.slot = '';
    this.level = 0;
  }

  firstUpdated() {
    this.headerNode = this.shadowRoot.querySelector('header');
    this.headerNode.style.setProperty(
      '--header-key-margin-left', 
      `${16 * this.level + 5}px`
    );

  }

  onSelect() {
    this.wom.selectNode(this.parentNode);
  }

  render() {
    return html`
      <div class="node">
        <header @click="${this.onSelect}">
          <span class="key">
            <label>${this.slot}</label>
          </span>
        </header>
      </div>
    `;
  }
}

customElements.define('wom-slot-node', WomSlotNode);