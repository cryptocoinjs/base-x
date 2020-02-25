var Buffer = require('safe-buffer').Buffer
var basex = require('../')
var tape = require('tape')
var fixtures = require('./fixtures.json')

var bases = Object.keys(fixtures.alphabets).reduce(function (bases, alphabetName) {
  bases[alphabetName] = basex(fixtures.alphabets[alphabetName])
  return bases
}, {})

fixtures.valid.forEach(function (f) {
  tape.test('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    var base = bases[f.alphabet]
    var actual = base.encode(Buffer.from(f.hex, 'hex'))

    t.plan(1)
    t.same(actual, f.string)
  })
})

fixtures.valid.forEach(function (f) {
  tape.test('can decode ' + f.alphabet + ': ' + f.string, function (t) {
    var base = bases[f.alphabet]
    var actual = base.decode(f.string).toString('hex')

    t.plan(1)
    t.same(actual, f.hex)
  })
})

fixtures.invalid.forEach(function (f) {
  tape.test('decode throws on ' + f.description, function (t) {
    var base = bases[f.alphabet]

    t.plan(1)
    t.throws(function () {
      if (!base) base = basex(f.alphabet)

      base.decode(f.string)
    }, new RegExp(f.exception))
  })
})

tape.test('decode should return Buffer', function (t) {
  t.plan(2)
  t.true(Buffer.isBuffer(bases.base2.decode('')))
  t.true(Buffer.isBuffer(bases.base2.decode('01')))
})

tape.test('encode throws on string', function (t) {
  var base = bases.base58

  t.plan(1)
  t.throws(function () {
    base.encode('a')
  }, new RegExp('^TypeError: Expected Buffer$'))
})

tape.test('encode not throw on Array or Uint8Array', function (t) {
  var base = bases.base58

  t.plan(2)
  t.same(base.encode([42, 12, 34]), 'F89f')
  t.same(base.encode(new Uint8Array([42, 12, 34])), 'F89f')
})
