import { SourceProvider } from '@webbitjs/store';
import { WPILibWebSocketClient } from '@wpilib/node-wpilib-ws';

export default class RobotSimProvider extends SourceProvider {
  #wss = new WPILibWebSocketClient();

  constructor() {
    super({}, 1000 / 60);

    this.#wss.start();

    this.#wss.addListener('accelEvent', (deviceName, channel, payload: any) => {
      const name =
        deviceName + (typeof channel === 'number' ? `[${channel}]` : '');
      const parentKey = ['accel', name].join('/');
      this.#updateFromPayload(parentKey, payload);
    });

    this.#wss.addListener('analogInEvent', (channel, payload: any) => {
      this.#updateFromPayload(`analog/${channel}`, payload);
    });

    this.#wss.addListener('dioEvent', (channel, payload: any) => {
      this.#updateFromPayload(`dio/${channel}`, payload);
    });

    this.#wss.addListener('dpwmEvent', (channel, payload: any) => {
      this.#updateFromPayload(`dpwm/${channel}`, payload);
    });

    this.#wss.addListener('driverStationEvent', (payload: any) => {
      this.#updateFromPayload('driverStation', payload);
    });

    this.#wss.addListener('dutyCycleEvent', (channel, payload: any) => {
      this.#updateFromPayload(`dutyCycle/${channel}`, payload);
    });

    this.#wss.addListener('encoderEvent', (channel, payload: any) => {
      this.#updateFromPayload(`encoder/${channel}`, payload);
    });

    this.#wss.addListener('gyroEvent', (deviceName, channel, payload: any) => {
      const name =
        deviceName + (typeof channel === 'number' ? `[${channel}]` : '');
      const parentKey = ['gyro', name].join('/');
      this.#updateFromPayload(parentKey, payload);
    });

    this.#wss.addListener('joystickEvent', (channel, payload: any) => {
      this.#updateFromPayload(`joystick/${channel}`, payload);
    });

    this.#wss.addListener('pwmEvent', (channel, payload: any) => {
      this.#updateFromPayload(`pwm/${channel}`, payload);
    });

    this.#wss.addListener('relayEvent', (channel, payload: any) => {
      this.#updateFromPayload(`relay/${channel}`, payload);
    });

    this.#wss.addListener('roboRioEvent', (payload: any) => {
      this.#updateFromPayload('roboRio', payload);
    });

    this.#wss.addListener(
      'simDeviceEvent',
      (deviceName: string, deviceIndex, deviceChannel, payload: any) => {
        const name = [
          deviceName,
          typeof deviceIndex === 'number' ? `[${deviceIndex}]` : '[]',
          typeof deviceChannel === 'number' ? `[${deviceChannel}]` : '[]',
        ];
        const parentKey = ['simDevice', name].join('/');
        this.#updateFromPayload(parentKey, payload);
      }
    );
  }

  #updateFromPayload(parentKey: string, payload: Record<string, unknown>) {
    Object.entries(payload).forEach(([prop, value]) => {
      this.updateSource(`/${parentKey}/${prop}`, value);
    });
  }

  userUpdate(key: string, value: unknown): void {
    const [type, ...parts] = key.split('/').slice(1);

    const prop = parts.pop();

    if (typeof prop !== 'string' || !this.#isPropWritable(prop)) {
      return;
    }

    if (type === 'accel') {
      const [name] = parts;
      const [deviceName, channelString = ''] = name.split('[');
      const channel = parseInt(channelString.slice(1, -1));
      this.#wss.accelUpdateToWpilib(
        deviceName,
        isNaN(channel) ? null : channel,
        {
          [prop]: value,
        }
      );
    } else if (type === 'analog') {
      const [channel] = parts;
      this.#wss.analogInUpdateToWpilib(parseInt(channel), {
        [prop]: value,
      });
    } else if (type === 'dio') {
    }
  }

  #isPropWritable(prop: string) {
    return prop.startsWith('>') || prop.startsWith('<>');
  }
}
