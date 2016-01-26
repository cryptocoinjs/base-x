/* global describe, it */

var assert = require('assert')
var fixtures = require('./fixtures.json')

var alphabets = fixtures.alphabets
var bases = {}

for (var alphabetName in alphabets) {
  var alphabet = alphabets[alphabetName]

  bases[alphabetName] = require('../js.js')(alphabet)
}

describe('base-x', function () {
  describe('encode', function () {
    fixtures.valid.forEach(function (f) {
      it('can encode ' + f.alphabet + ': ' + f.hex, function () {
        var base = bases[f.alphabet]
        var actual = base.encode(new Buffer(f.hex, 'hex'))

        assert.strictEqual(actual, f.string)
      })
    })
  })

  describe('decode', function () {
    fixtures.valid.forEach(function (f) {
      it('can decode ' + f.alphabet + ': ' + f.string, function () {
        var base = bases[f.alphabet]
        var actual = new Buffer(base.decode(f.string)).toString('hex')

        assert.strictEqual(actual, f.hex)
      })
    })

    fixtures.invalid.forEach(function (f) {
      it('throws on ' + f.description, function () {
        var base = bases[f.alphabet]

        assert.throws(function () {
          base.decode(f.string)
        }, new RegExp(f.exception))
      })
    })
  })
})
