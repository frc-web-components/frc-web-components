import EventEmitter from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { getRobotAddresses } from './utils';
import ReconnectingNt4Socket from './ReconnectingNt4Socket';

type ConnectionStatus =
  | 'CONNECTING'
  | 'DISCONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED';

interface Nt4SocketEvents {
  socketInstanceConnected: (address: string) => void;
  socketInstanceDisconnected: (address: string, event: CloseEvent) => void;
  socketInstanceMessage: (address: string, event: MessageEvent) => void;
  socketInstanceError: (address: string) => void;

  message: (event: MessageEvent) => void;
  disconnected: (event: CloseEvent) => void;
  connected: () => void;
  error: () => void;
}

export type Nt4SocketEventEmitter = StrictEventEmitter<
  EventEmitter,
  Nt4SocketEvents
>;

export class Nt4Socket extends (EventEmitter as unknown as new () => Nt4SocketEventEmitter) {
  #sockets: { [address: string]: ReconnectingNt4Socket } = {};
  #connectedSocketAddress?: string;
  #address = 'localhost';
  #connectionStatus: ConnectionStatus = 'DISCONNECTED';
  #reconnect = false;
  #appName: string;

  constructor(appName: string) {
    super();
    this.#appName = appName;

    this.on('socketInstanceMessage', (address, ev) => {
      if (address !== this.#connectedSocketAddress) {
        return;
      }
      this.emit('message', ev);
    });

    this.on('socketInstanceConnected', (address) => {
      if (this.#connectionStatus !== 'CONNECTING') {
        return;
      }
      this.#connectionStatus = 'CONNECTED';
      this.#connectedSocketAddress = address;
      Object.entries(this.#sockets).forEach(([socketAddress, socket]) => {
        if (socketAddress === address) {
          return;
        }
        socket.close();
      });
      this.emit('connected');
    });

    this.on('socketInstanceDisconnected', (address, ev) => {
      if (this.#connectedSocketAddress === address) {
        this.#connectedSocketAddress = undefined;
        this.#cleanupSockets();
        this.#connectionStatus = 'DISCONNECTED';
        this.emit('disconnected', ev);
        if (this.#reconnect) {
          this.connect();
        }
      }
    });

    this.on('socketInstanceError', (address) => {
      if (this.#connectedSocketAddress === address) {
        this.emit('error');
        this.#connectedSocketAddress = undefined;
        this.#cleanupSockets();
        this.#connectionStatus = 'DISCONNECTED';
        if (this.#reconnect) {
          this.connect();
        }
      }
    });
  }

  get #connectedSocket() {
    if (!this.#connectedSocketAddress) {
      return;
    }
    return this.#sockets[this.#connectedSocketAddress];
  }

  isConnected() {
    return this.#connectionStatus === 'CONNECTED';
  }

  getClientIdx() {
    return this.#connectedSocket?.getClientIdx() ?? 0;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (!this.isConnected()) {
      return;
    }
    this.#connectedSocket?.send(data);
  }

  setAddress(address: string) {
    this.#address = address;
  }

  connect(address?: string) {
    this.#reconnect = true;
    const addressChange =
      typeof address === 'string' && address !== this.#address;
    if (address) {
      this.#address = address;
    }

    if (
      addressChange ||
      (this.#connectionStatus !== 'CONNECTED' &&
        this.#connectionStatus !== 'CONNECTING')
    ) {
      this.#updateSockets();
      this.#connectionStatus = 'CONNECTING';
    }
  }

  disconnect() {
    this.#reconnect = false;
    Object.values(this.#sockets).forEach((socket) => {
      socket.close();
    });
    this.#connectionStatus = 'DISCONNECTING';
  }

  #cleanupSockets() {
    // disconnect and clean up current sockets
    Object.values(this.#sockets).forEach((socket) => {
      socket.close();
    });
    this.#sockets = {};
  }

  #updateSockets() {
    this.#cleanupSockets();
    const addresses = getRobotAddresses(this.#address);

    addresses.forEach((address) => {
      this.#createSocket(address);
    });
  }

  #createSocket(baseAddress: string) {
    const socket = new ReconnectingNt4Socket(baseAddress, this.#appName);
    socket.on('connected', () =>
      this.emit('socketInstanceConnected', baseAddress),
    );
    socket.on('disconnected', (ev) => {
      this.emit('socketInstanceDisconnected', baseAddress, ev);
    });
    socket.on('error', () => this.emit('socketInstanceError', baseAddress));
    socket.on('message', (ev) => {
      this.emit('socketInstanceMessage', baseAddress, ev);
    });
    this.#sockets[baseAddress] = socket;
  }
}
