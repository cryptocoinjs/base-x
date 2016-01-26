'use strict'

var crypto = require('crypto')
var benchmark = require('benchmark')

var bs58ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var bs58js = require('../js.js')(bs58ALPHABET)
var bs58addon = require('../bindings.js')(bs58ALPHABET)

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

var seed = process.env.SEED || crypto.randomBytes(32).toString('hex')
console.log('Seed: ' + seed)
for (var i = 0; i < fixtures.length; ++i) {
  seed = crypto.createHash('sha256').update(seed).digest()

  fixtures[i] = {
    source: seed,
    result: bs58js.encode(seed)
  }
}

if (/fast/i.test(process.argv[2])) {
  console.log('Running in fast mode...')
  benchmark.options.minTime = 0.3
  benchmark.options.maxTime = 1
  benchmark.options.minSamples = 3
} else {
  benchmark.options.minTime = 1
}

/**
 * @param {string} name
 * @param {function} bs58
 */
function runBenchmark (name, bs58) {
  new benchmark.Suite(name, {
    onStart: function () {
      console.log('Benchmarking: ' + name)
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
    bs58.decode(fixture.result)
  }, {onStart: resetFixtureIndex, onCycle: resetFixtureIndex})
  .run()
}

// runBenchmark('js', bs58js)
runBenchmark('addon', bs58addon)
