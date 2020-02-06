
import { SourceProvider, addSourceProviderType } from '@webbitjs/store';

//import { clearSources } from '@lit-dashboard/lit-dashboard/actions';


export default class NetworkTablesProvider extends SourceProvider {

	static get typeName() {
    return 'NetworkTables';
  }

  static get settingsDefaults() {
    return {
      address: 'localhost'
    };
  }

  constructor(settings) {
    super();
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
      //store.dispatch(clearSources('NetworkTables'));
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

  updateFromProvider(updateSource) {
    NetworkTables.addGlobalListener((key, value) => {
      updateSource(key, value);
    }, true);
  }

  updateFromDashboard(key, value) {
    NetworkTables.putValue(key, value);
  }
}

addSourceProviderType(NetworkTablesProvider);
