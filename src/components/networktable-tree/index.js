import { Webbit, html, css } from '@webbitjs/webbit';
import './source-view';
import { subscribe, getRawSource } from '@webbitjs/store';

class NetworkTableTree extends Webbit {

  static get properties() {
    return {
      sources: { type: Object, reflect: false }
    };
  }

  static get styles() {
    return css`
      :host {
        margin: 5px;
        display: inline-block;
        padding: 0px 13px;
        box-sizing: border-box;
        overflow: auto;
        width: 350px;
        height: auto;
        font-family: sans-serif;
      }
      header {
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #bbb;
        user-select: none;
        padding: 3px 0;
      }
      header span {
        display: inline-block;
      }
      header .key {
        width: 60%;
      }
      header .value {
        width: 35%;
      }
    `
  }

  constructor() {
    super();
    this.sources = { __sources__: {} };
    this.providerName = null;
    this.unsubscribe = () => {};
  }

  updated(changedProperties) {
    if (changedProperties.has('sourceKey') || changedProperties.has('sourceProvider')) {
      if (this.sourceProvider) {
        this.unsubscribe();
        this.unsubscribe = subscribe(this.sourceProvider, this.sourceKey || '', value => {
          this.sources = getRawSource(this.sourceProvider, this.sourceKey || '') || { __sources__: {} };
          this.requestUpdate();
        }, true);
      }
    }
  }

  getLabel(name) {
    if (!name) {
      return '';
    }

    const parts = name.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }

  render() {
    return html`
      <header>
        <span class="key">Key</span>
        <span class="value">Value</span>
      </header>
      ${Object.entries(this.sources.__sources__).map(([name, source]) => html`
        <source-view 
          label="${this.getLabel(source.__key__)}" 
          provider-name="${this.providerName}"
          .source="${{...source}}"
        >
        </source-view>
      `)}
    `;
  }

}

webbitRegistry.define('frc-networktable-tree', NetworkTableTree);