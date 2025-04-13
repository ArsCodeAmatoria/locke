# Frequently Asked Questions

## General Questions

### What is zkID Login?

zkID Login is a decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs. It allows users to prove their identity and credentials without revealing sensitive information.

### How is zkID Login different from traditional login methods?

Traditional login methods typically require a centralized authority to manage user accounts and store sensitive data. zkID Login puts users in control of their identity by:

1. Using blockchain-based DIDs instead of username/password
2. Storing credentials as Soul-Bound Tokens
3. Preserving privacy with zero-knowledge proofs
4. Eliminating the need for a centralized identity provider

### Is zkID Login secure?

Yes. zkID Login uses industry-standard cryptography and blockchain technology to ensure security:

- Private keys never leave your device
- Identity data is stored on a secure blockchain
- Zero-knowledge proofs protect sensitive information
- Credentials cannot be forged or transferred

### Do I need to have cryptocurrency to use zkID Login?

A small amount of cryptocurrency is needed for:
- Creating a DID (one-time cost)
- Updating identity information (rare)

However, once your DID is established, most verification activities don't require transaction fees.

## Technical Questions

### What blockchain does zkID Login use?

zkID Login is built on Substrate, the same technology that powers the Polkadot ecosystem. The system can be deployed on any Substrate-based chain.

### What are Zero-Knowledge Proofs?

Zero-knowledge proofs are cryptographic techniques that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any additional information. 

For example, you could prove you're over 18 without revealing your exact birthdate.

### How do Soul-Bound Tokens work?

Soul-Bound Tokens (SBTs) are non-transferable tokens that represent credentials or attributes. Unlike NFTs or other tokens, SBTs:

- Cannot be transferred between accounts
- Are permanently bound to a specific DID
- Contain verifiable credential data
- Can be cryptographically verified

### Can I use zkID Login on mobile devices?

Yes, zkID Login works on mobile devices that support the Polkadot.js mobile app or other compatible wallets.

## User Questions

### How do I get started with zkID Login?

To get started:
1. Install the Polkadot.js browser extension
2. Create or import a Polkadot account
3. Visit a website or app that supports zkID Login
4. Connect your wallet and create a DID

See our [User Guide](user-guide.md) for detailed instructions.

### What happens if I lose access to my wallet?

If you lose access to your wallet:
1. You can recover your account using your seed phrase
2. Your DID and credentials will still be associated with your account
3. No one else can access your credentials without your private key

This is why securely backing up your seed phrase is extremely important.

### How do I obtain credentials (SBTs)?

Credentials are issued by trusted organizations, known as issuers. The process typically involves:

1. Completing verification with the issuer (e.g., KYC process)
2. The issuer creating and assigning an SBT to your DID
3. The credential appearing in your zkID Login interface

### Can I revoke access to my credentials?

Yes, you have full control over your credentials. You can:
- Choose when to share proofs of your credentials
- Revoke access to previously granted verifications
- Control exactly what information is shared

## Developer Questions

### How do I integrate zkID Login into my application?

You can integrate zkID Login into your application by:
1. Installing the zkID Login SDK
2. Configuring your connection to a Substrate node
3. Adding the login component to your UI

See our [Integration Guide](integration.md) for detailed instructions.

### Can I customize the user interface?

Yes, zkID Login offers several customization options:
- Multiple themes (default, cyberpunk, minimal)
- Custom CSS overrides
- Component-level integration for full UI control

### What types of credentials can be issued?

Any type of credential can be represented as an SBT, including:
- Identity verification (KYC/AML)
- Age verification
- Educational credentials
- Professional certifications
- Memberships
- Government-issued documents

### How do I issue SBTs to users?

To issue SBTs:
1. Set up an issuer account on the blockchain
2. Implement the SBT issuance API
3. Create and sign SBT transactions
4. Assign SBTs to user DIDs

See our [Credential Issuance Guide](credential-issuance.md) for detailed instructions.

## Privacy and Compliance

### Is zkID Login GDPR compliant?

zkID Login is designed with privacy in mind and supports GDPR compliance:
- Users control their own data
- No unnecessary personal data is stored on-chain
- Zero-knowledge proofs minimize data exposure
- Users can exercise their "right to be forgotten" by deleting their DID

However, organizations implementing zkID Login should ensure their specific usage complies with relevant regulations.

### What data is stored on the blockchain?

zkID Login stores minimal data on the blockchain:
- DIDs (public identifiers)
- SBT metadata (credential type, issuer, issuance date)
- Cryptographic proofs

Sensitive personal data is never stored directly on-chain.

### Can my credentials be viewed by others?

No, your credentials cannot be viewed by others unless you explicitly share them. While the existence of credentials is recorded on the blockchain, the content remains private and can only be selectively disclosed through zero-knowledge proofs.

### How long are my credentials valid?

Credential validity depends on the issuer's policies:
- Some credentials may have explicit expiration dates
- Others may be valid indefinitely
- Issuers can revoke credentials if necessary

The validity period is specified in the credential metadata. 