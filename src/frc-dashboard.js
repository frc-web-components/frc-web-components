import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';
import WebbitDashboard from './dashboard';

class FrcDashboard extends WebbitDashboard {

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

    const script = document.createElement('script');
    script.setAttribute('data-nt-host', 'localhost:8888');
    script.src = "http://localhost:8888/networktables/networktables.js";
    script.onload = () => {
      const interval = setInterval(() => {
        if (NetworkTables.isWsConnected()) {
          const event = new CustomEvent('load', {
            detail: {}
          });
          this.dispatchEvent(event);
          clearInterval(interval);
        }
      }, 500);
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

customElements.define('frc-dashboard', FrcDashboard);