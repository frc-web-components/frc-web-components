import { PropertyType } from '../../slices/sourceSlice';
import StructDecoder from './StructDecoder';
import SourceProvider from '../source-provider';
import { NT4_Client, NT4_Topic } from './client/NT4_';
import { getRobotAddress } from './client/utils';

const basicTypes = [
  'boolean',
  'int',
  'float',
  'double',
  'string',
  'int[]',
  'float[]',
  'double[]',
  'string[]',
];

const propTypeMap: Record<string, PropertyType> = {
  boolean: 'Boolean',
  int: 'Number',
  float: 'Number',
  double: 'Number',
  string: 'String',
  'int[]': 'Number[]',
  'float[]': 'Number[]',
  'double[]': 'Number[]',
  'string[]': 'String[]',
  structschema: 'Object',
};

function getPropType(type: string, value?: unknown): PropertyType {
  if (type in propTypeMap) {
    return propTypeMap[type];
  }
  if (type === 'json') {
    return value instanceof Array ? 'Object[]' : 'Object';
  }

  if (type.startsWith(NT4Provider.STRUCT_PREFIX)) {
    return value instanceof Array ? 'Object[]' : 'Object';
  }

  return 'Object';
}

export class NT4Provider extends SourceProvider {
  #nt4!: NT4_Client;
  #structDecoder = new StructDecoder();
  static STRUCT_PREFIX = 'struct:';
  #topics: Record<string, NT4_Topic> = {};
  #address!: string;
  #isConnected = false;
  #subscriptions = new Map<string, number>();
  #isEditing = true;
  #subscribeAllId?: number;

  constructor() {
    super('NT', 1000 / 20);
    this.connect('localhost');
  }

