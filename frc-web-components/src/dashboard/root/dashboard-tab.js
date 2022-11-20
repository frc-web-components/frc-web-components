import { css, html, LitElement } from 'lit';

class DashboardTab extends LitElement {
  static styles = css`
    :host {
      display: none;
      width: 100%;
      height: 100%;
    }

    ::slotted(*) {
      position: absolute;
    }

    :host([selected]) {
      display: block;
    }
  `;

  static properties = {
    tabName: { type: String, attribute: 'tab-name', reflect: true },
  };

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('dashboard-tab', DashboardTab);
