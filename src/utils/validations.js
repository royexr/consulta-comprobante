/**
 * Verify if an object is empty
 * @param {Object} object Object to verify
 */
function isEmptyObject(object) {
  if (Object.keys(object).length === 0 && object.constructor === Object) {
    return true;
  }
  return false;
}

/**
 * Validate if a string have the right structure of a email address
 * @param {String} string Email to validate\
 * @return {Boolean}
 */
function isValidEmail(string) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(string)) {
    return false;
  }
  return true;
}

export { isValidEmail, isEmptyObject };
