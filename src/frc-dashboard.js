import { LitElement, html } from '@webbitjs/webbit';
import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';

class FrcDashboard extends LitElement {

  constructor() {
    super();

    addSourceProvider('NetworkTables', 'NetworkTables');
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

  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define('frc-dashboard', FrcDashboard);