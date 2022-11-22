function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length / chunkSize; i++) {
    chunks.push(array.slice(chunkSize * i, chunkSize * (i + 1)));
  }
  return chunks;
}

// https://stackoverflow.com/a/37826698
function getFloatingPointNumber(data) {
  // Create a buffer
  var buf = new ArrayBuffer(8);
  // Create a data view of it
  var view = new DataView(buf);

  // set bytes
  data.forEach(function (b, i) {
    view.setUint8(i, b);
  });

  // Read the bits as a float/native 64-bit double
  return view.getFloat64(0);
}

function getFloatArray(data) {
  const chunks = chunkArray(data, 8);
  return chunks.map(getFloatingPointNumber);
}

export default function getPoses(data) {
  const floatArray = data instanceof Uint8Array ? getFloatArray(data) : data;
  return chunkArray(floatArray, 3);
}
