
import { SourceProvider, addSourceProviderType } from '@webbitjs/store';

export default class NetworkTablesProvider extends SourceProvider {

	static get typeName() {
    return 'NetworkTables';
  }

  static get settingsDefaults() {
    return {
      address: 'localhost'
    };
  }

  constructor(providerName, settings) {
    super(providerName);
    this.address = localStorage.robotAddress || settings.address;
    
    if ('connect' in NetworkTables) {
      // Keep trying to connect if a connection hasn't been found
      setInterval(() => {
        if (!NetworkTables.isRobotConnected()) {
          NetworkTables.connect(this.address);
        }
      }, 500);
    }

    NetworkTables.addRobotConnectionListener(connected => {
      if (!connected) {
        this.clearSources();
      }
    }, true);

    NetworkTables.addGlobalListener((key, value) => {
      this.updateSource(key, value);
    }, true);
  }

  get settings() {
    return {
      address: this.address
    }
  }

  onSettingsChange(settings) {
    this.address = settings.address;
  }

  updateFromDashboard(key, value) {
    NetworkTables.putValue(key, value);
  }
}

addSourceProviderType(NetworkTablesProvider);
