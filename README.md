# zkID Login

A decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs for privacy-preserving authentication.

## Features

- **Polkadot Wallet Authentication**: Connect using Polkadot.js browser extension
- **Decentralized Identity (DID)**: Store your identity on the Substrate blockchain
- **Soul-Bound Tokens (SBTs)**: Non-transferable credentials issued to your identity
- **Zero-Knowledge Proofs**: Verify credential ownership without revealing sensitive data
- **WASM-powered**: ZK proofs generated in the browser with WebAssembly
- **Cyberpunk-inspired UI**: Modern interface with neon aesthetics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion
- **Web3 Integration**: Polkadot/js API, Extension-dapp
- **ZK Proofs**: WASM-compiled Rust using bellman, bls12_381 for cryptographic operations
- **Blockchain**: Substrate pallets for DID and SBT with custom runtime

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Polkadot.js browser extension installed
- For full functionality: Substrate node running with custom pallets (for demo purposes, mock APIs are provided)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zkid-login.git
cd zkid-login
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running a Local Substrate Node (Optional)

For full functionality, you can run a local Substrate node with our custom pallets:

```bash
# Start the node in development mode
./start-substrate-node.sh
```

## Project Structure

- **Frontend**:
  - `src/app/`: Next.js application pages and routes
  - `src/components/`: React components including UI elements
  - `src/lib/`: Utility libraries and hooks
    - `src/lib/hooks/use-auth.tsx`: Authentication hook for managing login state
    - `src/lib/substrate-client.ts`: Client for interacting with Substrate node
    - `src/lib/wasm-zkp/`: WASM module for ZK proof generation/verification

- **Blockchain**:
  - `substrate/pallet-did/`: Substrate pallet for Decentralized Identity
  - `substrate/pallet-sbt/`: Substrate pallet for Soul-Bound Tokens
  - `substrate/runtime/`: Substrate runtime configuration

## Substrate Integration Details

### DID Pallet

The DID (Decentralized Identifier) pallet provides:

- Registration of on-chain DIDs linked to account addresses
- DID management and updating
- Storage of DID documents with controller information
- Secure validation of DID ownership

### SBT Pallet

The SBT (Soul-Bound Token) pallet provides:

- Issuance of non-transferable credentials as Soul-Bound Tokens
- Credential metadata storage and management
- Verification of credential validity
- Revocation capability for credential issuers

### Runtime Integration

The Substrate runtime combines the DID and SBT pallets to create a complete identity management system:

- Authentication through account signatures
- Authorization based on DID ownership
- Credential verification using the integrated pallets
- Zero-knowledge proof verification for privacy-preserving authentication

## Zero-Knowledge Proof System

Our ZK proof system allows users to:

1. Generate proofs in the browser using WebAssembly
2. Prove attributes about their credentials without revealing the actual data
3. Verify proofs on-chain through the Substrate node

Example use cases:

- Age verification (prove you're over 18 without revealing your actual age)
- Income verification (prove you earn above a threshold without revealing exact income)
- Citizenship verification (prove country of citizenship without revealing personal details)

## Login Flow

1. User connects their Polkadot wallet through the browser extension
2. The system retrieves the user's DID and SBTs from the Substrate blockchain
3. If a user doesn't have a DID, they can create one
4. When verification is needed, a ZK proof is generated in the browser using WASM
5. The proof is verified on-chain, proving credential ownership without revealing data
6. Upon successful verification, the user is authenticated

## Development Roadmap

- **Phase 1**: Wallet login + mock DID display - ✅ Completed
- **Phase 2**: ZK proof generator (WASM) + verify flow - ✅ Completed
- **Phase 3**: Substrate backend integration - ✅ Completed
- **Phase 4**: Mobile wallet support - 🚧 In progress
- **Phase 5**: Advanced credential types and verification - 🔜 Planned
- **Phase 6**: Integration with real-world identity providers - 🔜 Planned

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Polkadot](https://polkadot.network/) for the blockchain infrastructure
- [Substrate](https://substrate.io/) for the modular blockchain framework
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [bellman](https://github.com/zkcrypto/bellman) for the ZK proof library
