import { LitElement, html, css } from '@webbitjs/webbit';

class WomSlotNode extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        font-size: 15px;
      }

      :host([adding-element]) header:hover, 
      :host([adding-element]) header:hover .key, 
      :host([adding-element]) header:hover .key label {
        cursor: cell;
      }

      :host([adding-element]) header:hover .key {
        box-shadow: 0px 8px 0px 0px #87b187
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
      parentNode: { type: Object },
      slot: { type: String },
      level: { type: Number },
    };
  }

  constructor() {
    super();
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

  onAddElementPreview() {
    const event = new CustomEvent('womNodePrependElementPreview', {
      bubbles: true,
      composed: true,
      detail: {
        node: this.parentNode,
        slot: this.slot,
      }
    });
    this.dispatchEvent(event);
  }

  onSelect() {
    const event = new CustomEvent('womSlotNodeSelect', {
      bubbles: true,
      composed: true,
      detail: {
        node: this.parentNode,
        slot: this.slot
      }
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="node">
        <header 
          @mousemove="${this.onAddElementPreview}" 
          @click="${this.onSelect}"
        >
          <span class="key">
            <label>${this.slot}</label>
          </span>
        </header>
      </div>
    `;
  }
}

customElements.define('wom-slot-node', WomSlotNode);