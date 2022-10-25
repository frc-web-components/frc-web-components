/* eslint-disable camelcase */
import { SourceProvider } from '@webbitjs/store';
import { NT4_Client, NT4_Topic } from './NT4';

export default class Nt4Provider extends SourceProvider {
  private client: NT4_Client;
  private connected = false;
  private topics: Record<string, NT4_Topic> = {};

  constructor() {
    super();
    this.client = this.createClient('localhost');
  }

  connect(serverAddr: string): void {
    this.client = this.createClient(serverAddr);
  }

  disconnect(): void {
    this.client.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }

  userUpdate(key: string, value: unknown): void {
    const topic = this.topics[key];
    if (topic) {
      this.client.publishNewTopic(topic.name, topic.type);
      this.client.addSample(topic.name, value);
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
  }

  private onDisconnect() {
    this.connected = false;
  }

  private createClient(serverAddr: string): NT4_Client {
    if (this.client) {
      this.client.disconnect();
      this.topics = {};
    }

    const appName = 'FRC Web Components';

    const client = new NT4_Client(
      serverAddr,
      appName,
      (...args) => this.onTopicAnnounce(...args),
      (...args) => this.onTopicUnannounce(...args),
      (...args) => this.onNewTopicData(...args),
      () => this.onConnect(),
      () => this.onDisconnect()
    );

    client.connect();
    client.subscribeAll(['/'], true);
    return client;
  }
}
