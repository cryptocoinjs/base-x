module.exports = function bufferFrom (bytes) {
  try {
    return Buffer.from(bytes)
  } catch (err) {
    // Prior to node 6, Buffer defines the from method, but it is not
    // documented, and it throws this error.
    if (err.toString() === 'TypeError: this is not a typed array.') {
      // Fall back to constructor
      return new Buffer(bytes)
    } else {
      throw err
    }
  }
}
