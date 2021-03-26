import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';
import {  sourceProviderAdded, hasSourceProvider } from '@webbitjs/store';

class NetworkTablesConnection extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'NetworkTables Connection',
      category: 'Connection',
      description: 'Shows the connection state of NetworkTables',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 200 },
      editorTabs: [],
    };
  }

  static get properties() {
    return {
      isWsConnected: { type: Boolean, attribute: false },
      isRobotConnected: { type: Boolean, attribute: false },
      robotAddress: { type: String, attribute: false   }
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        flex-wrap: wrap;
        font-family: sans-serif;
        font-size: 16px;
      }

      p {
        margin: 0;
        margin-right: 10px;
        margin-bottom: 5px; 
      }

      .connected {
        color: green;
      }

      .disconnected {
        color: red;
      }

      .robot-address {
        color: purple;
      }
    `;
  }

  constructor() {
    super();
    this.isWsConnected = false;
    this.isRobotConnected = false;
    this.robotAddress = '';
  }

  setRobotAddress() {
    this.robotAddress = localStorage.networkTablesAddress || NetworkTables.getRobotAddress() || 'Unknown';
  }

  subscribeToNetworkTables() {
    NetworkTables.addWsConnectionListener(connected => {
      this.isWsConnected = connected;
      this.setRobotAddress();
    }, true);

    NetworkTables.addRobotConnectionListener(connected => {
      this.isRobotConnected = connected;
      this.setRobotAddress();
    }, true);

    window.addEventListener('storage', () => {
      this.setRobotAddress();
    });
  }

  firstUpdated() {
    this.setRobotAddress();
    
    if (hasSourceProvider('NetworkTables')) {
      this.subscribeToNetworkTables();
    } else {
      sourceProviderAdded(providerName => {
        if (providerName === 'NetworkTables') {
          this.subscribeToNetworkTables();
        }
      });
    }
  }

  renderConnected(isConnected) {
    if (isConnected) {
      return html`<span class="connected">Connected</span>`;
    }

    return html`<span class="disconnected">Disconnected</span>`;
  }

  renderRobotAddress() {
    return html`<span class="robot-address">${this.robotAddress}</span>`;
  }

  render() {
    return html`
      <p>Websocket: ${this.renderConnected(this.isWsConnected)}</p>
      <p>Robot: ${this.renderConnected(this.isRobotConnected)}</p>
      <p>Robot Address: ${this.renderRobotAddress()}</p>
    `;
  }
}

define('frc-networktables-connection', NetworkTablesConnection);