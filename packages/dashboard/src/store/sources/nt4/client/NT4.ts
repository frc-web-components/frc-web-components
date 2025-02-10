/* eslint-disable */
import { Nt4Socket } from './Nt4Socket';
import { serialize, deserialize } from './msgpack';

const typestrIdxLookup: { [id: string]: number } = {
  boolean: 0,
  double: 1,
  int: 2,
  float: 3,
  string: 4,
  json: 4,
  raw: 5,
  rpc: 5,
  msgpack: 5,
  protobuf: 5,
  'boolean[]': 16,
  'double[]': 17,
  'int[]': 18,
  'float[]': 19,
  'string[]': 20,
};

class NT4_Subscription {
  uid = -1;
  topics = new Set();
  options = new NT4_SubscriptionOptions();

  toSubscribeObj() {
    return {
      topics: Array.from(this.topics),
      subuid: this.uid,
      options: this.options.toObj(),
    };
  }

  toUnsubscribeObj() {
    return {
      subuid: this.uid,
    };
  }
}

class NT4_SubscriptionOptions {
  periodic = 0.02;
  all = false;
  topicsOnly = false;
  prefix = false;

  toObj() {
    return {
      periodic: this.periodic,
      all: this.all,
      topicsonly: this.topicsOnly,
      prefix: this.prefix,
    };
  }
}

export class NT4_Topic {
  uid = -1; // "id" if server topic, "pubuid" if published
  name = '';
  type = '';
  properties: { [id: string]: any } = {};

  toPublishObj() {
    return {
      name: this.name,
      type: this.type,
      pubuid: this.uid,
      properties: this.properties,
    };
  }

  toUnpublishObj() {
    return {
      pubuid: this.uid,
    };
  }

  getTypeIdx() {
    if (this.type in typestrIdxLookup) {
      return typestrIdxLookup[this.type];
    } else {
      return 5; // Default to binary
    }
  }
}

export class Nt4Client {
  private onTopicAnnounce: (topic: NT4_Topic) => void;
  private onTopicUnannounce: (topic: NT4_Topic) => void;
  private onNewTopicData: (
    topic: NT4_Topic,
    timestamp_us: number,
    value: unknown,
  ) => void;
  private onConnect: () => void;
  private onDisconnect: () => void;

  private nt4Socket: Nt4Socket;
  private serverConnectionActive = false;
  private serverTimeOffset_us: number | null = null;

  private uidCounter = 0;
  private subscriptions: Map<number, NT4_Subscription> = new Map();
  private publishedTopics: Map<string, NT4_Topic> = new Map();
  private serverTopics: Map<string, NT4_Topic> = new Map();

  /**
   * Creates a new NT4 client without connecting.
   * @param serverAddr Network address of NT4 server
   * @param appName Identifier for this client (does not need to be unique).
   * @param onTopicAnnounce Gets called when server announces enough topics to form a new signal
   * @param onTopicUnannounce Gets called when server unannounces any part of a signal
   * @param onNewTopicData Gets called when any new data is available
   * @param onConnect Gets called once client completes initial handshake with server
   * @param onDisconnect Gets called once client detects server has disconnected
   */
  constructor(
    serverAddr: string,
    appName: string,
    onTopicAnnounce: (topic: NT4_Topic) => void,
    onTopicUnannounce: (topic: NT4_Topic) => void,
    onNewTopicData: (
      topic: NT4_Topic,
      timestamp_us: number,
      value: unknown,
    ) => void,
    onConnect: () => void, //
    onDisconnect: () => void,
  ) {
    this.nt4Socket = new Nt4Socket(appName);

    this.nt4Socket.on('connected', () => {
      this.ws_onOpen();
    });
    this.nt4Socket.on('disconnected', (event) => {
      this.ws_onClose(event);
    });
    this.nt4Socket.on('error', () => {
      this.ws_onError();
    });
    this.nt4Socket.on('message', (ev) => {
      this.ws_onMessage(ev);
    });

    this.nt4Socket.setAddress(serverAddr);

    this.onTopicAnnounce = onTopicAnnounce;
    this.onTopicUnannounce = onTopicUnannounce;
    this.onNewTopicData = onNewTopicData;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;

    setInterval(() => this.ws_sendTimestamp(), 5000);
  }

  connect() {
    this.nt4Socket.connect();
  }

  disconnect() {
    this.nt4Socket.disconnect();
  }

