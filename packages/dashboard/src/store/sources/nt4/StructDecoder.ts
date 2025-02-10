/** Class to manage decoding WPILib structs.
 *
 * Code from AdvantageScope: https://github.com/Mechanical-Advantage/AdvantageScope/blob/f781f29067b8fa175e95cfc9aa4c23ea6d5ee3d3/src/shared/log/StructDecoder.ts
 *
 * Specification: https://github.com/wpilibsuite/allwpilib/blob/main/wpiutil/doc/struct.adoc
 */
export default class StructDecoder {
  private schemaStrings: { [key: string]: string } = {};
  private schemas: { [key: string]: Schema } = {};
  private static textDecoder = new TextDecoder();
  private static textEncoder = new TextEncoder();

  addSchema(name: string, schema: Uint8Array): void {
    const schemaStr = StructDecoder.textDecoder.decode(schema);
    if (name in this.schemaStrings) return;
    this.schemaStrings[name] = schemaStr;

    // Try to compile any missing schemas
    while (true) {
      let compileSuccess = false;
      Object.keys(this.schemaStrings).forEach((schemaName) => {
        if (!(schemaName in this.schemas)) {
          const success = this.compileSchema(
            schemaName,
            this.schemaStrings[schemaName],
          );
          compileSuccess = compileSuccess || success;
        }
      });
      if (!compileSuccess) {
        // Nothing was compiled (either everything was already
        // compiled or a schema dependency is missing)
        break;
      }
    }
  }

  private compileSchema(name: string, schema: string): boolean {
    const valueSchemaStrs: string[] = schema
      .split(';')
      .filter((schemaStr) => schemaStr.length > 0);
    const valueSchemas: ValueSchema[] = [];
    for (let i = 0; i < valueSchemaStrs.length; i++) {
      let schemaStr = valueSchemaStrs[i];

      // Get enum data
      let enumData: { [key: number]: string } | null = null;
      if (schemaStr.startsWith('enum')) {
        enumData = {};
        const enumStrStart = schemaStr.indexOf('{') + 1;
        const enumStrEnd = schemaStr.indexOf('}');
        const enumStr = schemaStr
          .substring(enumStrStart, enumStrEnd)
          .split('')
          .filter((char) => char !== ' ')
          .join('');
        enumStr
          .split(',')
          .filter((str) => str.length > 0)
          .forEach((pairStr) => {
            const pair = pairStr.split('=');
            if (pair.length === 2 && !isNaN(Number(pair[1]))) {
              enumData![Number(pair[1])] = pair[0];
            }
          });
        schemaStr = schemaStr.substring(enumStrEnd + 1);
      }

      // Remove type from schema string
      const schemaStrSplit = schemaStr
        .split(' ')
        .filter((str) => str.length > 0);
      const type = schemaStrSplit.shift() as string;
      if (!VALID_TYPE_STRINGS.includes(type) && !(type in this.schemas)) {
        // Missing struct, can't finish compiling
        return false;
      }
      const nameStr = schemaStrSplit.join('');

      // Get name and (bit length or array)
      let name: string;
      let bitfieldWidth: number | null = null;
      let arrayLength: number | null = null;
      if (nameStr.includes(':')) {
        // Bitfield
        const split = nameStr.split(':');
        name = split[0];
        bitfieldWidth = Number(split[1]);

        // Check for invalid bitfield
        if (!BITFIELD_VALID_TYPES.includes(type as ValueType)) continue;
        if (type === ValueType.Bool && bitfieldWidth !== 1) continue;
      } else if (nameStr.includes('[')) {
        // Array
        const split = nameStr.split('[');
        name = split[0];
        arrayLength = Number(split[1].split(']')[0]);
      } else {
        // Normal value
        name = nameStr;
      }

      // Create schema
      valueSchemas.push({
        name: name,
        type: type,
        enum: enumData,
        bitfieldWidth: bitfieldWidth,
        arrayLength: arrayLength,
        bitRange: [0, 0],
      });
    }

    // Find bit positions
    let bitPosition = 0;
    let bitfieldPosition: number | null = null;
    let bitfieldLength: number | null = null;
    for (let i = 0; i < valueSchemas.length; i++) {
      const valueSchema = valueSchemas[i];
      if (!VALID_TYPE_STRINGS.includes(valueSchema.type)) {
        // Referencing another struct
        if (bitfieldPosition !== null || bitfieldLength !== null) {
          bitPosition += bitfieldLength! - bitfieldPosition!;
        }
        bitfieldPosition = null;
        bitfieldLength = null;
        let length = this.schemas[valueSchema.type].length;
        if (valueSchema.arrayLength !== null) {
          length *= valueSchema.arrayLength;
        }
        valueSchema.bitRange = [bitPosition, bitPosition + length];
        bitPosition += length;
      } else if (valueSchema.bitfieldWidth === null) {
        // Normal or array value
        if (bitfieldPosition !== null || bitfieldLength !== null) {
          bitPosition += bitfieldLength! - bitfieldPosition!;
        }
        bitfieldPosition = null;
        bitfieldLength = null;
        let bitLength = VALUE_TYPE_MAX_BITS.get(
          valueSchema.type as ValueType,
        ) as number;
        if (valueSchema.arrayLength !== null) {
          bitLength *= valueSchema.arrayLength;
        }
        valueSchema.bitRange = [bitPosition, bitPosition + bitLength];
        bitPosition += bitLength;
      } else {
        // Bitfield value
        const typeLength = VALUE_TYPE_MAX_BITS.get(
          valueSchema.type as ValueType,
        ) as number;
        const valueBitLength = Math.min(valueSchema.bitfieldWidth, typeLength);
        if (
          bitfieldPosition === null || // No bitfield started
          bitfieldLength === null || // No bitfield started
          (valueSchema.type !== ValueType.Bool &&
            bitfieldLength !== typeLength) || // Current bitfield is a different size (except for boolean that fits anywhere)
          bitfieldPosition + valueBitLength > bitfieldLength // Current bitfield won't fit this data
        ) {
          // Start new bitfield
          if (bitfieldPosition !== null || bitfieldLength !== null) {
            bitPosition += bitfieldLength! - bitfieldPosition!;
          }
          bitfieldPosition = 0;
          bitfieldLength = typeLength;
        }
        valueSchema.bitRange = [bitPosition, bitPosition + valueBitLength];
        bitfieldPosition += valueBitLength;
        bitPosition += valueBitLength;
      }
    }
    if (bitfieldPosition !== null || bitfieldLength !== null) {
      bitPosition += bitfieldLength! - bitfieldPosition!;
    }

    // Save schema
    this.schemas[name] = {
      length: bitPosition,
      valueSchemas: valueSchemas,
    };
    return true;
  }

