import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';
import { LitElement, html } from 'lit-element';

class FrcDashboard extends LitElement {

  static get properties() {
    return {
      ...super.properties,
      address: { type: String, attribute: 'address', reflect: true },
    };
  }

  constructor() {
    super();
    this.address = 'localhost';
  }

  firstUpdated() {
    super.firstUpdated();

    if (!localStorage.robotAddress) {
      localStorage.robotAddress = this.address;
    }

    addSourceProvider('HALSim', 'HALSim', {
      address: localStorage.robotAddress
    });
    addSourceProvider('NetworkTables', 'NetworkTables', {
      address: localStorage.robotAddress
    });
    addSourceProvider('Gamepad', 'Gamepad');
    setDefaultSourceProvider('NetworkTables');

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