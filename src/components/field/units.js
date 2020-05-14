
export const baseUnit = 'm';

export const toBaseConversions = {
  // metric
  km: 1000,
  m: 1,
  cm: .01,
  mm: .001,
  // imperial
  mi: 1609.34,
  yd: .9144,
  ft: .3048,
  in: .0254
};

export const convert = (value, from, to) => {
  if (typeof toBaseConversions[from] === 'undefined') {
    from = baseUnit;
  }
  if (typeof toBaseConversions[to] === 'undefined') {
    to = baseUnit;
  }
  return value * toBaseConversions[from] / toBaseConversions[to];
};