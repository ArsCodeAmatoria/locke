# Development Environment Setup

This guide walks you through setting up a development environment for contributing to or extending the zkID Login system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: Required for the Next.js frontend
- **Git**: For version control
- **Rust & Cargo**: For Substrate development
- **Docker**: Optional, for containerized development
- **VS Code** (recommended): With extensions for Rust and TypeScript

## Frontend Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/zkid-login.git
cd zkid-login
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```
# Development with Mock Data
NEXT_PUBLIC_USE_REAL_NODE=false
NEXT_PUBLIC_SUBSTRATE_NODE_URL=ws://127.0.0.1:9944
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

### 5. Frontend Development Tips

- **Component Structure**: UI components are located in `src/components/`
- **Routing**: Pages are in `src/app/` following Next.js 14 App Router conventions
- **State Management**: The application uses React hooks for state management
- **Styling**: Tailwind CSS is used for styling with custom classes in `src/styles/`

## Substrate Node Development

### 1. Install Rust and Substrate Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

# Install Additional Dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install build-essential clang cmake protobuf-compiler
```

For other operating systems, see the [Substrate documentation](https://docs.substrate.io/install/).

### 2. Clone the Substrate Node Repository

```bash
git clone https://github.com/your-org/zkid-substrate-node.git
cd zkid-substrate-node
```

### 3. Build the Node

```bash
cargo build --release
```

This may take a while the first time.

### 4. Run the Development Node

```bash
./target/release/zkid-node --dev --tmp
```

The node will be available at ws://127.0.0.1:9944.

### 5. Modify Substrate Pallets

The zkID Login system uses two main pallets:

- **DID Pallet**: Located at `substrate/pallet-did`
- **SBT Pallet**: Located at `substrate/pallet-sbt`

After making changes to a pallet, rebuild the node:

```bash
cargo build --release
```

## WebAssembly (ZK Proof) Development

### 1. Set Up Rust WebAssembly

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

### 2. Navigate to the WASM Module

```bash
cd wasm-zkp
```

### 3. Build the WASM Module

```bash
wasm-pack build --target web
```

This creates a `pkg` directory with the compiled WASM module.

### 4. Link the WASM Module to Frontend

```bash
# From the project root
npm run link-wasm
```

This script copies the built WASM files to the frontend.

## Full Stack Development Workflow

For the best development experience, you'll want to run both frontend and backend:

### 1. Terminal 1: Run the Substrate Node

```bash
cd zkid-substrate-node
./target/release/zkid-node --dev --tmp
```

### 2. Terminal 2: Run the Frontend

```bash
cd zkid-login
npm run dev:real
```

This connects to your local Substrate node.

## Testing

### Frontend Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

### Substrate Testing

```bash
cd substrate/pallet-did
cargo test

cd ../pallet-sbt
cargo test
```

### WASM Testing

```bash
cd wasm-zkp
cargo test
```

## IDE Configuration

### VS Code Setup

Install the following extensions:
- Rust Analyzer
- rust-analyzer
- WebAssembly
- ESLint
- Prettier
- Tailwind CSS IntelliSense

#### Recommended settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "rust-analyzer.checkOnSave.command": "clippy"
}
```

## Debugging

### Frontend Debugging

1. Use Chrome DevTools or VS Code debugger
2. Log statements in the browser console
3. React DevTools for component inspection

### Substrate Debugging

1. Run the node with debug output:
   ```bash
   RUST_LOG=debug ./target/release/zkid-node --dev
   ```

2. Inspect events, storage, and extrinsics using Polkadot.js Apps:
   - Open https://polkadot.js.org/apps/
   - Connect to your local node (ws://127.0.0.1:9944)

### WASM Debugging

1. Use `console.log` statements in your Rust code:
   ```rust
   #[wasm_bindgen]
   extern "C" {
       #[wasm_bindgen(js_namespace = console)]
       fn log(s: &str);
   }
   
   // Then use it like:
   log("Debugging WASM: some value");
   ```

2. Inspect WebAssembly in Chrome DevTools (Sources tab)

## Common Issues

### "Failed to compile Substrate node"

- Ensure all dependencies are installed
- Try cleaning the build: `cargo clean`

### "Cannot connect to WebSocket"

- Check if the Substrate node is running
- Verify the WebSocket port (default: 9944)

### "WASM module not found"

- Rebuild the WASM module: `cd wasm-zkp && wasm-pack build --target web`
- Run the link script: `npm run link-wasm`

## Next Steps

After setting up your development environment:

- [Learn about the architecture](architecture.md)
- [Code contribution guidelines](contributing.md)
- [API documentation](../api/substrate-client.md) 