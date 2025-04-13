#!/bin/bash
set -e

# Make sure wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "wasm-pack is not installed. Installing..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Build the WebAssembly module
echo "Building WebAssembly module..."
wasm-pack build --target web --out-dir pkg

# Create the output directory if it doesn't exist
mkdir -p ../src/lib/wasm-zkp/pkg

# Copy the build artifacts to the src directory
echo "Copying build artifacts to src/lib/wasm-zkp/pkg..."
cp pkg/* ../src/lib/wasm-zkp/pkg/

echo "Build complete! 🎉"
echo "WASM module is available at src/lib/wasm-zkp/pkg/" 