
import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import './nt-boolean';
import './nt-number';
import './nt-string';
import './nt-boolean-array';
import './nt-number-array';
import './nt-string-array';
import './nt-robot-connection';
import './nt-global-listener';

const getType = (value) => {
  if (['number', 'boolean', 'string'].includes(typeof value)) {
    return typeof value;
  }
  if (value instanceof Array) {
    const [element] = value;
    if (['number', 'boolean', 'string'].includes(typeof element)) {
      return `${typeof element}Array`;
    } else {
      return 'Array';
    }
  }
  return '';
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
    super(providerName, settings);
    this.address = localStorage.robotAddress || settings.address;
    this.updatedEntriesBeforeReady = [];
    this.isNtReady = false;
    this.ntReady = new Promise(resolve => {
      const interval = setInterval(() => {
        if (
          'NetworkTables' in window && 
          ('isWsConnected' in NetworkTables ? NetworkTables.isWsConnected() : true)
        ) {
          this.isNtReady = true;
          resolve();
          clearInterval(interval);
        }
      }, 500);
    });
    
    this.ntReady.then(() => {
      this.updatedEntriesBeforeReady.forEach(key => {
        NetworkTables.putValue(key, this.getSource(key));
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

  onSettingsChange(settings) {
    this.address = settings.address;
  }

  userUpdate(key, value) {
    if (this.isNtReady) {
      NetworkTables.putValue(key, value);
    } else {
      const currentValue = this.getSource(key);
      const currentType = getType(currentValue);
      const updatedType = getType(value);
      
      // put in if it's new and it's valid
      if (!currentType && updatedType) {
        this.updateSource(key, value);
        if (!this.updatedEntriesBeforeReady.includes(key)) {
          this.updatedEntriesBeforeReady.push(key);
        }
      }

      // Don't update if type isn't valid
      if (!updatedType) {
        return;
      }

      // make sure current value type matches value passed in
      if (
        currentType === updatedType
        || currentType.includes('Array') && updatedType === 'Array'
        || currentType === 'Array' && updatedType.includes('Array')
      ) {
        this.updateSource(key, value);
        if (!this.updatedEntriesBeforeReady.includes(key)) {
          this.updatedEntriesBeforeReady.push(key);
        }
      }
    }
  }

  isRobotConnected() {
    if (this.isNtReady) {
      return NetworkTables.isRobotConnected();
    }
    return false;
  }

  async addRobotConnectionListener(listener, immediateNotify) {
    if (this.isNtReady) {
      NetworkTables.addRobotConnectionListener(listener, immediateNotify);
    } else {
      // No NetworkTables, so can't be connected to robot
      if (immediateNotify) {
        listener(false);
      }
      await this.ntReady;
      // Listener has already been notified, so don't immediately notify.
      // Only send a notification if connection has changed (from false to true)
      NetworkTables.addRobotConnectionListener(listener, false);
      if (immediateNotify && NetworkTables.isRobotConnected()) {
        listener(true);
      }
    }
  }
}

addSourceProviderType(NetworkTablesProvider);
