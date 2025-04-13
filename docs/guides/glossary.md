# Glossary

This glossary explains key terms used in the zkID Login system and decentralized identity.

## A

### Account
A blockchain account, identified by a public key, that can send transactions and hold tokens. In Polkadot, accounts start with a "5" (e.g., 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY).

### Authentication
The process of verifying the identity of a user, typically by checking credentials such as a password, token, or in our case, a wallet signature and zero-knowledge proof.

## B

### Blockchain
A distributed, immutable ledger that records transactions across a network of computers. zkID Login uses the Substrate blockchain framework.

## C

### Controller
The account that has authority to manage a DID. A controller can update or delete a DID.

### Credential
A claim about an identity, such as age verification, academic degree, or membership. In zkID Login, credentials are represented as Soul-Bound Tokens (SBTs).

### Cryptography
The science of securing information through mathematical techniques. zkID Login uses public-key cryptography and zero-knowledge proofs.

## D

### Decentralized Identifier (DID)
A globally unique identifier that enables verifiable, self-sovereign digital identity. DIDs are controlled by the identity owner rather than a centralized authority.

### DID Document
A JSON-LD document that describes a DID, including public keys and service endpoints associated with the DID.

### Digital Identity
A set of attributes that represent a person, organization, or device in digital systems.

## I

### Issuer
An entity that creates and assigns credentials (SBTs) to a DID. Issuers are typically trusted organizations or authorities.

## M

### Metadata
Additional data associated with an SBT, such as credential schema, expiration date, or other attributes.

## N

### Non-transferable
A property of Soul-Bound Tokens that prevents them from being transferred to another account or address. This ensures credentials remain with the original identity.

## P

### Pallet
A module in the Substrate blockchain framework that provides specific functionality. zkID Login uses the DID pallet and SBT pallet.

### Polkadot
A blockchain network that connects multiple specialized blockchains into a unified ecosystem. The Polkadot.js extension is used to interact with zkID Login.

### Privacy
The ability to control what personal information is shared with others. zkID Login enhances privacy through zero-knowledge proofs.

### Private Key
A cryptographic key that allows you to control your blockchain account and sign transactions. Private keys should never be shared.

### Proof
Evidence that verifies a claim. zkID Login uses zero-knowledge proofs to verify credential ownership without revealing the credential contents.

### Public Key
A cryptographic key derived from a private key that can be freely shared. It is used to verify signatures and identify accounts.

## S

### Self-sovereign Identity (SSI)
An identity system where individuals have ownership of their digital identities and control over how their personal data is shared.

### Soul-Bound Token (SBT)
A non-transferable token that represents a credential or attribute attached to a specific DID. Unlike NFTs, SBTs cannot be traded or transferred.

### Substrate
A blockchain development framework created by Parity Technologies. zkID Login is built on Substrate pallets.

## V

### Verifiable Credential
A digital credential that is cryptographically secure, privacy-respecting, and machine-verifiable.

### Verifier
An entity that checks the validity of a credential or proof presented by a user.

## W

### Wallet
Software that manages cryptographic keys and interacts with blockchain networks. zkID Login uses the Polkadot.js browser extension as a wallet.

### WebAssembly (WASM)
A binary instruction format used to execute code in web browsers. zkID Login uses WASM to run zero-knowledge proof generation in the browser.

## Z

### Zero-Knowledge Proof (ZKP)
A cryptographic method that allows one party to prove to another that a statement is true without revealing any additional information beyond the validity of the statement itself. zkID Login uses ZKPs to verify credential attributes without exposing the actual data. 