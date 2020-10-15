import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';
import { LitElement, html } from 'lit-element';

class FrcDashboard extends LitElement {

  static get properties() {
    return {
      ...super.properties,
      addressType: { type: String, attribute: 'address-type', reflect: true },
    };
  }

  constructor() {
    super();
    this.addressType = 'local';
  }

  firstUpdated() {
    super.firstUpdated();

    addSourceProvider('HALSim', 'HALSim', {
      addressType: this.addressType
    });
    addSourceProvider('NetworkTables', 'NetworkTables');
    addSourceProvider('Gamepad', 'Gamepad');
    setDefaultSourceProvider('NetworkTables');

    if (this.addressType === 'gitpod') {
      const addressPart = window.location.href.substring(12, window.location.href.length - 1);
      NetworkTables.init(`8888${addressPart}`);
    } else {
      NetworkTables.init('localhost:8888');
    }

    const interval = setInterval(() => {
      if (NetworkTables.isWsConnected()) {
        const event = new CustomEvent('load', {
          detail: {}
        });
        this.dispatchEvent(event);
        clearInterval(interval);
      }
    }, 500);
  }
  
  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define('frc-dashboard', FrcDashboard);