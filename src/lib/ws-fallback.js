// This file provides empty implementations for optional WebSocket dependencies
// to avoid errors during build when they aren't found

module.exports = {
  // Empty implementation that will be used when the native modules aren't available
  isUtf8: () => false,
  isValidUTF8: () => true,
  encode: (buffer) => buffer,
  decode: (buffer) => buffer,
  concat: (list, length) => Buffer.concat(list, length)
}; 