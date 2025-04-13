# Substrate Client API

The SubstrateClient class provides a TypeScript interface for interacting with the Substrate blockchain. It handles connections to a Substrate node and provides a simplified interface for working with DIDs and SBTs.

## Overview

The SubstrateClient is implemented as a singleton class that can operate in two modes:

1. **Real Node Mode**: Connects to an actual Substrate node
2. **Mock Mode**: Simulates blockchain interactions for development and testing

## Class Structure

```typescript
class SubstrateClient {
  // Singleton instance
  private static instance: SubstrateClient;
  
  // Get the singleton instance
  public static getInstance(): SubstrateClient;
  
  // Connect to a Substrate node
  public async connect(endpoint?: string): Promise<boolean>;
  
  // Get a user's DID and SBTs
  public async getUserIdentity(account: InjectedAccountWithMeta): Promise<UserIdentity | null>;
  
  // Create a new DID
  public async createDid(account: InjectedAccountWithMeta): Promise<string | null>;
  
  // Verify a ZK proof
  public async verifyProof(proof: string, did: string): Promise<boolean>;
  
  // Disconnect from the node
  public async disconnect(): Promise<void>;
}
```

## Types

### DID Interface

```typescript
interface DID {
  id: string;         // The DID identifier (e.g., "did:substrate:5GrwvaEF...")
  controller: string; // The account that controls this DID
  created: string;    // ISO timestamp of creation
  updated: string;    // ISO timestamp of last update
}
```

### SBT Interface

```typescript
interface SBT {
  id: string;                       // The SBT identifier
  name: string;                     // Name of the SBT
  description?: string;             // Optional description
  issuer: string;                   // Account that issued the SBT
  issuedAt: string;                 // ISO timestamp of issuance
  metadata?: Record<string, any>;   // Optional additional data
}
```

### UserIdentity Interface

```typescript
interface UserIdentity {
  did: DID;     // The user's DID
  sbts: SBT[];  // An array of SBTs owned by the user
}
```

## Methods

### getInstance()

Gets the singleton instance of the SubstrateClient.

```typescript
const client = SubstrateClient.getInstance();
```

### connect(endpoint?: string): Promise<boolean>

Connects to a Substrate node at the specified endpoint. If no endpoint is provided, it uses the default from environment variables or falls back to 'ws://127.0.0.1:9944'.

```typescript
// Connect to default endpoint
const isConnected = await client.connect();

// Connect to specific endpoint
const isConnected = await client.connect('wss://my-node.example.com');
```

**Returns**: Promise resolving to `true` if connection was successful, `false` otherwise.

### getUserIdentity(account: InjectedAccountWithMeta): Promise<UserIdentity | null>

Retrieves the DID and SBTs associated with a Polkadot account.

```typescript
const account = { address: '5GrwvaEF...', meta: { ... } };
const identity = await client.getUserIdentity(account);

if (identity) {
  console.log('DID:', identity.did.id);
  console.log('SBTs:', identity.sbts.length);
}
```

**Parameters**:
- `account`: An account object from the Polkadot.js extension

**Returns**: Promise resolving to a UserIdentity object if found, or null if no DID exists for the account.

### createDid(account: InjectedAccountWithMeta): Promise<string | null>

Creates a new DID for the specified account.

```typescript
const didId = await client.createDid(account);
if (didId) {
  console.log('Created DID:', didId);
}
```

**Parameters**:
- `account`: An account object from the Polkadot.js extension

**Returns**: Promise resolving to the DID identifier if creation was successful, or null on failure.

### verifyProof(proof: string, did: string): Promise<boolean>

Verifies a zero-knowledge proof associated with a DID.

```typescript
const isValid = await client.verifyProof('proof_data_here', 'did:substrate:5GrwvaEF...');
if (isValid) {
  // Grant access to protected resource
}
```

**Parameters**:
- `proof`: The zero-knowledge proof string
- `did`: The DID identifier to verify against

**Returns**: Promise resolving to `true` if the proof is valid, `false` otherwise.

### disconnect(): Promise<void>

Disconnects from the Substrate node.

```typescript
await client.disconnect();
```

## Configuration

The client behavior is controlled by environment variables:

- `NEXT_PUBLIC_USE_REAL_NODE`: Set to 'true' to connect to a real node, 'false' to use mock data
- `NEXT_PUBLIC_SUBSTRATE_NODE_URL`: The WebSocket URL of the Substrate node

## Mock Mode

When in mock mode (`NEXT_PUBLIC_USE_REAL_NODE=false`), the client generates random data for development and testing:

- Mocked DIDs with random creation dates
- Mocked SBTs with random names, issuers, and dates
- Simulated network latency for realistic testing

## Error Handling

All methods include proper error handling and log errors to the console. Error responses include:

- Connection failures (e.g., node not available)
- Account errors (e.g., insufficient permissions)
- Transaction failures (e.g., insufficient funds for creating a DID)
- Network errors during proof verification

## Example Usage

### Basic Usage

```typescript
import { SubstrateClient } from '@/lib/substrate-client';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

async function example() {
  // Get client instance
  const client = SubstrateClient.getInstance();
  
  // Connect to node
  await client.connect();
  
  // Enable extension
  await web3Enable('My App');
  
  // Get accounts
  const accounts = await web3Accounts();
  if (accounts.length === 0) return;
  
  // Get first account
  const account = accounts[0];
  
  // Get identity
  let identity = await client.getUserIdentity(account);
  
  // Create DID if needed
  if (!identity) {
    await client.createDid(account);
    identity = await client.getUserIdentity(account);
  }
  
  console.log('User Identity:', identity);
  
  // Clean up
  await client.disconnect();
}
```

### Advanced Usage

For advanced usage and customization, refer to the [Integration Guide](../guides/integration.md). 