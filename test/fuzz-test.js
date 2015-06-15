/* global describe, it, before */

var assert = require('assert')
var makeCodec = require('../')
var fixtures = require('./fixtures.json')

var BASES = 255
var OFFSET = 29
var PRINTABLES = ''
for (var i = OFFSET; i < OFFSET + BASES; i++) {
  PRINTABLES += String.fromCharCode(i)
}

var MAX_TEST_LENGTH = 32
var tests = 0
function name (a) {
  // Travis can bork at the amount of logging so just trim it up
  if (process.env.CI) {
    return '' + tests++
  }
  return a
}

function alphabetSuite (alphabet, options) {
  options = options || {}
  var base = alphabet.length
  var testLength = Math.min(base, MAX_TEST_LENGTH)
  var factor = Math.log(256) / Math.log(base)
  var suiteName = 'using base-' + base + ' factor-' + factor +
                  ' alphabet ' + alphabet

  describe(suiteName, function () {

    var codec
    before(function () {
      codec = makeCodec(alphabet, options.canonical)
    })

    function fromBytesTest (bytes) {
      var hex = new Buffer(bytes).toString('hex')
      it(name('can decode exactly as encoded random bytes: ' + hex), function () {
        assert.deepEqual(codec.decode(codec.encode(bytes)), bytes)
      })
    }

    function fromStringTest (string) {
      it(name('can reencode to equivalent of decoded: ' + string), function () {
        var actual = codec.encode(codec.decode(string))
        if (options.canonical) {
          assert.equal(actual, string)
        } else {
          assert.deepEqual(codec.decode(actual), codec.decode(string))
          while (actual[0] === alphabet[0]) {
            actual = actual.slice(1)
          }
          while (string[0] === alphabet[0]) {
            string = string.slice(1)
          }
          assert.equal(actual, string)
        }
      })
    }

    fromBytesTest([])
    fromStringTest('')

    for (var i = 0; i < testLength; i++) {
      var str = ''
      for (var j = 0; j < testLength; j++) {
        str += alphabet[(j + i) % testLength]
      }

      fromBytesTest([i, testLength - i])
      fromBytesTest([testLength - i, i])
      fromStringTest(str)
    }
  })
}

describe('Fuzzy Logic', function () {
  if (!process.env.CI && !process.env.FUZZ) {
    return
  }

  for (var len = 2; len <= PRINTABLES.length; len++) {
    alphabetSuite(PRINTABLES.slice(0, len), {canonical: false})
  }
  alphabetSuite(fixtures.alphabets.base58, {canonical: true})
})
