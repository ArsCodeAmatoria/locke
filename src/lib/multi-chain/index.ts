/**
 * Multi-chain identity management module
 * Provides tools and utilities for managing identities across multiple blockchains
 */

// Export types
export * from './types';

// Export chain registry functions
export {
  chainRegistry,
  getChainMetadata,
  getAllChains,
  getChainsByType,
  getChainKey,
  parseChainKey
} from './chain-registry';

// Export DID resolver functions
export {
  parseMultiChainDID,
  createMultiChainDID,
  convertToMultiChainDID,
  getChainKeyFromDID,
  getChainFromDID,
  buildDIDDocument
} from './did-resolver';

// Export the cross-chain identity manager
export { CrossChainIdentityManager } from './identity-manager';

// Export the React hook
export { useMultiChain } from './use-multi-chain';

// Export chain-specific clients
// Note: These would be uncommented in a real implementation
// export { EthereumClient } from './ethereum-client';
// export { SubstrateClient } from './substrate-client';
// export { SolanaClient } from './solana-client';
// export { CosmosClient } from './cosmos-client'; 