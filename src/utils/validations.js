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

module.exports = { isValidEmail };
