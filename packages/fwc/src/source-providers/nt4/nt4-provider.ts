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
    return `${type}[]`;
  }

  return undefined;
}

function getRobotAddresses(teamNumber: number) {
  const t = teamNumber.toString().at(-4) ?? '';
  const e = teamNumber.toString().at(-3) ?? '';
  const a = teamNumber.toString().at(-2) ?? '';
  const m = teamNumber.toString().at(-1) ?? '';

  let te = parseInt(`${t}${e}`, 10);
  let am = parseInt(`${a}${m}`, 10);

  if (Number.isNaN(te)) {
    te = 0;
  }
  if (Number.isNaN(am)) {
    am = 0;
  }

  const team = t + e + a + m;

  return [
    `10.${te.toString()}.${am.toString()}.2`,
    `172.22.11.2`,
    `roborio-${team}-FRC.local`,
    `roborio-${team}-FRC.lan`,
    `roborio-${team}-FRC.frc-field.local`,
  ];
}

export default class Nt4Provider extends SourceProvider {
  private serverAddress = '';
  private clients: Record<string, NT4_Client> = {};
  private client?: NT4_Client;
  private connected = false;
  private topics: Record<string, NT4_Topic> = {};
  private topicValues: Record<string, unknown> = {};
  private unprocessedUpdates: Record<string, unknown> = {};
  private connectionListeners: ((
    connected: boolean,
    serverAddress: string,
  ) => unknown)[] = [];

  constructor() {
    super({}, 1000 / 60);
    this.connect(localStorage.getItem('nt4Address') ?? '127.0.0.1');
  }

  setValue(key: string, value: unknown) {
    this.userUpdate(key, value);
  }

  getValue<T>(key: string, defaultValue: T): T {
    if (key in this.topicValues) {
      return this.topicValues[key] as T;
    }
    return defaultValue;
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
    this.client?.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }

  addConnectionListener(
    listener: (connected: boolean, serverAddress: string) => unknown,
    callImediately = false,
  ): void {
    this.connectionListeners.push(listener);
    if (callImediately) {
      listener(this.connected, this.serverAddress);
    }
  }

  private processUnprocessedUpdates() {
    const updates = { ...this.unprocessedUpdates };
    this.unprocessedUpdates = {};
    Object.entries(updates).forEach(([key, value]) => {
      this.userUpdate(key, value);
    });
  }

  // TODO: Be able to optionally pass in additional data
  userUpdate(key: string, value: unknown): void {
    if (!this.client) {
      this.unprocessedUpdates[key] = value;
      return;
    }
    const topic = this.topics[key];
    if (topic) {
      this.client.publishNewTopic(topic.name, topic.type);
      this.client.addSample(topic.name, value);
      this.updateSource(topic.name, value);
    } else {
      const type = getType(value);

      if (type !== undefined) {
        this.client.publishNewTopic(key, type);
        this.client.addSample(key, value);
        this.updateSource(key, value);
      }
    }
  }

  private onTopicAnnounce(topic: NT4_Topic): void {
    this.topics[topic.name] = topic;
  }
  private onTopicUnannounce(topic: NT4_Topic): void {
    delete this.topics[topic.name];
    delete this.topicValues[topic.name];
    this.removeSource(topic.name);
  }

  private onNewTopicData(topic: NT4_Topic, _: number, value: unknown): void {
    this.updateSource(topic.name, value);
    this.topicValues[topic.name] = value;
  }

  private onConnect() {
    this.connected = true;
    this.connectionListeners.forEach((listener) =>
      listener(true, this.serverAddress),
    );
    this.processUnprocessedUpdates();
  }

  private onDisconnect() {
    this.connected = false;
    this.connectionListeners.forEach((listener) =>
      listener(false, this.serverAddress),
    );
  }

  private createClient(serverAddr: string) {
    if (this.client) {
      this.client.disconnect();
      this.topics = {};
      this.topicValues = {};
      this.connected = false;
      this.client = undefined;
    }
    Object.values(this.clients).forEach((client) => client.disconnect());
    this.clients = {};

    this.serverAddress = serverAddr;
    this.connectionListeners.forEach((listener) =>
      listener(this.connected, this.serverAddress),
    );
    localStorage.setItem('nt4Address', serverAddr);

    const appName = 'FRC Web Components';

    const teamRegex = /^[0-9]+$/;
    const isTeamNumber =
      teamRegex.test(serverAddr) && !Number.isNaN(parseFloat(serverAddr));
    const robotAddresses = isTeamNumber
      ? getRobotAddresses(parseFloat(serverAddr))
      : [serverAddr];

    robotAddresses.forEach((robotAddress) => {
      const client = new NT4_Client(
        robotAddress,
        appName,
        (...args) => {
          if (this.client === client) {
            this.onTopicAnnounce(...args);
          }
        },
        (...args) => {
          if (this.client === client) {
            this.onTopicUnannounce(...args);
          }
        },
        (...args) => {
          if (this.client === client) {
            this.onNewTopicData(...args);
          }
        },
        () => {
          this.client = client;
          Object.entries(this.clients).forEach(
            ([entryAddress, entryClient]) => {
              if (entryAddress !== robotAddress) {
                entryClient.disconnect();
              }
            },
          );
          this.clients = {};
          this.onConnect();
        },
        () => {
          if (this.client === client) {
            this.onDisconnect();
          }
        },
      );
      this.clients[robotAddress] = client;
      client.connect();
      client.subscribeAll(['/'], true);
    });
  }
}
