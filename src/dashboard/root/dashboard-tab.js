import { css, html, LitElement } from 'lit';

class DashboardTab extends LitElement {
  static styles = css`
    :host {
      display: none;
      width: 100%;
      height: 100%;
      // overflow: auto;
      position: relative;
    }

    ::slotted(*) {
      position: absolute;
    }

    :host([selected]) {
      display: block;
    }

    :host(:before) {
      display: block;
      width: 2000px;
      height: 1px;
      content: ' ';
    }
  `;

  static properties = {
    tabName: { type: String, attribute: 'tab-name', reflect: true },
  };

  render() {
    return html` <slot></slot> `;
  }
}

customElements.define('dashboard-tab', DashboardTab);
