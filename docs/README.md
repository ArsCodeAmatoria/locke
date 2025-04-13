# zkID Login Documentation

Welcome to the zkID Login documentation. This guide will help you understand how to use, integrate, and extend the zkID Login system.

## Overview

zkID Login is a decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs for privacy-preserving authentication. It allows users to:

1. Connect with Polkadot wallets
2. Create and manage decentralized identities (DIDs)
3. Receive and verify Soul-Bound Tokens (SBTs) as credentials
4. Prove credential ownership without revealing sensitive data

## Quick Start

To get started with zkID Login:

1. [Installation Guide](guides/installation.md)
2. [Integration Guide](guides/integration.md)
3. [User Guide](guides/user-guide.md)

## Core Components

The system consists of the following core components:

- **Frontend UI**: Next.js application with a cyberpunk-inspired interface
- **Substrate Client**: Bridge between frontend and blockchain
- **DID Pallet**: Substrate pallet for decentralized identity management
- **SBT Pallet**: Substrate pallet for Soul-Bound Token credentials
- **ZK Proof Module**: WebAssembly-powered zero-knowledge proof generation and verification

## API Reference

- [Substrate Client API](api/substrate-client.md)
- [DID Pallet API](api/did-pallet.md)
- [SBT Pallet API](api/sbt-pallet.md)
- [ZK Proof API](api/zk-proof.md)

## Development Guides

- [Setting up a Development Environment](guides/development-setup.md)
- [Testing and Debugging](guides/testing.md)
- [Contributing to zkID Login](guides/contributing.md)

## Deployment

- [Deploying the Frontend](guides/frontend-deployment.md)
- [Running a Substrate Node](guides/substrate-node.md)

## Resources

- [Glossary](guides/glossary.md)
- [Frequently Asked Questions](guides/faq.md)
- [Troubleshooting](guides/troubleshooting.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 