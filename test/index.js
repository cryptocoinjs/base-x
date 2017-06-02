var Buffer = require('safe-buffer').Buffer
var basex = require('../')
var tape = require('tape')
var fixtures = require('./fixtures.json')

var bases = {}
Object.keys(fixtures.alphabets).forEach(function (alphabetName) {
  var alphabet = fixtures.alphabets[alphabetName]
  if (typeof alphabet === 'string') {
    bases[alphabetName] = basex(alphabet)
  } else {
    bases[alphabetName] = basex(alphabet.symbols, alphabet.delimiter)
  }
})

fixtures.valid.forEach(function (f) {
  tape.test('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    var base = bases[f.alphabet]
    var actual = base.encode(Buffer.from(f.hex, 'hex'))

    t.same(actual, f.string)
    t.end()
  })
})

fixtures.valid.forEach(function (f) {
  tape.test('can decode ' + f.alphabet + ': ' + f.string, function (t) {
    var base = bases[f.alphabet]
    var actual = base.decode(f.string).toString('hex')

    t.same(actual, f.hex)
    t.end()
  })
})

fixtures.invalid.forEach(function (f) {
  tape.test('decode throws on ' + f.description, function (t) {
    var base = bases[f.alphabet]

    t.throws(function () {
      if (!base) base = basex(f.alphabet)

      base.decode(f.string)
    }, new RegExp(f.exception))
    t.end()
  })
})

tape.test('decode should return Buffer', function (t) {
  t.true(Buffer.isBuffer(bases.base2.decode('')))
  t.true(Buffer.isBuffer(bases.base2.decode('01')))

  t.end()
})