  /**
   * Add a new subscription, reading data at the specified frequency.
   * @param topicPatterns A list of topics or prefixes to include in the subscription.
   * @param prefixMode If true, use patterns as prefixes. If false, only subscribe to topics that are an exact match.
   * @param period The period to return data in seconds.
   * @returns A subscription ID that can be used to unsubscribe.
   */
  subscribePeriodic(
    topicPatterns: string[],
    prefixMode: boolean,
    period: number,
  ): number {
    let newSub = new NT4_Subscription();
    newSub.uid = this.getNewUID();
    newSub.topics = new Set(topicPatterns);
    newSub.options.prefix = prefixMode;
    newSub.options.periodic = period;

    this.subscriptions.set(newSub.uid, newSub);
    if (this.serverConnectionActive) {
      this.ws_subscribe(newSub);
    }
    return newSub.uid;
  }

  /**
   * Add a new subscription, reading all value updates.
   * @param topicPatterns A list of topics or prefixes to include in the subscription.
   * @param prefixMode If true, use patterns as prefixes. If false, only subscribe to topics that are an exact match.
   * @returns A subscription ID that can be used to unsubscribe.
   */
  subscribeAll(topicPatterns: string[], prefixMode: boolean): number {
    let newSub = new NT4_Subscription();
    newSub.uid = this.getNewUID();
    newSub.topics = new Set(topicPatterns);
    newSub.options.prefix = prefixMode;
    newSub.options.all = true;

    this.subscriptions.set(newSub.uid, newSub);
    if (this.serverConnectionActive) {
      this.ws_subscribe(newSub);
    }
    return newSub.uid;
  }

  /**
   * Add a new subscription, reading only topic announcements (not values).
   * @param topicPatterns A list of topics or prefixes to include in the subscription.
   * @param prefixMode If true, use patterns as prefixes. If false, only subscribe to topics that are an exact match.
   * @returns A subscription ID that can be used to unsubscribe.
   */
  subscribeTopicsOnly(topicPatterns: string[], prefixMode: boolean): number {
    let newSub = new NT4_Subscription();
    newSub.uid = this.getNewUID();
    newSub.topics = new Set(topicPatterns);
    newSub.options.prefix = prefixMode;
    newSub.options.topicsOnly = true;

    this.subscriptions.set(newSub.uid, newSub);
    if (this.serverConnectionActive) {
      this.ws_subscribe(newSub);
    }
    return newSub.uid;
  }

