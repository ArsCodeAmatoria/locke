#!/bin/bash

# This script starts a local Substrate node for development

# Check if a Substrate binary is available
if ! command -v substrate &> /dev/null; then
    echo "Substrate binary not found. You need to build or install Substrate first."
    echo "Visit https://docs.substrate.io/install/ for installation instructions."
    exit 1
fi

# Start the node in development mode with our custom pallets
echo "Starting local Substrate node with zkID pallets..."
substrate \
    --dev \
    --tmp \
    --ws-external \
    --rpc-external \
    --rpc-cors=all \
    --rpc-methods=Unsafe \
    --alice \
    --log runtime=debug

# If the node fails to start
if [ $? -ne 0 ]; then
    echo "Failed to start Substrate node."
    echo "Make sure you have built the custom runtime with zkID pallets."
    exit 1
fi 