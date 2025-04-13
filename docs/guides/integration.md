# Integration Guide

This guide explains how to integrate zkID Login into your existing web application.

## Overview

zkID Login offers multiple integration options:

1. **Complete UI Integration**: Embed the entire zkID Login experience
2. **API Integration**: Use the underlying APIs without the UI
3. **Custom Integration**: Mix and match components as needed

## Prerequisites

Before integrating zkID Login, ensure:

- Your users have the Polkadot.js browser extension installed
- You understand the basic concepts of DIDs and SBTs
- For API integration, familiarity with Polkadot.js API is recommended

## Integration Options

### Option 1: Complete UI Integration

The simplest approach is to embed the entire zkID Login experience into your application.

#### 1. Install the Package

```bash
npm install zkid-login
# or
yarn add zkid-login
```

#### 2. Import and Use the Component

```jsx
import { ZkIDLogin } from 'zkid-login';

function MyApp() {
  const handleAuth = (identity) => {
    console.log('User authenticated:', identity);
    // Your authentication logic here
  };

  return (
    <div className="app">
      <h1>My Application</h1>
      <ZkIDLogin 
        onAuthenticated={handleAuth}
        theme="cyberpunk" // optional: default, cyberpunk, minimal
      />
    </div>
  );
}
```

### Option 2: API Integration

For applications that need full control over the UI, you can use the zkID APIs directly.

#### 1. Install the Required Packages

```bash
npm install @zkid/substrate-client @polkadot/extension-dapp
# or
yarn add @zkid/substrate-client @polkadot/extension-dapp
```

#### 2. Initialize the Client

```javascript
import { SubstrateClient } from '@zkid/substrate-client';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

async function initializeZkID() {
  // Initialize Substrate client
  const client = SubstrateClient.getInstance();
  await client.connect();

  // Enable the Polkadot.js extension
  await web3Enable('My Application');
  
  // Get accounts from the extension
  const accounts = await web3Accounts();
  
  if (accounts.length === 0) {
    console.log('No accounts found. Please add an account to Polkadot.js extension');
    return null;
  }
  
  return { client, accounts };
}
```

#### 3. Get User Identity

```javascript
async function getUserIdentity(client, account) {
  const identity = await client.getUserIdentity(account);
  if (!identity) {
    console.log('No identity found for this account');
    return null;
  }
  
  return identity;
}
```

#### 4. Create a DID if Needed

```javascript
async function createUserDID(client, account) {
  const didId = await client.createDid(account);
  console.log('New DID created:', didId);
  return didId;
}
```

#### 5. Verify ZK Proofs

```javascript
async function verifyUserProof(client, proof, did) {
  const isValid = await client.verifyProof(proof, did);
  return isValid;
}
```

### Option 3: Custom Integration

For more flexibility, you can use individual components:

```jsx
import { WalletLogin, CredentialDisplay, ProofGenerator } from 'zkid-login/components';
import { SubstrateClient } from '@zkid/substrate-client';

// See the component documentation for usage details
```

## Configuration

### Environment Variables

Your application should include the following environment variables:

```
NEXT_PUBLIC_USE_REAL_NODE=true
NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://your-substrate-node-address:9944
```

### Node Types

If using a custom Substrate node, you may need to specify custom types:

```javascript
const customTypes = {
  DidRecord: {
    controller: 'AccountId',
    created: 'u64',
    updated: 'u64'
  },
  SbtRecord: {
    issuer: 'AccountId',
    name: 'Vec<u8>',
    description: 'Option<Vec<u8>>',
    issuedAt: 'u64',
    metadata: 'Option<Vec<u8>>'
  }
};

// Pass these types when initializing the client
await client.connect(nodeUrl, customTypes);
```

## Session Management

zkID Login provides built-in session management, but you can implement your own:

```javascript
// Store session
function storeSession(account, identity) {
  localStorage.setItem('zkid-session', JSON.stringify({
    account,
    identity,
    timestamp: Date.now()
  }));
}

// Retrieve session
function getSession() {
  const session = localStorage.getItem('zkid-session');
  if (!session) return null;
  
  try {
    const parsed = JSON.parse(session);
    // Check if session is still valid (e.g., not expired)
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('zkid-session');
      return null;
    }
    return parsed;
  } catch (e) {
    localStorage.removeItem('zkid-session');
    return null;
  }
}
```

## Security Considerations

When integrating zkID Login, be aware of the following security aspects:

1. **Always verify proofs**: Never trust client-side verification alone
2. **Use HTTPS**: All communication should be encrypted
3. **Server verification**: For sensitive operations, verify DIDs and proofs on your server
4. **Session timeout**: Implement appropriate session expiration

## Example Integration Flow

1. User visits your application
2. User clicks "Login with zkID"
3. Application initializes the SubstrateClient and prompts for wallet connection
4. User selects an account from their Polkadot.js extension
5. Application checks if a DID exists for the account
6. If no DID exists, offer to create one
7. Once authenticated, display the user's credentials
8. For restricted operations, request a ZK proof
9. Verify the proof before granting access

## Troubleshooting

Common integration issues:

- **Extension not found**: Ensure the Polkadot.js extension is installed and enabled
- **Connection errors**: Check your Substrate node endpoint and network connectivity
- **DID creation failures**: Verify the user has funds for transaction fees
- **Proof verification issues**: Check that the proof format matches the expected format

## Next Steps

After integration, you may want to:

- [Customize the UI](../guides/ui-customization.md)
- [Implement server-side verification](../guides/server-verification.md)
- [Issue custom SBTs](../guides/custom-sbts.md) 