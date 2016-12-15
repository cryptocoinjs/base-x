var tape = require('tape')
var fixtures = require('./fixtures.json')

var bases = Object.keys(fixtures.alphabets).reduce(function (bases, alphabetName) {
  bases[alphabetName] = require('../')(fixtures.alphabets[alphabetName])
  return bases
}, {})

fixtures.valid.forEach(function (f) {
  tape.test('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    var base = bases[f.alphabet]
    var actual = base.encode(new Buffer(f.hex, 'hex'))

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
