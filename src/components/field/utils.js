
export const objectWithout = (object, removals) => {
  const newObject = {};
  Object.entries(object).forEach(([key, value]) => {
    if (removals.indexOf(key) < 0) {
      newObject[key] = value;
    }
  });
  return newObject;
};
  