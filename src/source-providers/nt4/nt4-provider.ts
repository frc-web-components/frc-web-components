/* eslint-disable camelcase */
import { SourceProvider } from '@webbitjs/store';
import { NT4_Topic } from './NT4';
import ReconnectingNT4 from './ReconnectingNT4';

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

export default class Nt4Provider extends SourceProvider {
  private topics: Record<string, NT4_Topic> = {};
  private reconnectingNt4 = new ReconnectingNT4();

  constructor() {
    super({}, 1000 / 60);
    this.connect(localStorage.getItem('nt4Address') ?? '127.0.0.1');

    this.reconnectingNt4.on('topicAnnounce', (topic: NT4_Topic) => {
      this.topics[topic.name] = topic;
    });
    this.reconnectingNt4.on('topicUnannounce', (topic: NT4_Topic) => {
      delete this.topics[topic.name];
      this.removeSource(topic.name);
    });

    this.reconnectingNt4.on(
      'newTopicData',
      (topic: NT4_Topic, _: number, value: unknown) => {
        this.updateSource(topic.name, value);
      }
    );

    this.reconnectingNt4.on('connect', () => {
      this.reconnectingNt4.getClient()?.subscribeAll(['/'], true);
    });
  }

  getServerAddress(): string {
    return this.reconnectingNt4.getServerAddress();
  }

  connect(serverAddr: string): void {
    if (this.getServerAddress() === serverAddr) {
      return;
    }
    this.clearSources();
    localStorage.setItem('nt4Address', serverAddr);
    this.reconnectingNt4.connect(serverAddr);
  }

  disconnect(): void {
    this.reconnectingNt4.disconnect();
  }

  isConnected(): boolean {
    return this.reconnectingNt4.isConnected();
  }

  addConnectionListener(
    listener: (connected: boolean, serverAddress: string) => unknown,
    callImediately = false
  ): void {
    this.reconnectingNt4.addListener('connectionChange', listener);
    if (callImediately) {
      listener(this.isConnected(), this.getServerAddress());
    }
  }

  // TODO: Be able to optionally pass in additional data
  userUpdate(key: string, value: unknown): void {
    const client = this.reconnectingNt4.getClient();
    if (!client) {
      return;
    }
    const topic = this.topics[key];
    if (topic) {
      client.publishNewTopic(topic.name, topic.type);
      client.addSample(topic.name, value);
      this.updateSource(topic.name, value);
    } else {
      const type = getType(value);
      if (type !== undefined) {
        client.publishNewTopic(key, type);
        client.addSample(key, value);
        this.updateSource(key, value);
      }
    }
  }
}
