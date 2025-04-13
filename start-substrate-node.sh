#!/bin/bash

# Script to start a local Substrate node for zkID Login development

# Config
NODE_DIR="./substrate-node"
NODE_REPO="https://github.com/substrate-developer-hub/substrate-node-template.git"
NODE_BINARY="./target/release/node-template"
LOG_FILE="substrate-node.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== zkID Login - Substrate Node Starter ===${NC}"
echo -e "This script helps you set up and start a local Substrate node for development."

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
  echo -e "${RED}Error: Rust is not installed.${NC}"
  echo "Please install Rust using the following command:"
  echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  exit 1
fi

# Check if Node directory exists
if [ ! -d "$NODE_DIR" ]; then
  echo -e "${YELLOW}Substrate node not found. Would you like to download it? (y/n)${NC}"
  read -r response
  
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Cloning the Substrate node template..."
    git clone $NODE_REPO $NODE_DIR
    cd $NODE_DIR
    
    echo "Building the node (this might take a while)..."
    cargo build --release
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to build the Substrate node.${NC}"
      exit 1
    fi
    
    cd ..
  else
    echo "You chose not to download the Substrate node."
    echo -e "${YELLOW}Please provide a path to an existing Substrate node binary:${NC}"
    read -r custom_binary
    NODE_BINARY=$custom_binary
  fi
fi

# Make sure we're in the right directory
if [ -d "$NODE_DIR" ]; then
  cd $NODE_DIR
fi

# Check if the binary exists
if [ ! -f "$NODE_BINARY" ]; then
  echo -e "${RED}Error: Substrate node binary not found at $NODE_BINARY.${NC}"
  echo "Please build the node first with: cargo build --release"
  exit 1
fi

echo -e "${GREEN}Starting the Substrate node in development mode...${NC}"
echo "The node will be available at: ws://127.0.0.1:9944"
echo -e "Logs will be saved to: ${YELLOW}$LOG_FILE${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the node.${NC}"

# Start the node
$NODE_BINARY \
  --dev \
  --tmp \
  --ws-external \
  --rpc-external \
  --rpc-cors=all \
  2>&1 | tee $LOG_FILE 