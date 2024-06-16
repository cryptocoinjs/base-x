'use strict'
const crypto = require('crypto')
const benchmark = require('benchmark')
const XorShift128Plus = require('xorshift.js').XorShift128Plus

const bs58ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const basex = require('../src/cjs/index.cjs').default
const bs58 = basex(bs58ALPHABET)

// const bs58 = basex(bs58ALPHABET)

let fixtureIndex = 0
const resetFixtureIndex = function () { fixtureIndex = 0 }
const fixtures = new Array(10000)
const getNextFixture = function () {
  const fixture = fixtures[fixtureIndex++]
  if (fixtureIndex === fixtures.length) {
    fixtureIndex = 0
  }

  return fixture
}

const seed = process.env.SEED || crypto.randomBytes(16).toString('hex')
console.log('Seed: ' + seed)
const prng = new XorShift128Plus(seed)
for (let i = 0; i < fixtures.length; ++i) {
  const source = prng.randomBytes(32)
  fixtures[i] = { source, string: bs58.encode(source) }
}

if (/fast/i.test(process.argv[2])) {
  console.log('Running in fast mode...')
  benchmark.options.minTime = 0.3
  benchmark.options.maxTime = 1
  benchmark.options.minSamples = 3
} else {
  benchmark.options.minTime = 1
}

new benchmark.Suite({
  onStart: function () {
    console.log('--------------------------------------------------')
  },
  onCycle: function (event) {
    console.log(String(event.target))
  },
  onError: function (event) {
    console.error(event.target.error)
  },
  onComplete: function () {
    console.log('==================================================')
  }
})
  .add('encode', function () {
    const fixture = getNextFixture()
    bs58.encode(fixture.source)
  }, { onStart: resetFixtureIndex, onCycle: resetFixtureIndex })
  .add('decode', function () {
    const fixture = getNextFixture()
    bs58.decode(fixture.string)
  }, { onStart: resetFixtureIndex, onCycle: resetFixtureIndex })
  .run()
