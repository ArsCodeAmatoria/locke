# Substrate Login Integration Guide

This guide explains how to set up and use the Substrate-based decentralized identity login for zkID.

## Overview

The zkID Login system uses Polkadot/Substrate for its blockchain-based identity infrastructure. The system consists of:

1. **DID Pallet**: Decentralized Identifier management on a Substrate chain
2. **SBT Pallet**: Soul-Bound Token (credential) management
3. **WASM-ZKP**: Zero-knowledge proof generation and verification
4. **Substrate Client**: JavaScript frontend integration layer

## Prerequisites

Before using the Substrate login functionality, ensure you have:

- Polkadot.js browser extension installed
- At least one account created in the extension
- Node.js 18+ for running the frontend
- Rust toolchain (if running your own node)

## Setup Options

There are two ways to use the zkID Login system:

### 1. Mock Mode (Development/Testing)

The system can work in "mock mode" without connecting to a real blockchain. This is useful for development, testing, or demonstrations.

To use mock mode:

1. Set the environment variable in your `.env.local` file:
   ```
   NEXT_PUBLIC_USE_REAL_NODE=false
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

### 2. Real Node Mode (Production)

For a complete, secure implementation, you'll need to connect to a running Substrate node.

#### Option A: Connect to an Existing Node

1. Set the environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_USE_REAL_NODE=true
   NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://your-node-address:9944
   ```

2. Start the frontend with the real node configuration:
   ```bash
   npm run dev:real
   ```

#### Option B: Run Your Own Local Node

1. Install Substrate prerequisites:
   ```bash
   # Update and prepare Rust
   rustup default stable
   rustup update
   rustup update nightly
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

2. Run the provided start-node script:
   ```bash
   chmod +x start-node.sh
   ./start-node.sh
   ```

3. Set the environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_USE_REAL_NODE=true
   NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://127.0.0.1:9944
   ```

4. Start the frontend:
   ```bash
   npm run dev:real
   ```

## Login Process

When a user connects to the zkID Login application:

1. **Wallet Connection**: The application prompts the user to connect their Polkadot.js wallet
2. **DID Retrieval**: The application checks if the user has a DID on the blockchain
   - If no DID exists, the user is prompted to create one
   - If a DID exists, the application retrieves it and any associated SBTs
3. **Zero-Knowledge Proof**: When proof of credentials is required, the application:
   - Generates a ZK proof in the browser using WebAssembly
   - Verifies the proof cryptographically without revealing the underlying data

## Understanding the Code Structure

### Substrate Client (`src/lib/substrate-client.ts`)

This TypeScript class manages the connection to the Substrate blockchain:

```typescript
// Get an instance of the client
const client = SubstrateClient.getInstance();

// Connect to the blockchain node
await client.connect();

// Get user's identity (DID + SBTs)
const identity = await client.getUserIdentity(account);

// Create a new DID if needed
await client.createDid(account);

// Verify a zero-knowledge proof
const isValid = await client.verifyProof(proof, did);
```

### WASM ZK-Proof Module (`wasm-zkp/`)

The zero-knowledge proof functionality is implemented in Rust and compiled to WebAssembly:

```typescript
// Get the ZK prover instance
const zkProver = ZkProver.getInstance();

// Initialize the prover
await zkProver.init();

// Generate a proof
const proofResult = await zkProver.generateProof(secretValue);

// Verify a proof
const isValid = await zkProver.verifyProof(proofStr, publicInput);
```

### Substrate Pallets

The blockchain functionality is implemented in two main pallets:

1. **DID Pallet** (`substrate/pallet-did/`): Manages decentralized identifiers
2. **SBT Pallet** (`substrate/pallet-sbt/`): Manages soul-bound token credentials

## Advanced Topics

### Customizing the ZK Circuit

The current implementation uses a simple circuit (proving knowledge of a square root). For production use, you'll want to create custom circuits for your specific credential proofs.

To modify the ZK circuit:

1. Edit `wasm-zkp/src/lib.rs` to define your circuit
2. Compile using `wasm-pack build --target web`
3. Update the TypeScript wrapper in `src/lib/wasm-zkp/index.ts`

### Adding Custom Credential Types

To add new credential types:

1. Modify the SBT pallet to support your credential schema
2. Update the frontend to display and interact with these credentials
3. Create appropriate ZK circuits for proving properties about these credentials

## Troubleshooting

### Connection Issues

If you're having trouble connecting to a Substrate node:

1. Ensure the node is running and accessible
2. Check that the WebSocket URL is correct
3. Verify firewall settings allow WebSocket connections
4. Try using mock mode for testing

### Wallet Connection Problems

If the Polkadot.js extension isn't connecting:

1. Ensure the extension is installed and enabled
2. Check that you have at least one account created
3. Try using a different browser
4. Clear browser cache and reload the application

### DID Creation Failures

If creating a DID fails:

1. Check that your account has sufficient funds for the transaction
2. Verify the node is running in development mode (for local testing)
3. Check browser console for specific error messages 