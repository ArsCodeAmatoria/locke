# Installation Guide

This guide will walk you through the process of setting up zkID Login locally for development or testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: Required for the Next.js frontend
  ```bash
  # Check your Node.js version
  node --version
  
  # If you need to install or update, use nvm (Node Version Manager)
  # https://github.com/nvm-sh/nvm
  ```

- **Polkadot.js Browser Extension**: Required for wallet connectivity
  - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/)
  - [Chrome Extension](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)

- Optional for full functionality:
  - **Rust and Cargo**: For running or modifying the Substrate chain
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/zkid-login.git
cd zkid-login
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```
# Substrate Node Configuration
NEXT_PUBLIC_USE_REAL_NODE=false
NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://127.0.0.1:9944
```

For development, you can keep `NEXT_PUBLIC_USE_REAL_NODE=false` to use mock data.

### 4. Start the Development Server

```bash
npm run dev
```

This will start the Next.js development server, making the application available at [http://localhost:3000](http://localhost:3000).

## Full Stack Installation

If you want to run the complete stack including the Substrate node:

### 5. Install Substrate Prerequisites

```bash
# Update and prepare Rust
rustup default stable
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

### 6. Run the Substrate Node

```bash
# Make the start script executable
chmod +x start-node.sh

# Start the node
./start-node.sh
```

Or start the node manually:

```bash
substrate \
  --dev \
  --tmp \
  --ws-external \
  --rpc-external \
  --rpc-cors=all
```

### 7. Connect Frontend to Real Node

Update your `.env.local` to connect to the Substrate node:

```
NEXT_PUBLIC_USE_REAL_NODE=true
NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://127.0.0.1:9944
```

Then start the frontend with:

```bash
npm run dev:real
```

## Verifying Installation

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Connect your Polkadot.js wallet when prompted
3. Create a DID if you don't have one
4. You should see a UI displaying your account information and available credentials

## Troubleshooting

If you encounter issues:

- Ensure your Polkadot.js extension is properly installed and enabled
- For connection issues, check the Substrate node is running (if using a real node)
- Check the browser console for any error messages
- Refer to the [Troubleshooting Guide](troubleshooting.md) for more common issues

## Next Steps

After successfully installing the system, you may want to:

- [Learn how to integrate with your application](integration.md)
- [Explore the API documentation](../api/substrate-client.md)
- [Set up a development environment](development-setup.md) 