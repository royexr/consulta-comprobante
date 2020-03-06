/**
 * Normalize an object
 * @param {Object} object Object to be normalized
 * @return {Object} Normalized object
 */
function normalizeObject(object) {
  const objectKeys = Object.keys(object);
  const newObject = {};

  for (let i = 0; i < objectKeys.length; i += 1) {
    const key = objectKeys[i];
    if (object[key] !== null && object[key] !== '') {
      if (key.search(/[f|F]ECHA/) !== -1) {
        newObject[key] = new Date(object[key]).toLocaleDateString();
      } else {
        newObject[key] = object[key];
      }
    }
  }

  return newObject;
}

export { normalizeObject as default };
