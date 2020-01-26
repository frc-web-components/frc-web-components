import { ProviderSettings, html, css } from '@lit-dashboard/lit-dashboard';
import NetworkTables from './networktables';

export default class NetworkTablesSettings extends ProviderSettings {

  static get styles() {
    return css`
      vaadin-text-field {
        padding-top: 3px;
      }
    `
  }

  static get properties() { 
    return {
      robotIp: { type: String }
    };
  }

  constructor() {
    super();

  }

  onAddressChange(ev) {
    this.settings.address = ev.target.value;
    dashboard.store.dispatch(dashboard.actions.clearSources('NetworkTables'));
    NetworkTables.connect(this.settings.address);
    dashboard.storage.set('robotAddress', this.settings.address);
  };

  render() {
    return html`
      <vaadin-text-field 
        label="Server"
        .value="${this.settings.address}"
        @change="${this.onAddressChange}"
      ></vaadin-text-field>
    `;
  }
}
