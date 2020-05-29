import { LitElement, html, css } from 'lit-element';

class DashboardToolsBottom extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }

      vaadin-tabs {
        background: rgba(200,200,200,.3);
        box-shadow: none;
      }

      vaadin-tab {
        color: #555;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <vaadin-tabs theme="small">
        <vaadin-tab>Components</vaadin-tab>
        <vaadin-tab>Properties</vaadin-tab>
        <vaadin-tab>Sources</vaadin-tab>
        <vaadin-tab>Styles</vaadin-tab>
      </vaadin-tabs>
    `;
  }
}

customElements.define('dashboard-tools-bottom', DashboardToolsBottom);