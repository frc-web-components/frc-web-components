/* eslint-disable camelcase */
import { SourceProvider } from '@webbitjs/store';
import { NT4_Client, NT4_Topic } from './NT4';

export default class Nt4Provider extends SourceProvider {
  private serverAddress = '';
  private clients: Record<string, NT4_Client> = {};
  private connected = false;
  private topics: Record<string, NT4_Topic> = {};
  private connectionListeners: ((connected: boolean) => unknown)[] = [];

  constructor() {
    super();
    this.connect(localStorage.getItem('nt4Address') ?? 'localhost');
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
    listener: (connected: boolean) => unknown,
    callImediately = false
  ): void {
    this.connectionListeners.push(listener);
    if (callImediately) {
      listener(this.connected);
    }
  }

  userUpdate(key: string, value: unknown): void {
    const topic = this.topics[key];
    if (topic) {
      const client = this.clients[this.serverAddress];
      client.publishNewTopic(topic.name, topic.type);
      client.addSample(topic.name, value);
      this.updateSource(topic.name, value);
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
    this.connectionListeners.forEach((listener) => listener(true));
  }

  private onDisconnect() {
    this.connected = false;
    this.connectionListeners.forEach((listener) => listener(false));
  }

  private createClient(serverAddr: string): NT4_Client {
    if (this.clients[this.serverAddress]) {
      this.clients[this.serverAddress].disconnect();
      this.topics = {};
    }
    this.serverAddress = serverAddr;
    localStorage.setItem('nt4Address', serverAddr);

    const appName = 'FRC Web Components';

    if (!this.clients[serverAddr]) {
      this.clients[serverAddr] = new NT4_Client(
        serverAddr,
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
