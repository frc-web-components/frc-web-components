import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';
import WebbitDashboard from './dashboard';

class FrcDashboardBuilder extends WebbitDashboard {

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

    const script = this.getNtScript();
    script.onload = () => {
      const interval = setInterval(() => {
        if ('NetworkTables' in window && NetworkTables.isWsConnected()) {
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

  getNtScript() {
    const script = document.createElement('script');
    if (this.addressType === 'gitpod') {
      const addressPart = window.location.href.substring(12, window.location.href.length - 1);
      script.setAttribute('data-nt-host', `8888${addressPart}`);
      script.src = `https://8888${addressPart}/networktables/networktables.js`;
    } else {
      script.setAttribute('data-nt-host', 'localhost:8888');
      script.src = "http://localhost:8888/networktables/networktables.js";
    }
    return script;
  }
}


customElements.define('frc-dashboard-builder', FrcDashboardBuilder);
