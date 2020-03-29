
import { SourceProvider, addSourceProviderType } from '@webbitjs/store';

const getType = (value) => {
  if (['number', 'boolean', 'string'].includes(typeof value)) {
    return typeof value;
  }
  if (value instanceof Array) {
    const [element] = value;
    if (['number', 'boolean', 'string'].includes(typeof element)) {
      return typeof `${typeof element}Array`;
    }
  }
  return null;
};

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
    this.updatedEntriesBeforeReady = [];
    this.ntReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if ('NetworkTables' in window) {
          resolve();
          clearInterval(interval);
        }
      }, 500);
    });
    
    this.ntReady.then(() => {
      const ntKeys = NetworkTables.getKeys();
      this.updatedEntriesBeforeReady.forEach(key => {
        if (!ntKeys.includes(key)) {
          NetworkTables.putValue(key, this.getSource(key));
        }
      });

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
    });
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
    if ('NetworkTables' in  window) {
      NetworkTables.putValue(key, value);
    } else {
      const currentValue = this.getSource(key);
      const currentType = getType(currentValue);
      const updatedType = getType(value);
      
      // put in if it's new and it's valid
      if (!currentType && updatedType) {
        this.updateSource(key, value);
      }

      // Don't update if type isn't valid
      if (!updatedType) {
        return;
      }

      // make sure current value type matches value passed in
      if (currentType === updatedType) {
        this.updateSource(key, value);
      }
    }
  }
}

addSourceProviderType(NetworkTablesProvider);
