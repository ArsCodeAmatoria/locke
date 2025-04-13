# zkID Login

A decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs for privacy-preserving authentication.

## Features

- **Polkadot Wallet Authentication**: Connect using Polkadot.js browser extension
- **Mobile Wallet Support**: Connect using WalletConnect, Nova Wallet, and other mobile wallets
- **Decentralized Identity (DID)**: Store your identity on the Substrate blockchain
- **Soul-Bound Tokens (SBTs)**: Non-transferable credentials issued to your identity
- **Zero-Knowledge Proofs**: Verify credential ownership without revealing sensitive data
- **Advanced Credential Types**: Support for KYC, age, income, education, citizenship, health, and membership credentials
- **WASM-powered**: High-performance ZK proofs generated with Rust compiled to WebAssembly
- **Credential Verification**: Verify proofs directly through a user-friendly interface
- **Multi-Chain Support**: Manage identities across Substrate, Ethereum, Solana, Cosmos, and NEAR chains
- **Cross-Chain Identity Resolution**: Link DIDs across different blockchains
- **Cyberpunk-inspired UI**: Modern interface with neon aesthetics
- **Responsive Design**: Optimized for desktop and mobile devices
- **Enhanced Authentication Flow**: Improved UX for wallet connection, identity creation, and verification

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion
- **Web3 Integration**: Polkadot/js API, Extension-dapp, WalletConnect, ethers.js
- **ZK Proofs**: Rust cryptography (bellman, bls12_381) compiled to WebAssembly
- **Blockchain**: Substrate pallets for DID and SBT with custom runtime
- **Multi-Chain**: Chain-agnostic DID resolver for cross-chain identity resolution
- **Authentication**: React Context-based authentication with wallet integration

## Recent Updates

- **Rust WebAssembly ZKP Module**: Added high-performance cryptographic operations implemented in Rust, compiled to WebAssembly, providing 10-50x speed improvements over JavaScript implementations
- **Zero-Knowledge Proof Performance Demo**: Added a demo page showcasing the performance benefits of WebAssembly vs. JavaScript for ZK operations
- **Enhanced Login Component**: Improved multi-step login flow with better error handling and state management
- **Auth Hook Improvements**: Updated useAuth hook with account parameter support for login and identity creation
- **Error Handling**: Better error display with localized and context-aware error messages
- **Loading States**: Improved loading state management for better user feedback
- **Responsive Design**: More responsive design for better mobile experience

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Polkadot.js browser extension installed (for desktop)
- Nova Wallet, Talisman, or another Polkadot mobile wallet (for mobile users)
- MetaMask or another Ethereum wallet (for Ethereum chain interactions)
- For full functionality: Substrate node running with custom pallets (for demo purposes, mock APIs are provided)
- For WebAssembly development: Rust toolchain and wasm-pack

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

3. Build the WebAssembly module (optional, pre-built binaries are included):

