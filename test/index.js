/* global describe, it */

var assert = require('assert')

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var base58 = require('../')(BASE58)

var fixtures = require('./fixtures.json')

describe('bs*', function () {
  describe('encode base 58', function () {
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
