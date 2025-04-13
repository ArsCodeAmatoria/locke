# zkID Login WebAssembly ZKP Module

This module provides high-performance cryptographic operations implemented in Rust and compiled to WebAssembly for use in the zkID Login application. It dramatically improves performance for computationally intensive operations such as zero-knowledge proof generation and verification.

## Features

- **Zero-Knowledge Proof Generation and Verification**: Fast cryptographic operations for the zkID Login flow
- **DID Resolution and Proof**: Prove ownership of decentralized identifiers with zero-knowledge proofs
- **Credential Verification**: Verify credential attributes without revealing them
- **Multi-Chain Identity Resolution**: Efficiently resolve identities across multiple blockchain networks

## Architecture

The module is structured into the following components:

- **Crypto**: Core cryptographic operations
  - `zk_proofs.rs`: Base zero-knowledge proof operations
  - `credential.rs`: Credential verification with zero-knowledge proofs
  - `did_resolver.rs`: DID resolution and ownership proofs

- **Multi-Chain**: Cross-chain identity operations
  - `resolver.rs`: Resolve identities across multiple chains
  - `linker.rs`: Link identities across different chains

- **Utils**: Helper functions and utilities

## Building

To build the WebAssembly module, you need:

1. Rust (latest stable)
2. wasm-pack

Run the build script:

```bash
./build.sh
```

This will compile the Rust code to WebAssembly and copy the build artifacts to `src/lib/wasm-zkp/pkg/` for use in the JavaScript application.

## JavaScript Integration

The module is integrated with the zkID Login application through a JavaScript wrapper at `src/lib/wasm-zkp/index.ts`, which provides a clean API for using the WASM module.

Example usage:

```typescript
import { ZkProver } from '@/lib/wasm-zkp';

// Get singleton instance
const zkProver = ZkProver.getInstance();

// Initialize 
await zkProver.init();

// Generate a DID ownership proof
const proof = await zkProver.generateDIDProof(
  "did:example:123",
  "privateKey",
  "challenge"
);

// Verify a credential without revealing attributes
const credentialResult = await zkProver.generateCredentialProof(credential);
```

## Performance Improvements

Using Rust with WebAssembly provides significant performance improvements over pure JavaScript implementations:

- ZK proof generation: 10-50x faster
- Multi-chain identity resolution: Parallel execution for faster results
- Cryptographic operations: Native speed with optimal memory usage

## License

This module is part of the zkID Login application and is licensed under the same terms. 