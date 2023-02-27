/* eslint-disable camelcase */
import { SourceProvider } from '@webbitjs/store';
import { NT4_Client, NT4_Topic } from './NT4';

function getType(value: unknown): string | undefined {
  if (typeof value === 'boolean' || typeof value === 'string') {
    return typeof value;
  }
  if (typeof value === 'number') {
    return 'double';
  }
  if (value instanceof Array) {
    if (value.length === 0) {
      return undefined;
    }
    const type = getType(value[0]);
    const typeMismatch = value.some((v) => getType(v) !== type);
    if (typeMismatch) {
      return undefined;
    }
    return type;
  }

  return undefined;
}

/**
 * Get the mDNS address of a robot.
 *
 * @param team - The team number.
 * @returns The mDNS address of the robot.
 */
function getRobotAddress(team: number): string {
  return `roborio-${team}-frc.local`;
}

export default class Nt4Provider extends SourceProvider {
  private serverAddress = '';
  private clients: Record<string, NT4_Client> = {};
  private connected = false;
  private topics: Record<string, NT4_Topic> = {};
  private connectionListeners: ((
    connected: boolean,
    serverAddress: string
  ) => unknown)[] = [];

  constructor() {
    super({}, 1000 / 60);
    this.connect(localStorage.getItem('nt4Address') ?? '127.0.0.1');
  }

  getServerAddress(): string {
    return this.serverAddress;
  }

  connect(serverAddr: string): void {
    if (this.serverAddress === serverAddr) {
      return;
    }
    this.clearSources();
    this.createClient(serverAddr);
  }

  disconnect(): void {
    this.clients[this.serverAddress]?.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }

  addConnectionListener(
    listener: (connected: boolean, serverAddress: string) => unknown,
    callImediately = false
  ): void {
    this.connectionListeners.push(listener);
    if (callImediately) {
      listener(this.connected, this.serverAddress);
    }
  }

  // TODO: Be able to optionally pass in additional data
  userUpdate(key: string, value: unknown): void {
    const topic = this.topics[key];
    if (topic) {
      const client = this.clients[this.serverAddress];
      client.publishNewTopic(topic.name, topic.type);
      client.addSample(topic.name, value);
      this.updateSource(topic.name, value);
    } else {
      const client = this.clients[this.serverAddress];
      const type = getType(value);
      if (type !== undefined) {
        client.publishNewTopic(key, type);
        client.addSample(key, value);
        this.updateSource(key, value);
      }
    }
  }

  private onTopicAnnounce(topic: NT4_Topic): void {
    this.topics[topic.name] = topic;
  }
  private onTopicUnannounce(topic: NT4_Topic): void {
    delete this.topics[topic.name];
    this.removeSource(topic.name);
  }

  private onNewTopicData(topic: NT4_Topic, _: number, value: unknown): void {
    this.updateSource(topic.name, value);
  }

  private onConnect() {
    this.connected = true;
    this.connectionListeners.forEach((listener) =>
      listener(true, this.serverAddress)
    );
  }

  private onDisconnect() {
    this.connected = false;
    this.connectionListeners.forEach((listener) =>
      listener(false, this.serverAddress)
    );
  }

  private createClient(serverAddr: string): NT4_Client {
    if (this.clients[this.serverAddress]) {
      this.clients[this.serverAddress].disconnect();
      this.topics = {};
    }
    this.serverAddress = serverAddr;
    this.connectionListeners.forEach((listener) =>
      listener(this.connected, this.serverAddress)
    );
    localStorage.setItem('nt4Address', serverAddr);

    const appName = 'FRC Web Components';

    if (!this.clients[serverAddr]) {
      const teamRegex = /^[0-9]+$/;
      const isTeamNumber =
        teamRegex.test(serverAddr) && !Number.isNaN(parseFloat(serverAddr));
      const robotAddress = isTeamNumber
        ? getRobotAddress(parseFloat(serverAddr))
        : serverAddr;
      this.clients[serverAddr] = new NT4_Client(
        robotAddress,
        appName,
        (...args) => {
          if (this.serverAddress === serverAddr) {
            this.onTopicAnnounce(...args);
          }
        },
        (...args) => {
          if (this.serverAddress === serverAddr) {
            this.onTopicUnannounce(...args);
          }
        },
        (...args) => {
          if (this.serverAddress === serverAddr) {
            this.onNewTopicData(...args);
          }
        },
        () => {
          if (this.serverAddress === serverAddr) {
            this.onConnect();
          }
        },
        () => {
          if (this.serverAddress === serverAddr) {
            this.onDisconnect();
          }
        }
      );
    }

    const client = this.clients[serverAddr];

    client.connect();
    client.subscribeAll(['/'], true);
    return client;
  }
}
