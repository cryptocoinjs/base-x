// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

let Buffer = require('safe-buffer').Buffer

module.exports = function base (ALPHABET) {
  let ALPHABET_MAP = {}
  let BASE = ALPHABET.length
  let LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (let z = 0; z < ALPHABET.length; z++) {
    let x = ALPHABET.charAt(z)

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z
  }

  function encode (src) {
    if (!src || src.length === 0) return ''

    let digits = [0]
    for (let i = 0; i < src.length; ++i) {
			let carry = src[i];
      for (let j = 0; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    let str = ''

    // deal with leading zeros
    for (let k = 0; src[k] === 0 && k < src.length - 1; ++k) str += ALPHABET[0]
    // convert digits to a string
    for (let q = digits.length - 1; q >= 0; --q) str += ALPHABET[digits[q]]

    return str
  }

  function decodeUnsafe (str) {
    if (!str || str.length === 0) return Buffer.allocUnsafe(0)

    let bytes = [0]
    for (let i = 0; i < str.length; i++) {
      let value = ALPHABET_MAP[str[i]]
      if (value === undefined) return
			let carry = value;
      for (let j = 0; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (let k = 0; str[k] === LEADER && k < str.length - 1; ++k) bytes.push(0)

    return Buffer.from(bytes.reverse())
  }

  function decode (str) {
    let buffer = decodeUnsafe(str)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
