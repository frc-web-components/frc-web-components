import { html, css, LitElement } from '@webbitjs/webbit';
import { 
  sourceProviderAdded,
  getSourceProvider,
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

  firstUpdated() {
    sourceProviderAdded(providerName => {
      if (providerName === 'NetworkTables') {
        const provider = getSourceProvider(providerName);
        provider.addWsConnectionListener(connected => {
          this.networktablesConnected = connected;
        }, true);
      } else if (providerName === 'HALSim') {
        const provider = getSourceProvider(providerName);
        provider.addConnectionListener(connected => {
          this.halsimConnected = connected;
        }, true);
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