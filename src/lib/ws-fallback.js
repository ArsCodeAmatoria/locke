// This file provides empty implementations for optional WebSocket dependencies
// to avoid errors during build when they aren't found

// Mock implementation for 'bufferutil' and 'utf-8-validate'
const noop = () => {};
const noopReturn = (val) => val;

module.exports = {
  // Empty implementation that will be used when the native modules aren't available
  isUtf8: noop,
  isValidUTF8: () => true,
  encode: noopReturn,
  decode: noopReturn,
  concat: (list, length) => Buffer.concat(list, length)
}; 