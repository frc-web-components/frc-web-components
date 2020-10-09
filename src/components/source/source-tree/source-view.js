import { LitElement, html, css } from '@webbitjs/webbit';

class SourceView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
      }
      
      header {
        border-bottom: 1px solid rgb(187, 187, 187);
        padding: 3px 0;
        display: flex;
        justify-content: space-around;
      }
      header:hover {
        background-color: #6495ed;
      }
      header .key {
        width: 60%;
        display: flex;
        white-space: nowrap;
      }
      header .value {
        width: 35%;
        overflow: auto;
        white-space: nowrap;
        display: inline-block;
      }
      header .key, header .value {
        box-sizing: border-box;
      }
      header .value {
        overflow: auto;
      }
      header .key .caret + label {
        padding-top: 2px;
        padding-left: 3px;
      }
      header .key label {
        overflow: auto;
        white-space: nowrap;
        text-overflow: clip;
        padding-left: 8px;
      }
      header .key label::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .value::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .type::-webkit-scrollbar { 
        width: 0 !important;
        height: 0 !important;
      }
      header .key {
        padding-left: var(--header-key-padding-left);
      }
      header .caret [icon] {
        cursor: pointer;
        font-size: 11px;
        display: none;
        width: 15px;
        height: auto;
      }
      header.expanded .caret [icon$="angle-down"] {
        display: inline-block;
      }
      header.collapsed .caret [icon$="angle-right"] {
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      label: { type: String },
      providerName: { type: String, attribute: 'provider-name' },
      source: { type: Object },
      level: { type: Number }
    };
  }

  constructor() {
    super();
    this.expanded = false;
    this.label = '';
    this.providerName = '';
    this.source = {};
    this.level = 0;
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.requestUpdate();
  }

  hasSources() {
    const sources = this.source.__sources__;
    return sources && Object.keys(sources).length  > 0;
  }

  hasValue() {
    const value = this.source.__value__;
    return typeof value !== 'undefined';
  }

  firstUpdated() {
    super.firstUpdated();
    const headerNode = this.shadowRoot.querySelector('header');
    headerNode.style.setProperty(
      '--header-key-padding-left', 
      `${12 * this.level}px`
    );
  }

   getLabel(name) {
    if (!name) {
      return '';
    }

    const parts = name.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }


  renderValue() {
    const value = this.source.__value__;

    if (typeof value === 'boolean') {
      return html`
        <input disabled type="checkbox" ?checked="${value}" />
        <label>${value.toString()}</label>
      `;
    } else if (typeof value === 'string') {
      return html`
        "${value}"
      `;
    } else if (typeof value === 'number') {
      return html`
        ${value}
      `;
    } else if (value instanceof Array) {
      return html`
        [${value.join(', ')}]
      `;
    }

    return html``;
  }

  render() {

    return html`
      <div class="source">
        <header class="${this.expanded ? 'expanded' : 'collapsed'}">
          <span class="key" title="${this.label}">
            ${this.hasSources() ? html`
              <span class="caret" @click="${this.toggleExpand}">
                <iron-icon icon="vaadin:angle-right"></iron-icon>
                <iron-icon icon="vaadin:angle-down"></iron-icon>
              </span>
            `: ''}
            <label>${this.label}</label>
          </span>
          <span class="value">
            ${this.hasValue() ? this.renderValue() : ''}
          </span>
        </header>
        ${this.hasSources() && this.expanded ? html`
          <div class="sources">
            ${Object.entries(this.source.__sources__).map(([name, source]) => html`
              <source-view 
                label="${this.getLabel(source.__key__)}" 
                provider-name="${this.providerName}"
                .source="${{...source}}"
                level="${this.level + 1}"
              >
              </source-view>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }

}

customElements.define('source-view', SourceView);