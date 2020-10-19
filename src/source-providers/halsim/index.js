import { SourceProvider, addSourceProviderType } from '@webbitjs/store';
import { 
  connect, 
  sendMsg, 
  addConnectionListener, 
  addMessageListener
} from './socket';

export default class HalSimProvider extends SourceProvider {

  static get typeName() {
    return 'HALSim';
  }

  static get settingsDefaults() {
    return {
      address: 'localhost'
    };
  }

  constructor(providerName, settings) {
    super(providerName, settings);
    this.parentKeyMap = {};
    this.dataToSend = [];

    addConnectionListener(connected => {
      if (!connected) {
        this.clearSources();
      }
    });

    addMessageListener(message => {
      this.socketUpdate(message);
    });

    this.setAddress(settings.address);

    // Send data every 50ms
    setInterval(() => {
      if (this.dataToSend.length > 0) {
        this.dataToSend.forEach(data => {
          sendMsg(data);
        });
        sendMsg({
          device: '',
          type: 'DriverStation',
          data: {
            '>new_data': true
          }
        });
        this.dataToSend = [];
      }
    }, 50);
  }

  setAddress(address) {
    if (address === 'gitpod') {
      connect(`wss://8080${window.location.href.substring(12)}wpilibws`);
    } else {
      connect(`ws://${address}:8080/wpilibws`);
    }
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
          '>new_data': true
        }
      };
      this.dataToSend.push(newDataToSend);
    }
  }

  addConnectionListener(listener, immediatelyNotify) {
    addConnectionListener(listener, immediatelyNotify);
  }
}


addSourceProviderType(HalSimProvider);