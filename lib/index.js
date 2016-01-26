// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

/**
 * @param {string} ALPHABET
 * @return {encode: function, decode: function}
 */
module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i
  }

  /**
   * @param {(Buffer|number[])} source
   * @return {string}
   */
  function encode (source) {
    if (source.length === 0) {
      return ''
    }

    var i, j
    var digits = [0]

    for (i = 0; i < source.length; i++) {
      var carry = (digits[0] << 8) + source[i]
      digits[0] = carry % BASE
      carry = (carry / BASE) | 0

      for (j = 1; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    // deal with leading zeros
    for (i = 0; source[i] === 0 && i < source.length - 1; i++) {
      digits.push(0)
    }

    // convert digits to a string
    var str = ''
    for (i = digits.length - 1; i >= 0; i--) {
      str += ALPHABET[digits[i]]
    }

    return str
  }

  /**
   * @param {string} string
   * @return {number[]}
   */
  function decode (string) {
    if (string.length === 0) return []

    var i, j
    var bytes = [0]

    for (i = 0; i < string.length; i++) {
      var c = string[i]
      if (!(c in ALPHABET_MAP)) throw new Error('Non-base' + BASE + ' character')

      for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
      bytes[0] += ALPHABET_MAP[c]

      var carry = 0
      for (j = 0; j < bytes.length; ++j) {
        bytes[j] += carry

        carry = bytes[j] >> 8
        bytes[j] &= 0xff
      }

      while (carry) {
        bytes.push(carry & 0xff)

        carry >>= 8
      }
    }

    // deal with leading zeros
    for (i = 0; string[i] === LEADER && i < string.length - 1; i++) {
      bytes.push(0)
    }

    return bytes.reverse()
  }

  return {
    encode: encode,
    decode: decode
  }
}
