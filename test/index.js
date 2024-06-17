import basex from '../src/esm/index.js'
import tape from 'tape'
import fixtures from './fixtures.json' assert { type: 'json' }

const { alphabets, invalid, valid } = fixtures

const uint8ArrayToHexString = (uint8) => {
  return Array.from(uint8).reduce((acc, curr) => `${acc}${curr.toString(16).padStart(2, '0')}`, '')
}

const uint8ArrayFromHexString = (string) => {
  if (!string.length) {
    return new Uint8Array(0)
  }

  if (string.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }

  return new Uint8Array(string.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

const bases = Object.keys(alphabets).reduce(function (bases, alphabetName) {
  bases[alphabetName] = basex(alphabets[alphabetName])
  return bases
}, {})

valid.forEach(function (f) {
  tape('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    const base = bases[f.alphabet]
    const actual = base.encode(uint8ArrayFromHexString(f.hex))

    t.plan(1)
    t.same(actual, f.string)
  })
})

valid.forEach(function (f) {
  tape('can decode ' + f.alphabet + ': ' + f.string, function (t) {
    const base = bases[f.alphabet]
    const actual = uint8ArrayToHexString(base.decode(f.string))

    t.plan(1)
    t.same(actual, f.hex)
  })
})

invalid.forEach(function (f) {
  tape('decode throws on ' + f.description, function (t) {
    let base = bases[f.alphabet]

    t.plan(1)
    t.throws(function () {
      if (!base) base = basex(f.alphabet)

      base.decode(f.string)
    }, new RegExp(f.exception))
  })
})

tape('decode should return Uint8Array', function (t) {
  t.plan(2)
  t.true(bases.base2.decode('') instanceof Uint8Array)
  t.true(bases.base2.decode('01') instanceof Uint8Array)
})

tape('encode throws on string', function (t) {
  const base = bases.base58

  t.plan(1)
  t.throws(function () {
    base.encode('a')
  }, /^TypeError: Expected Uint8Array$/)
})

tape('encode not throw on Array or Uint8Array', function (t) {
  const base = bases.base58

  t.plan(2)
  t.same(base.encode([42, 12, 34]), 'F89f')
  t.same(base.encode(new Uint8Array([42, 12, 34])), 'F89f')
})
