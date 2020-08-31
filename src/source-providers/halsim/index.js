import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import { createSocket, sendMsg } from './socket';

export default class HalSimProvider extends SourceProvider {

  static get typeName() {
    return 'HALSim';
  }

  static get settingsDefaults() {
    return {};
  }

  constructor(providerName, settings) {
    super(providerName, settings);
    this.parentKeyMap = {};
    this.dataToSend = [];
    createSocket(
      data => {
        this.socketUpdate(data);
      },
      () => {
        this.clearSources();
      },
    );
    // Send data every 50ms
    setInterval(() => {
      this.dataToSend.forEach(data => {
        sendMsg(data);
      });
      this.dataToSend = [];
    }, 50);
  }

  socketUpdate(msg) {
    
    const { data, device, type } = msg;
    
    const keyParts = [type];

    if (device) {
      keyParts.push(device);
    }

    Object.entries(data).forEach(([keyPart, value]) => {
      const key = keyParts.concat(keyPart).join('/');
      this.updateSource(key, value);
      this.parentKeyMap[key] = {
        dataKey: keyPart,
        device,
        type
      };
    });
  }

  userUpdate(key, value) {
    const { dataKey, device, type } = this.parentKeyMap[key];

    const existingData = this.dataToSend.find(data => 
      data.type === type && data.device === device
    );

    if (existingData) {
      existingData.data[dataKey] = value;
    } else {
      const newDataToSend = {
        device,
        type,
        data: {
          [dataKey]: value,
        }
      };
      if (type === 'DriverStation') {
        newDataToSend.data['>new_data'] = true;
      }
      this.dataToSend.push(newDataToSend);
    }
  }
}


addSourceProviderType(HalSimProvider);