  private encodeArrayValueType(type: ValueType, values: any[]): Uint8Array {
    const valueTypeSize = VALUE_TYPE_MAX_BITS.get(type)! / 8;
    const buffer = new Uint8Array(valueTypeSize * values.length);
    values.forEach((value, i) => {
      const encodedValue = this.encodeValueType(type, value);
      buffer.set(encodedValue, valueTypeSize * i);
    });
    return buffer;
  }

  private encodeValueType(type: ValueType, value: any): Uint8Array {
    const buffer = new Uint8Array(VALUE_TYPE_MAX_BITS.get(type)! / 8);
    const dataView = new DataView(buffer.buffer);
    switch (type) {
      case ValueType.Bool:
        dataView.setUint8(0, value);
        break;
      case ValueType.Char:
        return StructDecoder.textEncoder.encode(value);
      case ValueType.Int8:
        dataView.setInt8(0, value);
        break;
      case ValueType.Int16:
        dataView.setInt16(0, value, true);
        break;
      case ValueType.Int32:
        dataView.setInt32(0, value, true);
        break;
      case ValueType.Int64:
        // JS doesn't support int64, get as close as possible
        dataView.setBigInt64(0, value, true);
        break;
      case ValueType.Uint8:
        dataView.setUint8(0, value);
        break;
      case ValueType.Uint16:
        dataView.setUint16(0, value, true);
        break;
      case ValueType.Uint32:
        dataView.setUint32(0, value, true);
        break;
      case ValueType.Uint64:
        // JS doesn't support uint64, get as close as possible
        dataView.setBigUint64(0, value, true);
        break;
      case ValueType.Float:
      case ValueType.Float32:
        dataView.setFloat32(0, value, true);
        break;
      case ValueType.Double:
      case ValueType.Float64:
        dataView.setFloat64(0, value, true);
        break;
    }
    return buffer;
  }

  encodeArray(name: string, values: any[]): Uint8Array {
    // get schema
    if (!(name in this.schemas)) {
      throw new Error(`Schema "${name}" not defined`);
    }
    const schema = this.schemas[name];

    // create data view from buffer of length schema length
    const buffer = new Uint8Array((schema.length * values.length) / 8);

    values.forEach((value, i) => {
      const encodedValue = this.encode(name, value);
      buffer.set(encodedValue, (schema.length / 8) * i);
    });
    return buffer;
  }

