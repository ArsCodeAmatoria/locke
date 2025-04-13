# Substrate Node Integration Guide

This guide explains how to set up and connect to a Substrate node for the zkID Login system.

## Prerequisites

1. Install Rust and Substrate development environment:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup default stable
   rustup update
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

2. Clone the Substrate node repository (if you haven't already):
   ```bash
   git clone https://github.com/your-org/zkid-substrate-node.git
   cd zkid-substrate-node
   ```

3. Build the node:
   ```bash
   cargo build --release
   ```

## Running the Node

### Option 1: Using the start-node.sh script

We've provided a script to simplify starting the node:

```bash
./start-node.sh
```

This will start a local development node with the DID and SBT pallets enabled.

### Option 2: Manual start

You can also start the node manually:

```bash
./target/release/zkid-node \
  --dev \
  --tmp \
  --ws-external \
  --rpc-external \
  --rpc-cors=all
```

## Connecting the Front-End

### Development with Mock Data

During development, you can use mock data by setting:

```
NEXT_PUBLIC_USE_REAL_NODE=false
```

Run with:

```bash
npm run dev:mock
```

### Connecting to a Real Node

To connect to your running Substrate node:

1. Update the `.env.local` file:
   ```
   NEXT_PUBLIC_USE_REAL_NODE=true
   NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://127.0.0.1:9944
   ```

2. Run with:
   ```bash
   npm run dev:real
   ```

## Available Pallets

The zkID system uses two primary pallets:

### DID Pallet

The Decentralized Identity pallet stores user identities on-chain.

Key functions:
- `createDid()`: Create a new identity
- `updateDid(controller)`: Update the DID controller
- `deleteDid()`: Remove a DID

### SBT Pallet

The Soul-Bound Token pallet manages non-transferable credentials.

Key functions:
- `issueToken(recipient, name, description, metadata)`: Issue a new SBT
- `revokeToken(tokenId)`: Revoke an existing SBT

## Testing with Polkadot.js Apps

You can interact with your node using the Polkadot.js Apps interface:

1. Visit [https://polkadot.js.org/apps/](https://polkadot.js.org/apps/)
2. Connect to your local node (ws://127.0.0.1:9944)
3. Use the "Developer" > "Extrinsics" tab to call pallet functions
4. Use the "Developer" > "Chain State" tab to query stored data

## Next Steps

- Implement ZKP verification on-chain
- Add custom types to the Polkadot.js API
- Create a test suite for the pallets 