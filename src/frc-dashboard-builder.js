import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';
import WebbitDashboard from './dashboard';

class FrcDashboardBuilder extends WebbitDashboard {

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

    addSourceProvider('HALSim', 'HALSim', {
      address: this.address
    });
    addSourceProvider('NetworkTables', 'NetworkTables', {
      address: this.address
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
}


customElements.define('frc-dashboard-builder', FrcDashboardBuilder);
