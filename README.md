# zkID Login

A decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs for privacy-preserving authentication.

## Features

- **Polkadot Wallet Authentication**: Connect using Polkadot.js browser extension
- **Decentralized Identity (DID)**: Store your identity on the Substrate blockchain
- **Soul-Bound Tokens (SBTs)**: Non-transferable credentials issued to your identity
- **Zero-Knowledge Proofs**: Verify credential ownership without revealing sensitive data
- **WASM-powered**: ZK proofs generated in the browser with WebAssembly

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Lucide icons
- **Web3 Integration**: Polkadot/js API, Extension-dapp
- **ZK Proofs**: WASM-compiled Rust (simulated in this version)
- **Blockchain**: Substrate pallets for DID and SBT

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

## Project Structure

- **Frontend**:
  - `src/app/`: Next.js application pages
  - `src/components/`: React components
  - `src/lib/`: Utility libraries and hooks

- **Blockchain**:
  - `substrate/pallet-did/`: Substrate pallet for Decentralized Identity
  - `substrate/pallet-sbt/`: Substrate pallet for Soul-Bound Tokens
  - `substrate/runtime/`: Substrate runtime configuration

- **Zero-Knowledge Proofs**:
  - `src/lib/wasm-zkp/`: WASM module for ZK proof generation/verification (simulated)

## How It Works

1. User connects their Polkadot wallet through the browser extension
2. The system retrieves the user's DID and SBTs from the Substrate blockchain
3. When verification is needed, a ZK proof is generated in the browser using WASM
4. The proof is verified on-chain, proving credential ownership without revealing data

## Development Roadmap

- **Phase 1**: Wallet login + mock DID display ✅
- **Phase 2**: ZK proof generator (WASM) + verify flow ✅
- **Phase 3**: Substrate backend live integration (in progress)
- **Phase 4**: On-chain login session/token (planned)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Polkadot](https://polkadot.network/) for the blockchain infrastructure
- [Substrate](https://substrate.io/) for the modular blockchain framework
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
