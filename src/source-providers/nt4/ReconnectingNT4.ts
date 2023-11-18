/* eslint-disable camelcase */
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { NT4_Client, NT4_Topic } from './NT4';
import { getRobotAddresses } from './getRobotAddresses';

interface ReconnectingNT4Events {
  connect: (address: string) => void;
  disconnect: (address: string) => void;
  connectionChange: (connected: boolean, address: string) => void;
  topicAnnounce: (topic: NT4_Topic) => void;
  topicUnannounce: (topic: NT4_Topic) => void;
  newTopicData: (topic: NT4_Topic, timestampUs: number, value: unknown) => void;
}

export type ReconnectingNT4EventEmitter = StrictEventEmitter<
  EventEmitter,
  ReconnectingNT4Events
>;

export default class ReconnectingNT4 extends (EventEmitter as new () => ReconnectingNT4EventEmitter) {
  private serverAddress = '';
  private clients: Record<string, NT4_Client> = {};
  private client?: NT4_Client;
  private connected = false;

  getClient(): NT4_Client | undefined {
    return this.client;
  }

  getServerAddress(): string {
    return this.serverAddress;
  }

  connect(serverAddr: string): void {
    if (this.serverAddress === serverAddr) {
      return;
    }
    this.createClient(serverAddr);
  }

  disconnect(): void {
    this.client?.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }

  private onTopicAnnounce(topic: NT4_Topic): void {
    this.emit('topicAnnounce', topic);
  }
  private onTopicUnannounce(topic: NT4_Topic): void {
    this.emit('topicUnannounce', topic);
  }

  private onNewTopicData(
    topic: NT4_Topic,
    timestampUs: number,
    value: unknown
  ): void {
    this.emit('newTopicData', topic, timestampUs, value);
  }

  private onConnect(address: string) {
    this.connected = true;
    this.emit('connect', address);
    this.emit('connectionChange', true, address);
  }

  private onDisconnect(address: string) {
    this.connected = false;
    this.emit('disconnect', address);
    this.emit('connectionChange', false, address);
  }

  private createClient(serverAddr: string) {
    if (this.client) {
      this.client.disconnect();
      this.connected = false;
      this.client = undefined;
    }
    Object.values(this.clients).forEach((client) => client.disconnect());
    this.clients = {};

    this.serverAddress = serverAddr;

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
            }
          );
          this.clients = {};
          this.onConnect(robotAddress);
        },
        () => {
          if (this.client === client) {
            this.onDisconnect(robotAddress);
          }
        }
      );
      this.clients[robotAddress] = client;
      client.connect();
    });
  }
}