  encode(name: string, value: any): Uint8Array {
    // get schema
    if (!(name in this.schemas)) {
      throw new Error(`Schema "${name}" not defined`);
    }
    const schema = this.schemas[name];

    // create data view from buffer of length schema length
    const buffer = new Uint8Array(schema.length / 8);

    schema.valueSchemas.forEach((valueSchema) => {
      const schemaPropInValue = valueSchema.name in value;
      if (!schemaPropInValue) {
        throw new Error('Value does not match schema');
      }
      const { type, bitRange, arrayLength } = valueSchema;
      if (VALID_TYPE_STRINGS.includes(type)) {
        const encodedValue =
          arrayLength === null
            ? this.encodeValueType(type as ValueType, value[valueSchema.name])
            : this.encodeArrayValueType(
                type as ValueType,
                value[valueSchema.name],
              );
        buffer.set(encodedValue, bitRange[0] / 8);
      } else {
        const encodedValue =
          arrayLength === null
            ? this.encode(type, value[valueSchema.name])
            : this.encodeArray(type, value[valueSchema.name]);
        buffer.set(encodedValue, bitRange[0] / 8);
      }
    });
    return buffer;
  }

  /** Converts struct-encoded data with a known schema to an object. */
  decode(
    name: string,
    value: Uint8Array,
  ): { data: unknown; schemaTypes: { [key: string]: string } } {
    if (!(name in this.schemas)) {
      throw new Error('Schema not defined');
    }
    const outputData: { [key: string]: unknown } = {};
    const outputSchemaTypes: { [key: string]: string } = {};
    const schema = this.schemas[name];
    const boolArray = StructDecoder.toBoolArray(value);
    for (let i = 0; i < schema.valueSchemas.length; i++) {
      const valueSchema = schema.valueSchemas[i];
      const valueBoolArray = boolArray.slice(
        valueSchema.bitRange[0],
        valueSchema.bitRange[1],
      );
      if (VALID_TYPE_STRINGS.includes(valueSchema.type)) {
        const type = valueSchema.type as ValueType;
        if (valueSchema.arrayLength === null) {
          // Normal type
          outputData[valueSchema.name] = StructDecoder.decodeValue(
            StructDecoder.toUint8Array(valueBoolArray),
            type,
            valueSchema.enum,
          );
        } else {
          // Array type
          const value: unknown[] = [];
          const itemLength =
            (valueSchema.bitRange[1] - valueSchema.bitRange[0]) /
            valueSchema.arrayLength;
          for (
            let position = 0;
            position < valueBoolArray.length;
            position += itemLength
          ) {
            value.push(
              StructDecoder.decodeValue(
                StructDecoder.toUint8Array(
                  valueBoolArray.slice(position, position + itemLength),
                ),
                type,
                valueSchema.enum,
              ),
            );
          }
          if (type === ValueType.Char) {
            outputData[valueSchema.name] = value.join('');
          } else {
            outputData[valueSchema.name] = value;
          }
        }
      } else {
        // Child struct
        outputSchemaTypes[valueSchema.name] = valueSchema.type;
        const child = this.decode(
          valueSchema.type,
          StructDecoder.toUint8Array(valueBoolArray),
        );
        outputData[valueSchema.name] = child.data;
        Object.keys(child.schemaTypes).forEach((field) => {
          outputSchemaTypes[valueSchema.name + '/' + field] =
            child.schemaTypes[field];
        });
      }
    }
    return {
      data: outputData,
      schemaTypes: outputSchemaTypes,
    };
  }

  /** Converts struct-encoded data with a known array schema to an object. */
  decodeArray(
    name: string,
    value: Uint8Array,
  ): { data: unknown; schemaTypes: { [key: string]: string } } {
    if (!(name in this.schemas)) {
      throw new Error('Schema not defined');
    }
    const outputData: unknown[] = [];
    const outputSchemaTypes: { [key: string]: string } = {};
    const schemaLength = this.schemas[name].length / 8;
    const length = value.length / schemaLength;
    for (let i = 0; i < length; i++) {
      const decodedData = this.decode(
        name,
        value.slice(i * schemaLength, (i + 1) * schemaLength),
      );
      outputData.push(decodedData.data);
      Object.entries(decodedData.schemaTypes).forEach(
        ([itemKey, itemSchemaType]) => {
          outputSchemaTypes[i.toString() + '/' + itemKey] = itemSchemaType;
        },
      );
      outputSchemaTypes[i.toString()] = name;
    }
    return {
      data: outputData,
      schemaTypes: outputSchemaTypes,
    };
  }

