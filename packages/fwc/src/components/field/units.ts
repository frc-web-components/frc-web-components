export const baseUnit = 'm';

export const toBaseConversions: Record<string, number> = {
  // metric
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  // imperial
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};

export const unitAliases: Record<string, string> = {
  km: 'km',
  m: 'm',
  meters: 'm',
  cm: 'cm',
  centimeters: 'cm',
  mm: 'mm',
  // imperial
  mi: 'mi',
  miles: 'mi',
  yd: 'yd',
  yards: 'yards',
  ft: 'ft',
  feet: 'ft',
  foot: 'ft',
  in: 'in',
  inches: 'in',
};

export const convert = (value: number, from: string, to: string): number => {
  from = unitAliases[from];
  to = unitAliases[to];
  if (typeof toBaseConversions[from] === 'undefined') {
    from = baseUnit;
  }
  if (typeof toBaseConversions[to] === 'undefined') {
    to = baseUnit;
  }
  return (value * toBaseConversions[from]) / toBaseConversions[to];
};