```bash
cd wasm-zkp
./build.sh
cd ..
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
    - `src/components/WalletLogin.tsx`: Desktop wallet connection component
    - `src/components/MobileWalletConnect.tsx`: Mobile wallet connection component
    - `src/components/CredentialVerify.tsx`: Credential proof verification component
    - `src/components/MultiChainIdentity.tsx`: Multi-chain identity management component
  - `src/lib/`: Utility libraries and hooks
    - `src/lib/hooks/use-auth.tsx`: Authentication hook for managing login state
    - `src/lib/substrate-client.ts`: Client for interacting with Substrate node
    - `src/lib/credential-types.ts`: Advanced credential type definitions and schemas
    - `src/lib/advanced-zkp.ts`: Advanced zero-knowledge proof system
    - `src/lib/wasm-zkp/`: WASM module for ZK proof generation/verification
    - `src/lib/walletconnect-utils.ts`: Utilities for mobile wallet connections
    - `src/lib/identity-providers.ts`: Integration with real-world identity providers
    - `src/lib/multi-chain/`: Multi-chain identity management system

- **Blockchain**:
  - `substrate/pallet-did/`: Substrate pallet for Decentralized Identity
  - `substrate/pallet-sbt/`: Substrate pallet for Soul-Bound Tokens
  - `substrate/runtime/`: Substrate runtime configuration

- **WebAssembly ZKP Module**:
  - `wasm-zkp/`: Rust implementation of cryptographic operations
    - `wasm-zkp/src/crypto/`: Core cryptographic operations
    - `wasm-zkp/src/multi_chain/`: Cross-chain identity operations
    - `wasm-zkp/src/utils.rs`: Helper functions
    - `wasm-zkp/build.sh`: Build script for compiling to WebAssembly

## Rust WebAssembly ZKP Module

The zkID Login now features a high-performance cryptographic module implemented in Rust and compiled to WebAssembly, providing significant performance improvements for computationally intensive operations.

### Features

- **Zero-Knowledge Proof Generation/Verification**: 10-50x faster than JavaScript implementations
- **DID Resolution and Ownership Proofs**: Secure cryptographic proofs of DID ownership
- **Credential Verification**: Verify credential attributes without revealing them
- **Multi-Chain Identity Resolution**: Efficiently resolve identities across multiple blockchains

### Architecture

The module is structured into the following components:

- **Crypto**: Core cryptographic operations
  - `zk_proofs.rs`: Base zero-knowledge proof operations
  - `credential.rs`: Credential verification with zero-knowledge proofs
  - `did_resolver.rs`: DID resolution and ownership proofs

- **Multi-Chain**: Cross-chain identity operations
  - `resolver.rs`: Resolve identities across multiple chains
  - `linker.rs`: Link identities across different chains

### Building

To build the WebAssembly module, run:

```bash
cd wasm-zkp
./build.sh
```

This will compile the Rust code to WebAssembly and copy the build artifacts to `src/lib/wasm-zkp/pkg/` for use in the JavaScript application.

### Performance Improvements

Using Rust with WebAssembly provides significant performance improvements:

- ZK proof generation: 10-50x faster than pure JavaScript
- Multi-chain identity resolution: Parallel execution for faster results
- Cryptographic operations: Native speed with optimal memory usage

Visit the WASM ZKP Demo page in the application to see a live performance comparison.

## Mobile Wallet Support

The zkID Login system now supports mobile wallets for authentication:

### Supported Mobile Wallets

- **WalletConnect**: Connect using QR code scanning from any WalletConnect-compatible wallet
- **Nova Wallet**: Polkadot & Kusama ecosystem mobile wallet
- **Talisman**: Cross-chain wallet with Polkadot support
- **SubWallet**: Polkadot ecosystem wallet
- **Polkadot.js Mobile**: Official Polkadot mobile wallet

### Mobile Authentication Flow

1. User selects "USE MOBILE WALLET" on the authentication screen
2. User chooses their preferred wallet from the available options
3. For WalletConnect: A QR code is displayed for the user to scan with their mobile wallet
4. For direct mobile wallets: A deep link is generated to open the wallet app (when on mobile)
5. The wallet connects and provides account information to the application
6. The authentication proceeds with DID verification and credential checking

### Implementation Details

- Automatic device detection to provide optimized UI for mobile users
- QR code generation for WalletConnect using the Google Charts API
- Deep linking support for direct wallet app opening
- Responsive design that adapts to different screen sizes
- Session management for persistent connections

## Multi-Chain Identity Support

Our system now supports identities across multiple blockchains with unified management:

### Supported Blockchains

- **Substrate**: Polkadot and Kusama ecosystems
- **Ethereum**: Ethereum mainnet and Polygon
- **Solana**: Solana blockchain
- **Cosmos**: Cosmos Hub
- **NEAR**: NEAR Protocol

### Cross-Chain DID Format

The system implements a standardized cross-chain DID format:
`did:multi:<chain-type>:<chain-id>:<address>`

### Key Features

- **Unified Identity Management**: Manage identities across multiple blockchains from a single interface
- **Cross-Chain DID Resolution**: Resolve DIDs across any supported blockchain
- **Identity Linking**: Link identities from different chains to create a unified cross-chain identity
- **Chain-Agnostic Credential Verification**: Verify credentials issued on any supported chain
- **Chain Registry**: Comprehensive registry of supported blockchains with metadata
- **Extensible Architecture**: Easily add support for additional blockchains

### Implementation Components

- **Chain Registry**: Metadata for all supported blockchains
- **DID Resolver**: Resolution of DIDs across multiple chains
- **Chain Client Interface**: Common interface for interacting with different blockchains
- **Chain-Specific Implementations**: Native clients for each supported blockchain
- **Cross-Chain Identity Manager**: Orchestration layer for managing identities across chains
- **React Hook**: Easy-to-use React hook for frontend integration

## Advanced Credential Types

The system now supports a comprehensive range of verifiable credential types:

### Supported Credential Types

- **KYC Verification**: Know Your Customer credentials with verification levels
- **Age Credential**: Age verification without revealing the actual age
- **Citizenship Verification**: Prove citizenship of a country
- **Education Credential**: Verify educational achievements and degrees
- **Professional License**: Validate professional qualifications
- **Income Verification**: Prove income meets certain thresholds
- **Health Credential**: Verify health status without revealing medical details
- **Membership Credential**: Prove membership in organizations

### Credential Schema System

Each credential type has a defined schema with:

- **Required Fields**: Mandatory data fields for the credential type
- **Optional Fields**: Additional information that may be included
- **Validation Rules**: Rules for validating field values
- **ZK-Provable Fields**: Fields that can be proven with zero-knowledge

### Verification Rules

- Validation of field requirements and formats
- Verification of credential issuer authority
- Expiration checks for time-sensitive credentials
- Range validation (e.g., GPA between 0 and 4.0)
- Trust level assessment based on issuer reputation

## Credential Verification Interface

The system provides a user-friendly interface for verifying credential proofs:

### Features

- **Intuitive Proof Verification UI**: Simple interface for verifying credential proofs
- **JSON Proof Input**: Paste JSON proof strings for validation
- **Real-time Feedback**: Immediate feedback on proof validity
- **Visual Status Indicators**: Clear visual indication of verification status
- **Error Handling**: Comprehensive error messages for troubleshooting

### Verification Flow

1. Navigate to the verification page
2. Paste the proof JSON into the input field
3. Click the "Verify Credential" button
4. System processes the verification through the AdvancedZkProver
5. Verification result is displayed with appropriate success/failure indicators
6. Detailed success/error messages help understand the verification status

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

## Advanced Zero-Knowledge Proof System

Our enhanced ZK proof system now provides:

### Features

- **Type-specific proof generation**: Specialized proof generators for each credential type
- **Predicate-based verification**: Support for complex comparison operations (>, >=, =, etc.)
- **Selective disclosure**: Reveal only specific attributes while keeping others private
- **Compound proofs**: Combine multiple credentials in a single verification
- **WASM optimization**: Browser-based ZK proof generation with WebAssembly
- **Standalone Verification**: Verify credential proofs without requiring the original credential

### Verification Flow

1. User selects a credential to prove
2. System identifies the required attributes and predicates
3. Zero-knowledge circuit is constructed based on the credential type
4. Proof is generated in the browser using WebAssembly
5. The proof and public inputs are transmitted for verification
6. Verification without revealing the underlying credential data

### Example Use Cases

- **Age verification**: Prove you are over 18 without revealing your birth date
- **Income qualification**: Prove your income exceeds a threshold without revealing the exact amount
- **Educational credentials**: Verify degree completion without exposing grades
- **Health status**: Confirm vaccination status without revealing medical history
- **KYC compliance**: Verify identity verification level without exposing personal details

## Login Flow

1. User connects their wallet (desktop extension or mobile wallet)
2. The system retrieves the user's DID and SBTs from the Substrate blockchain
3. If a user doesn't have a DID, they can create one
4. When verification is needed, a ZK proof is generated in the browser using WASM
5. The proof is verified on-chain, proving credential ownership without revealing data
6. Upon successful verification, the user is authenticated

## Real-World Identity Provider Integration

The system now integrates with real-world identity providers:

### Supported Provider Types

- **KYC Providers**: Onfido, Jumio, and other KYC service providers
- **Government ID Providers**: GOV.UK Verify, eIDAS, and other government identity services
- **Educational Institutions**: Universities and educational credential issuers
- **Financial Institutions**: Banks and financial service providers
- **Healthcare Providers**: Medical credential issuers
- **Corporate Identity**: Business verification services

## Development Roadmap

- **Phase 1**: Wallet login + mock DID display - ✅ Completed
- **Phase 2**: ZK proof generator (WASM) + verify flow - ✅ Completed
- **Phase 3**: Substrate backend integration - ✅ Completed
- **Phase 4**: Mobile wallet support - ✅ Completed
- **Phase 5**: Advanced credential types and verification - ✅ Completed
- **Phase 6**: Integration with real-world identity providers - ✅ Completed
- **Phase 7**: Public credential verification interface - ✅ Completed
- **Phase 8**: Multi-chain support and interoperability - 🔜 Planned

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
- [WalletConnect](https://walletconnect.com/) for the mobile wallet connection protocol
