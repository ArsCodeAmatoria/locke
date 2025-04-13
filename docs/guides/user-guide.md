# User Guide

This guide walks you through using the zkID Login system as an end user.

## Getting Started

### What You'll Need

1. **A Web Browser**: Chrome, Firefox, or Edge recommended
2. **Polkadot.js Extension**: A browser extension for managing Polkadot accounts
3. **An Account**: A Polkadot account with some tokens for transaction fees

### Installing the Polkadot.js Extension

1. Visit the extension store for your browser:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/)

2. Click "Add to [Browser]" and follow the installation prompts
3. Once installed, you'll see the Polkadot{.js} icon in your browser toolbar

### Creating a Polkadot Account

1. Click the Polkadot{.js} extension icon in your browser
2. Click the "+" button to add a new account
3. Save the seed phrase in a safe place (this is your account recovery phrase)
4. Enter a name for your account
5. Create a password
6. Click "Add the account with the generated seed"

## Using zkID Login

### Connecting Your Wallet

1. Navigate to the zkID Login application
2. Click the "CONNECT WALLET" button
3. A popup from the Polkadot.js extension will appear
4. Select the account you want to use and click "Approve"

![Wallet Connection](../img/wallet-connection.png)

### Creating Your Decentralized Identity (DID)

If this is your first time using zkID Login, you'll need to create a DID:

1. After connecting your wallet, if no DID exists, you'll see a prompt to create one
2. Click the "CREATE DECENTRALIZED IDENTITY" button
3. The Polkadot.js extension will ask you to sign a transaction
4. Enter your password and click "Sign the transaction"
5. Wait for the transaction to be confirmed (this may take a few seconds)

![Creating DID](../img/create-did.png)

### Viewing Your Credentials

Once you have a DID, you'll see your credential information:

1. Your DID identifier is displayed at the top
2. Below that, you'll see any Soul-Bound Tokens (SBTs) you've received
3. Each SBT shows information about:
   - The credential name
   - Who issued it
   - When it was issued
   - Any additional metadata

![Credential Display](../img/credential-display.png)

### Generating Zero-Knowledge Proofs

To verify your credentials without revealing sensitive data:

1. Click the "VERIFY IDENTITY" button
2. The proof generation process will begin
3. You'll see a progress indicator while the proof is being generated
4. Once complete, the verification status will update to "Verified"

![Proof Generation](../img/proof-generation.png)

### Signing Out

1. Click the "DISCONNECT" button
2. Your session will be ended and your wallet disconnected

## Understanding DIDs and SBTs

### What is a DID?

A Decentralized Identifier (DID) is a unique digital identity that:

- Is controlled by you, not a centralized authority
- Is stored on the blockchain
- Can be linked to verifiable credentials
- Follows the format `did:substrate:[your-address]`

### What are SBTs?

Soul-Bound Tokens (SBTs) are non-transferable digital credentials that:

- Are issued to your DID
- Represent verifiable claims (like KYC verification, memberships, certifications)
- Cannot be transferred to another person
- Contain metadata about the credential

## Privacy and Security

### Zero-Knowledge Proofs

zkID Login uses zero-knowledge proofs to protect your privacy:

- You can prove you possess valid credentials without revealing their contents
- For example, you can prove you're over 18 without revealing your exact age
- Proofs are generated in your browser using secure cryptography

### Wallet Security

To keep your zkID Login secure:

1. Never share your seed phrase or password
2. Always verify transaction details in the Polkadot.js extension
3. Use a strong, unique password for your wallet
4. Consider a hardware wallet for additional security

## Troubleshooting

### Common Issues

#### "No accounts found"
- Ensure the Polkadot.js extension is installed and enabled
- Add at least one account to the extension

#### "Failed to create DID"
- Check that you have sufficient tokens for transaction fees
- Try again later if the network is congested

#### "Proof generation failed"
- Try refreshing the page
- Ensure your browser allows Web Assembly execution
- Try a different browser if problems persist

#### "Extension not responding"
- Check that your extension is up to date
- Try restarting your browser

### Getting Help

If you encounter issues not covered here:

1. Check the [FAQ section](faq.md)
2. Visit the support forum at [forum.zkid.io](https://forum.zkid.io)
3. Join the community chat on [Discord](https://discord.gg/zkidlogin)

## Next Steps

After becoming familiar with zkID Login, you might want to:

- [Learn about advanced features](advanced-features.md)
- [Integrate zkID Login with your own website](integration.md)
- [Contribute to the development](contributing.md) 