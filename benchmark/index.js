'use strict'
var crypto = require('crypto')
var benchmark = require('benchmark')
var XorShift128Plus = require('xorshift.js').XorShift128Plus

var bs58ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var bs58 = require('../')(bs58ALPHABET)

var fixtureIndex = 0
var resetFixtureIndex = function () { fixtureIndex = 0 }
var fixtures = new Array(10000)
var getNextFixture = function () {
  var fixture = fixtures[fixtureIndex++]
  if (fixtureIndex === fixtures.length) {
    fixtureIndex = 0
  }

  return fixture
}

var seed = process.env.SEED || crypto.randomBytes(16).toString('hex')
console.log('Seed: ' + seed)
var prng = new XorShift128Plus(seed)
for (var i = 0; i < fixtures.length; ++i) {
  let source = prng.randomBytes(32)
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
  var fixture = getNextFixture()
  bs58.encode(fixture.source)
}, {onStart: resetFixtureIndex, onCycle: resetFixtureIndex})
.add('decode', function () {
  var fixture = getNextFixture()
  bs58.decode(fixture.string)
}, {onStart: resetFixtureIndex, onCycle: resetFixtureIndex})
.run()
