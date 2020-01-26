import { isString, isNumber, isBoolean, isArray } from 'lodash';
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
			if (key.endsWith('/.type')) {
				updateSource(key, {
					value,
					type: 'String'
				});
				updateSource(key.substring(0, key.length - 6), {
					type: value,
				});
			} else if (key.endsWith('/.name')) {
				updateSource(key, {
					value,
					type: 'String'
				});
				updateSource(key.substring(0, key.length - 6), {
					name: value
				});
			} else {
				let primitiveType;

				if (isBoolean(value)) {
					primitiveType = 'Boolean';
				} else if (isString(value)) {
					primitiveType = 'String'
				} else if (isNumber(value)) {
					primitiveType = 'Number';
				} else if (isArray(value)) {
					primitiveType = 'Array';
				}

				const type = NetworkTables.getValue(`${key}/.type`) || primitiveType;
				const name = NetworkTables.getValue(`${key}/.name`);
				updateSource(key, {
          value,
          type,
          name
        });
			}
	  }, true);
	}

	updateFromDashboard(key, value) {
		NetworkTables.putValue(key, value);
  }
}
