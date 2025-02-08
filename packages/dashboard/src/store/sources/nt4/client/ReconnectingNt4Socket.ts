import EventEmitter from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

interface ReconnectingNt4SocketEvents {
  message: (event: MessageEvent) => void;
  disconnected: (event: CloseEvent) => void;
  connected: () => void;
  error: () => void;
}

export type ReconnectingNt4SocketEventEmitter = StrictEventEmitter<
  EventEmitter,
  ReconnectingNt4SocketEvents
>;

export default class ReconnectingNt4Socket extends (EventEmitter as unknown as new () => ReconnectingNt4SocketEventEmitter) {
  #socket!: WebSocket;
  #baseAddress: string;
  #appName: string;
  #clientIdx = 0;
  #closed = false;

  constructor(baseAddress: string, appName: string) {
    super();
    this.#baseAddress = baseAddress;
    this.#appName = appName;

    this.#createSocket();

    this.on('disconnected', () => {
      setTimeout(() => {
        this.#createSocket();
      }, 500);
    });

    this.on('error', () => {
      setTimeout(() => {
        this.#createSocket();
      }, 500);
    });
  }

  isConnected() {
    return this.#socket.readyState === WebSocket.OPEN;
  }

  getClientIdx() {
    return this.#clientIdx;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (!this.isConnected()) {
      return;
    }
    this.#socket.send(data);
  }

  close() {
    this.#closed = true;
    this.#socket.onclose = null;
    this.#socket.onopen = null;
    this.#socket.onmessage = null;
    this.#socket.onerror = null;
    this.#socket.close();
  }

  #createSocket() {
    if (this.#closed) {
      return;
    }
    this.#clientIdx = Math.floor(Math.random() * 99_999_999);
    const address = `ws://${this.#baseAddress}:5810/nt/${this.#appName}_${this.#clientIdx.toString()}`;
    const socket = new WebSocket(address, 'networktables.first.wpi.edu');
    socket.binaryType = 'arraybuffer';
    socket.onopen = () => this.emit('connected');
    socket.onclose = (ev) => this.emit('disconnected', ev);
    socket.onerror = () => this.emit('error');
    socket.onmessage = (ev) => this.emit('message', ev);
    this.#socket = socket;
  }
}