  /** Decode a uint8 array as a single value based on the known type. */
  private static decodeValue(
    value: Uint8Array,
    type: ValueType,
    enumData: { [key: number]: string } | null,
  ): any {
    const paddedValue = new Uint8Array(VALUE_TYPE_MAX_BITS.get(type)! / 8);
    paddedValue.set(value);
    const dataView = new DataView(paddedValue.buffer);
    let output: any;
    switch (type) {
      case ValueType.Bool:
        output = dataView.getUint8(0) > 0;
        break;
      case ValueType.Char:
        output = this.textDecoder.decode(value);
        break;
      case ValueType.Int8:
        output = dataView.getInt8(0);
        break;
      case ValueType.Int16:
        output = dataView.getInt16(0, true);
        break;
      case ValueType.Int32:
        output = dataView.getInt32(0, true);
        break;
      case ValueType.Int64:
        // JS doesn't support int64, get as close as possible
        output = Number(dataView.getBigInt64(0, true));
        break;
      case ValueType.Uint8:
        output = dataView.getUint8(0);
        break;
      case ValueType.Uint16:
        output = dataView.getUint16(0, true);
        break;
      case ValueType.Uint32:
        output = dataView.getUint32(0, true);
        break;
      case ValueType.Uint64:
        // JS doesn't support uint64, get as close as possible
        output = Number(dataView.getBigUint64(0, true));
        break;
      case ValueType.Float:
      case ValueType.Float32:
        output = dataView.getFloat32(0, true);
        break;
      case ValueType.Double:
      case ValueType.Float64:
        output = dataView.getFloat64(0, true);
        break;
    }
    if (enumData !== null && output in enumData) {
      output = enumData[output];
    }
    return output;
  }

  /** Convert a uint8 array to an array of booleans for each bit. */
  private static toBoolArray(values: Uint8Array): boolean[] {
    const output: boolean[] = [];
    values.forEach((value) => {
      for (let shift = 0; shift < 8; shift++) {
        output.push(((1 << shift) & value) > 0);
      }
    });
    return output;
  }

  /** Convert an array of booleans to a uint8 array. */
  private static toUint8Array(values: boolean[]): Uint8Array {
    const array = new Uint8Array(Math.ceil(values.length / 8));
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        const byte = Math.floor(i / 8);
        const bit = i % 8;
        array[byte] |= 1 << bit;
      }
    }
    return array;
  }

  /** Returns a serialized version of the data from this decoder. */
  toSerialized() {
    return {
      schemaStrings: this.schemaStrings,
      schemas: this.schemas,
    };
  }

  /** Creates a new decoder based on the data from `toSerialized()` */
  static fromSerialized(serializedData: any) {
    const decoder = new StructDecoder();
    decoder.schemaStrings = serializedData.schemaStrings;
    decoder.schemas = serializedData.schemas;
    return decoder;
  }
}

interface Schema {
  length: number;
  valueSchemas: ValueSchema[];
}

interface ValueSchema {
  name: string;
  type: ValueType | string;
  enum: { [key: number]: string } | null;
  bitfieldWidth: number | null;
  arrayLength: number | null;
  bitRange: [number, number];
}

enum ValueType {
  Bool = 'bool',
  Char = 'char',
  Int8 = 'int8',
  Int16 = 'int16',
  Int32 = 'int32',
  Int64 = 'int64',
  Uint8 = 'uint8',
  Uint16 = 'uint16',
  Uint32 = 'uint32',
  Uint64 = 'uint64',
  Float = 'float',
  Float32 = 'float32',
  Double = 'double',
  Float64 = 'float64',
}

const VALID_TYPE_STRINGS = Object.values(ValueType) as string[];

const BITFIELD_VALID_TYPES = [
  ValueType.Bool,
  ValueType.Int8,
  ValueType.Int16,
  ValueType.Int32,
  ValueType.Int64,
  ValueType.Uint8,
  ValueType.Uint16,
  ValueType.Uint32,
  ValueType.Uint64,
];

const VALUE_TYPE_MAX_BITS = new Map([
  [ValueType.Bool, 8],
  [ValueType.Char, 8],
  [ValueType.Int8, 8],
  [ValueType.Int16, 16],
  [ValueType.Int32, 32],
  [ValueType.Int64, 64],
  [ValueType.Uint8, 8],
  [ValueType.Uint16, 16],
  [ValueType.Uint32, 32],
  [ValueType.Uint64, 64],
  [ValueType.Float, 32],
  [ValueType.Float32, 32],
  [ValueType.Double, 64],
  [ValueType.Float64, 64],
]);
