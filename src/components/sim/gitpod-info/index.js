import { html, css, LitElement } from '@webbitjs/webbit';
import { 
  sourceProviderAdded,
  getSourceProvider,
  hasSourceProvider
} from '@webbitjs/store';
 

class GitpodInfo extends LitElement {

  static get styles() {
    return css`
      :host {
        padding: 5px 10px;
        display: flex;
        font-family: sans-serif;
        align-items: center;
        border-bottom: 1px solid #eee;
        margin-bottom: 5px;
      }

      vaadin-button {
        margin-right: 15px;
      }

      [part=connection] {
        margin-right: 15px;
      }

      .connected {
        color: green;
      }

      .disconnected {
        color: red;
      }
    `;
  }

  static get properties() {
    return {
      networktablesConnected: { type: Boolean },
      halsimConnected: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.networktablesConnected = false;
    this.halsimConnected = false;
  }

  addNtConnectionListener() {
    if (hasSourceProvider('NetworkTables')) {
      const provider = getSourceProvider('NetworkTables');
        provider.addWsConnectionListener(connected => {
          this.networktablesConnected = connected;
      }, true);
    }
  }

  addHalSimConnectionListener() {
    if (hasSourceProvider('HALSim')) {
      const provider = getSourceProvider('HALSim');
        provider.addConnectionListener(connected => {
          this.halsimConnected = connected;
      }, true);
    }
  }

  firstUpdated() {
    this.addNtConnectionListener();
    this.addHalSimConnectionListener();
    sourceProviderAdded(providerName => {
      if (providerName === 'NetworkTables') {
        this.addNtConnectionListener();
      } else if (providerName === 'HALSim') {
        this.addHalSimConnectionListener();
      }
    });
  }

  render() {
    return html`
      <vaadin-button theme="contrast small">
        <iron-icon icon="vaadin:rocket" slot="prefix"></iron-icon>
        Deploy Robot Code
      </vaadin-button>
      <vaadin-button theme="contrast small">
        <iron-icon icon="vaadin:building" slot="prefix"></iron-icon>
        Build Robot Code
      </vaadin-button>
      <div part="connection">
        Robot Simulator:
        ${this.halsimConnected ? html`
          <span class="connected">Connected</span>
        ` : html`
          <span class="disconnected">Disconnected</span>
        `}
      </div>
      <div part="connection">
        NetworkTables:
        ${this.networktablesConnected ? html`
          <span class="connected">Connected</span>
        ` : html`
          <span class="disconnected">Disconnected</span>
        `}
      </div>
    `;
  }
}

customElements.define('frc-sim-gitpod-info', GitpodInfo);