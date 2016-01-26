var BaseX = require('bindings')('basex').BaseX

/**
 * @param {string} ALPHABET
 * @return {encode: function, decode: function}
 */
module.exports = function base (ALPHABET) {
	return new BaseX(ALPHABET)
}
