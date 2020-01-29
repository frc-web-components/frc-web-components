import NetworkTables from './networktables';
import { SourceProvider, storage, store } from '@lit-dashboard/lit-dashboard';
import { clearSources } from '@lit-dashboard/lit-dashboard/actions';


export default class NetworkTablesProvider extends SourceProvider {

	static get typeName() {
		return 'NetworkTables';
	}

	// static get settingsElement() {
	// 	//return SettingsElement;
	// }

	static get settingsDefaults() {
		return {
			address: 'localhost'
		};
	}

	constructor(settings) {
		super();
		this.address = storage.get('robotAddress', settings.address);
		
		// Keep trying to connect if a connection hasn't been found
    setInterval(() => {
      if (!NetworkTables.isRobotConnected()) {
        NetworkTables.connect(this.address);
      }
    }, 500);

    NetworkTables.addRobotConnectionListener(connected => {
      store.dispatch(clearSources('NetworkTables'));
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
