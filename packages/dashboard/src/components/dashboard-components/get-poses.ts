function chunkArray(array: Uint8Array | number[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length / chunkSize; i += 1) {
    chunks.push(array.slice(chunkSize * i, chunkSize * (i + 1)));
  }
  return chunks;
}

// https://stackoverflow.com/a/37826698
function getFloatingPointNumber(data: Uint8Array | number[]) {
  // Create a buffer
  const buf = new ArrayBuffer(8);
  // Create a data view of it
  const view = new DataView(buf);

  // set bytes
  data.forEach((b, i) => {
    view.setUint8(i, b);
  });

  // Read the bits as a float/native 64-bit double
  return view.getFloat64(0);
}

function getFloatArray(data: Uint8Array) {
  const chunks = chunkArray(data, 8);
  return chunks.map(getFloatingPointNumber);
}

export default function getPoses(
  data: Uint8Array | number[],
  chunkSize = 3,
): (Uint8Array | number[])[] {
  const floatArray = data instanceof Uint8Array ? getFloatArray(data) : data;
  return chunkArray(floatArray, chunkSize);
}
