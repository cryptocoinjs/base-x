// base* encoding
// Credits to https://github.com/cryptocoinjs/bs58

module.exports = function base (ALPHABET, canonical) {
  if (canonical === undefined) {
    canonical = true
  }

  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(256) / Math.log(BASE)
  var AFFINITY = FACTOR < 1.2
  if (!canonical && BASE > 255) {
    throw new Error('only works for bases 2 to 255')
  }

  // pre-compute lookup table
  for (var i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i
  }

  function encode (buffer) {
    if (buffer.length === 0) return ''

    var i, j
    var digits = [0]

    for (i = 0; i < buffer.length; i++) {
      for (j = 0; j < digits.length; j++) digits[j] <<= 8

      digits[0] += buffer[i]

      var carry = 0
      for (j = 0; j < digits.length; ++j) {
        digits[j] += carry

        carry = (digits[j] / BASE) | 0
        digits[j] %= BASE
      }

      while (carry) {
        digits.push(carry % BASE)

        carry = (carry / BASE) | 0
      }
    }

    // deal with leading zeros
    if (canonical) {
      for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
        digits.push(0)
      }
    } else {
      var length = (AFFINITY ? Math.ceil : Math.round)(buffer.length * FACTOR)
      while (digits.length < length) {
        digits.push(0)
      }
    }

    return digits.reverse().map(function (digit) {
      return ALPHABET[digit]
    }).join('')
  }

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
    if (canonical) {
      for (i = 0; string[i] === LEADER && i < string.length - 1; i++) {
        bytes.push(0)
      }
    } else {
      var length = (AFFINITY ? Math.floor : Math.round)(string.length / FACTOR)
      while (bytes.length < length) {
        bytes.push(0)
      }
    }

    return bytes.reverse()
  }

  return {
    encode: encode,
    decode: decode
  }
}