  /** Given an existing subscription, unsubscribe from it. */
  unsubscribe(subscriptionId: number) {
    let subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw 'Unknown subscription ID "' + subscriptionId + '"';
    }
    this.subscriptions.delete(subscriptionId);
    if (this.serverConnectionActive) {
      this.ws_unsubscribe(subscription);
    }
  }

  /** Unsubscribe from all current subscriptions. */
  clearAllSubscriptions() {
    for (const subscriptionId of this.subscriptions.keys()) {
      this.unsubscribe(subscriptionId);
    }
  }

  /**
   * Set the properties of a particular topic.
   * @param topic The topic to update
   * @param properties The set of new properties
   */
  setProperties(topic: string, properties: { [id: string]: any }) {
    // Update local topics
    let updateTopic = (toUpdate: NT4_Topic) => {
      for (const key of Object.keys(properties)) {
        let value = properties[key];
        if (value === null) {
          delete toUpdate.properties[key];
        } else {
          toUpdate.properties[key] = value;
        }
      }
    };
    let publishedTopic = this.publishedTopics.get(topic);
    if (publishedTopic) updateTopic(publishedTopic);
    let serverTopic = this.serverTopics.get(topic);
    if (serverTopic) updateTopic(serverTopic);

    // Send new properties to server
    if (this.serverConnectionActive) {
      this.ws_setproperties(topic, properties);
    }
  }

  /** Set whether a topic is persistent.
   *
   * If true, the last set value will be periodically saved to
   * persistent storage on the server and be restored during server
   * startup. Topics with this property set to true will not be
   * deleted by the server when the last publisher stops publishing.
   */
  setPersistent(topic: string, isPersistent: boolean) {
    this.setProperties(topic, { persistent: isPersistent });
  }

  /** Set whether a topic is retained.
   *
   * Topics with this property set to true will not be deleted by
   * the server when the last publisher stops publishing.
   */
  setRetained(topic: string, isRetained: boolean) {
    this.setProperties(topic, { retained: isRetained });
  }

  /** Publish a new topic from this client with the provided name and type. */
  publishNewTopic(topic: string, type: string) {
    if (this.publishedTopics.has(topic)) {
      return;
    }
    let newTopic = new NT4_Topic();
    newTopic.name = topic;
    newTopic.uid = this.getNewUID();
    newTopic.type = type;
    this.publishedTopics.set(topic, newTopic);

    if (this.serverConnectionActive) {
      this.ws_publish(newTopic);
    }
    return;
  }

  /** Unpublish a previously-published topic from this client. */
  unpublishTopic(topic: string) {
    let topicObj = this.publishedTopics.get(topic);
    if (!topicObj) {
      throw 'Topic "' + topic + '" not found';
    }
    this.publishedTopics.delete(topic);
    if (this.serverConnectionActive) {
      this.ws_unpublish(topicObj);
    }
  }

  /** Send some new value to the server. The timestamp is whatever the current time is. */
  addSample(topic: string, value: any) {
    let timestamp = this.getServerTime_us();
    if (timestamp === null) timestamp = 0;
    this.addTimestampedSample(topic, timestamp, value);
  }

  /** Send some new timestamped value to the server. */
  addTimestampedSample(topic: string, timestamp: number, value: any) {
    let topicObj = this.publishedTopics.get(topic);
    if (!topicObj) {
      throw 'Topic "' + topic + '" not found';
    }
    let txData = serialize([
      topicObj.uid,
      timestamp,
      topicObj.getTypeIdx(),
      value,
    ]);
    this.ws_sendBinary(txData);
  }

  //////////////////////////////////////////////////////////////
  // Server/Client Time Sync Handling

  /** Returns the current client time in microseconds. */
  getClientTime_us(): number {
    return new Date().getTime() * 1000;
  }

  /** Returns the current server time in microseconds (or null if unknown). */
  getServerTime_us(): number | null {
    if (this.serverTimeOffset_us === null) {
      return null;
    } else {
      return this.getClientTime_us() + this.serverTimeOffset_us;
    }
  }

  private ws_sendTimestamp() {
    let timeToSend = this.getClientTime_us();
    let txData = serialize([-1, 0, typestrIdxLookup['int'], timeToSend]);
    this.ws_sendBinary(txData);
  }

  private ws_handleReceiveTimestamp(
    serverTimestamp: number,
    clientTimestamp: number,
  ) {
    let rxTime = this.getClientTime_us();

    // Recalculate server/client offset based on round trip time
    let rtt = rxTime - clientTimestamp;
    let serverTimeAtRx = serverTimestamp + rtt / 2.0;
    this.serverTimeOffset_us = serverTimeAtRx - rxTime;

    console.log(
      '[NT4] New server time estimate: ' +
        (this.getServerTime_us()! / 1000000.0).toString(),
    );
  }

  //////////////////////////////////////////////////////////////
  // Websocket Message Send Handlers

  private ws_subscribe(subscription: NT4_Subscription) {
    this.ws_sendJSON('subscribe', subscription.toSubscribeObj());
  }

  private ws_unsubscribe(subscription: NT4_Subscription) {
    this.ws_sendJSON('unsubscribe', subscription.toUnsubscribeObj());
  }

  private ws_publish(topic: NT4_Topic) {
    this.ws_sendJSON('publish', topic.toPublishObj());
  }

  private ws_unpublish(topic: NT4_Topic) {
    this.ws_sendJSON('unpublish', topic.toUnpublishObj());
  }

  private ws_setproperties(
    topic: string,
    newProperties: { [id: string]: any },
  ) {
    this.ws_sendJSON('setproperties', {
      name: topic,
      update: newProperties,
    });
  }

  private ws_sendJSON(method: string, params: any) {
    this.nt4Socket.send(
      JSON.stringify([
        {
          method: method,
          params: params,
        },
      ]),
    );
  }

  private ws_sendBinary(data: Uint8Array) {
    this.nt4Socket.send(data);
  }

  //////////////////////////////////////////////////////////////
  // Websocket connection Maintenance

  private ws_onOpen() {
    // Set the flag allowing general server communication
    this.serverConnectionActive = true;
    console.log(
      '[NT4] Connected with idx ' + this.nt4Socket.getClientIdx().toString(),
    );

    // Sync timestamps
    this.ws_sendTimestamp();

    // Publish any existing topics
    for (const topic of this.publishedTopics.values()) {
      this.ws_publish(topic);
    }

    // Subscribe to existing subscriptions
    for (const subscription of this.subscriptions.values()) {
      this.ws_subscribe(subscription);
    }

    // User connection-opened hook
    this.onConnect();
  }

  private ws_onClose(event: CloseEvent) {
    this.serverConnectionActive = false;

    // User connection-closed hook
    this.onDisconnect();

    // Clear out any local cache of server state
    this.serverTopics.clear();

    if (event.reason !== '') {
      console.log('[NT4] Socket is closed: ', event.reason);
    }
  }

  private ws_onError() {}

  private ws_onMessage(event: MessageEvent) {
    if (typeof event.data === 'string') {
      // JSON array
      let msgData = JSON.parse(event.data);
      if (!Array.isArray(msgData)) {
        console.warn(
          '[NT4] Ignoring text message, JSON parsing did not produce an array at the top level.',
        );
        return;
      }

      msgData.forEach((msg) => {
        // Validate proper format of message
        if (typeof msg !== 'object') {
          console.warn(
            '[NT4] Ignoring text message, JSON parsing did not produce an object.',
          );
          return;
        }

        if (!('method' in msg) || !('params' in msg)) {
          console.warn(
            '[NT4] Ignoring text message, JSON parsing did not find all required fields.',
          );
          return;
        }

        let method = msg['method'];
        let params = msg['params'];

        if (typeof method !== 'string') {
          console.warn(
            '[NT4] Ignoring text message, JSON parsing found "method", but it wasn\'t a string.',
          );
          return;
        }

        if (typeof params !== 'object') {
          console.warn(
            '[NT4] Ignoring text message, JSON parsing found "params", but it wasn\'t an object.',
          );
          return;
        }

        // Message validates reasonably, switch based on supported methods
        if (method === 'announce') {
          let newTopic = new NT4_Topic();
          newTopic.uid = params.id;
          newTopic.name = params.name;
          newTopic.type = params.type;
          newTopic.properties = params.properties;
          this.serverTopics.set(newTopic.name, newTopic);
          this.onTopicAnnounce(newTopic);
        } else if (method === 'unannounce') {
          let removedTopic = this.serverTopics.get(params.name);
          if (!removedTopic) {
            console.warn(
              '[NT4] Ignoring unannounce, topic was not previously announced.',
            );
            return;
          }
          this.serverTopics.delete(removedTopic.name);
          this.onTopicUnannounce(removedTopic);
        } else if (method === 'properties') {
          let topic = this.serverTopics.get(params.name);
          if (!topic) {
            console.warn(
              '[NT4] Ignoring set properties, topic was not previously announced.',
            );
            return;
          }
          for (const key of Object.keys(params.update)) {
            let value = params.update[key];
            if (value === null) {
              delete topic.properties[key];
            } else {
              topic.properties[key] = value;
            }
          }
        } else {
          console.warn(
            '[NT4] Ignoring text message - unknown method ' + method,
          );
          return;
        }
      });
    } else {
      // MSGPack
      deserialize(event.data, { multiple: true }).forEach(
        (unpackedData: number[]) => {
          let topicID = unpackedData[0];
          let timestamp_us = unpackedData[1];
          // let typeIdx = unpackedData[2];
          let value = unpackedData[3];

          if (topicID >= 0) {
            let topic: NT4_Topic | null = null;
            for (let serverTopic of this.serverTopics.values()) {
              if (serverTopic.uid === topicID) {
                topic = serverTopic;
                // return;
              }
            }
            if (!topic) {
              console.warn(
                '[NT4] Ignoring binary data - unknown topic ID ' +
                  topicID.toString(),
              );
              return;
            }
            this.onNewTopicData(topic, timestamp_us, value);
          } else if (topicID === -1) {
            this.ws_handleReceiveTimestamp(timestamp_us, value);
          } else {
            console.warn(
              '[NT4] Ignoring binary data - invalid topic ID ' +
                topicID.toString(),
            );
          }
        },
      );
    }
  }

  //////////////////////////////////////////////////////////////
  // General utilties

  private getNewUID() {
    this.uidCounter++;
    return this.uidCounter + this.nt4Socket.getClientIdx();
  }
}
