import { LitElement, html } from '@webbitjs/webbit';
import { addSourceProvider, setDefaultSourceProvider } from '@webbitjs/store';

class FrcDashboard extends LitElement {

  firstUpdated() {
    addSourceProvider('NetworkTables', 'NetworkTables');
    setDefaultSourceProvider('NetworkTables');
    
    const script = document.createElement('script');
    script.setAttribute('data-nt-host', 'localhost:8888');
    script.src = "http://localhost:8888/networktables/networktables.js";
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define('frc-dashboard', FrcDashboard);