  connect(address: string) {
    if (address === this.#address) {
      return;
    }
    this.#nt4?.clearAllSubscriptions();
    this.#nt4?.disconnect();
    this.#isConnected = false;
    this.#address = address;
    this.#updateConnectionStatus();

    const client = new NT4_Client(
      getRobotAddress(address),
      'FRC Web Components',
      (topic: NT4_Topic) => {
        this.#topics[topic.name] = topic;
        this.update(topic.name, undefined, topic.type, getPropType(topic.type));

        if (basicTypes.includes(topic.type)) {
          const propType = getPropType(topic.type);
          this.updateDisplayType(topic.name, propType);
        }
      },
      (topic: NT4_Topic) => {
        delete this.#topics[topic.name];
      },
      (topic: NT4_Topic, _: number, value: unknown) => {
        if (topic.type === 'structschema') {
          this.#addStructSchema(topic, value as Uint8Array);
        } else if (basicTypes.includes(topic.type)) {
          const propType = getPropType(topic.type);
          this.update(topic.name, value, topic.type, propType);

          const parts = topic.name.split('/');
          if (parts.pop() === '.type') {
            this.updateDisplayType(parts.join('/'), value as string);
          }
        } else if (topic.type === 'json') {
          if (typeof value === 'string') {
            try {
              const json = JSON.parse(value);
              const propType = getPropType(topic.type, json);
              this.update(topic.name, json, topic.type, propType);
            } catch {
              console.warn(`Could not parse json for "${topic.name}"`);
            }
          } else {
            console.warn(
              'Expected a string value for "' + topic.name + '" but got:',
              value,
            );
          }
        } else {
          this.#handleRawData(topic, value);
        }
      },
      () => {
        if (client === this.#nt4) {
          this.#isConnected = true;
          this.#updateConnectionStatus();
        }
      },
      () => {
        if (client === this.#nt4) {
          this.#isConnected = false;
          this.#updateConnectionStatus();
        }
      },
    );

    this.#nt4 = client;
    this.#nt4.connect();
    this.setEditing(this.#isEditing);
    const subscriptions = new Set([...this.#subscriptions.keys()]);
    this.#subscriptions = new Map();
    this.setSubscriptions(subscriptions);
  }

  #updateConnectionStatus() {
    this.setConnectionStatus(
      this.#isConnected,
      `NetworkTables (${this.#address})`,
    );
  }

  #handleRawData(topic: NT4_Topic, value: unknown) {
    if (value instanceof Uint8Array) {
      if (topic.type.startsWith(NT4Provider.STRUCT_PREFIX)) {
        let schemaType = topic.type.split(NT4Provider.STRUCT_PREFIX)[1];

        const isArray = schemaType.endsWith('[]');

        if (isArray) {
          schemaType = schemaType.slice(0, -2);
        }
        try {
          const decodedData = isArray
            ? this.#structDecoder.decodeArray(schemaType, value)
            : this.#structDecoder.decode(schemaType, value);
          this.update(
            topic.name,
            decodedData.data,
            topic.type,
            isArray ? 'Object[]' : 'Object',
          );
        } catch {
          /* */
        }
      }
      // else if (topic.type.startsWith(PROTO_PREFIX)) {
      //   let schemaType = topic.type.split(PROTO_PREFIX)[1];
      //   this.log?.putProto(key, timestamp, value, schemaType);
      // } else {
      //   this.log?.putRaw(key, timestamp, value);
      //   if (CustomSchemas.has(topic.type)) {
      //     try {
      //       CustomSchemas.get(topic.type)!(this.log, key, timestamp, value);
      //     } catch {
      //       console.error('Failed to decode custom schema "' + topic.type + '"');
      //     }
      //     this.log.setGeneratedParent(key);
      //   }
      // }
      // updated = true;
    } else {
      console.warn(
        'Expected a raw value for "' + topic.name + '" but got:',
        value,
      );
    }
  }

  #addStructSchema(topic: NT4_Topic, value: Uint8Array) {
    // Check for struct schema
    const { name } = topic;
    if (name.includes('/.schema/' + NT4Provider.STRUCT_PREFIX)) {
      this.#structDecoder.addSchema(
        name.split(NT4Provider.STRUCT_PREFIX)[1],
        value,
      );
      const { schemas } = this.#structDecoder.toSerialized();
      Object.entries(schemas).forEach(([name, schema]) => {
        this.update(
          `/.schema/${NT4Provider.STRUCT_PREFIX}${name}`,
          schema,
          'structschema',
          'Object',
        );
      });
    }
  }

  #serializeValue(value: unknown, type: string): unknown {
    if (basicTypes.includes(type)) {
      return value;
    } else if (type === 'json') {
      return JSON.stringify(value);
    } else if (type.startsWith(NT4Provider.STRUCT_PREFIX)) {
      let schemaType = type.split(NT4Provider.STRUCT_PREFIX)[1];
      const isArray = schemaType.endsWith('[]');
      if (isArray) {
        schemaType = schemaType.slice(0, -2);
      }
      if (!isArray && value instanceof Array) {
        return undefined;
      }
      return isArray
        ? this.#structDecoder.encodeArray(schemaType, value as any)
        : this.#structDecoder.encode(schemaType, value);
    }
  }

  componentUpdate(key: string, value: unknown, type: string) {
    if (type === 'structschema') {
      return;
    }
    const serializedValue = this.#serializeValue(value, type);
    const topic = this.#topics[key];
    const propType = getPropType(type);
    if (topic) {
      this.#nt4.publishTopic(topic.name, topic.type);
      this.#nt4.addSample(topic.name, serializedValue);
      this.update(topic.name, value, type, propType);
    } else if (type !== undefined) {
      this.#nt4.publishTopic(key, type);
      this.#nt4.addSample(key, serializedValue);
      this.update(key, value, type, propType);
    }
  }

  setSubscriptions(subscriptions: Set<string>) {
    // subscriptions.
    const additions: string[] = [];
    const removals: string[] = [];
    subscriptions.forEach((subscription) => {
      if (!this.#subscriptions.has(subscription)) {
        additions.push(subscription);
      }
    });
    this.#subscriptions.forEach((_, subscription) => {
      if (!subscriptions.has(subscription)) {
        removals.push(subscription);
      }
    });
    removals.forEach((removal) => {
      this.#nt4.unsubscribe(this.#subscriptions.get(removal)!);
      this.#subscriptions.delete(removal);
    });
    additions.forEach((addition) => {
      const subscriptionId = this.#nt4.subscribe([addition], true, false, 0.02);
      this.#subscriptions.set(addition, subscriptionId);
    });
  }

  setEditing(isEditing: boolean) {
    if (typeof this.#subscribeAllId === 'number') {
      try {
        this.#nt4?.unsubscribe(this.#subscribeAllId);
      } catch {
        //
      }
      this.#subscribeAllId = undefined;
    }
    if (isEditing) {
      this.#subscribeAllId = this.#nt4.subscribe(['/'], true, false, 0.2);
    }
    this.#isConnected = isEditing;
  }
}
