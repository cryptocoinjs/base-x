/* global describe, it */

var assert = require('assert')

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var basex = require('../')
var base58 = basex(BASE58)

var fixtures = require('./fixtures.json')

describe('bs*', function () {
  describe('special handling of leading zeroes', function () {
    it('can be surprising ', function () {
      var codec = basex('0123456789ABCDEF')
      // 4 hex nibbles == two bytes [0x00, 0x0F]
      var encoded = '000F'
      // we expect to decode a 0 byte for each LEADER character
      var expected = [0x00, 0x00, 0x00, 0x0F]
      var decoded = codec.decode(encoded)
      assert.deepEqual(decoded, expected)
    })
  })

  describe('encode base58', function () {
    fixtures.valid.forEach(function (f) {
      it('can encode ' + f.hex, function () {
        var actual = base58.encode(new Buffer(f.hex, 'hex'))

        assert.strictEqual(actual, f.string)
      })
    })
  })

  describe('decode base58', function () {
    fixtures.valid.forEach(function (f) {
      it('can decode ' + f.string, function () {
        var actual = new Buffer(base58.decode(f.string)).toString('hex')

        assert.strictEqual(actual, f.hex)
      })
    })

    fixtures.invalid.forEach(function (f) {
      it('throws on ' + f.description, function () {
        assert.throws(function () {
          base58.decode(f.string)
        }, /Non-base58 character/)
      })
    })
  })
})
