import { ChainMetadata, ChainType } from './types';

/**
 * Chain registry containing metadata for all supported blockchain networks
 */
export const chainRegistry: Record<string, ChainMetadata> = {
  // Substrate/Polkadot chains
  'substrate:polkadot': {
    id: 'polkadot',
    name: 'Polkadot',
    type: ChainType.SUBSTRATE,
    icon: '/icons/polkadot.svg',
    nativeToken: 'DOT',
    blockExplorer: 'https://polkadot.subscan.io',
    defaultRpcUrl: 'wss://rpc.polkadot.io',
    testnetRpcUrl: 'wss://westend-rpc.polkadot.io'
  },
  'substrate:kusama': {
    id: 'kusama',
    name: 'Kusama',
    type: ChainType.SUBSTRATE,
    icon: '/icons/kusama.svg',
    nativeToken: 'KSM',
    blockExplorer: 'https://kusama.subscan.io',
    defaultRpcUrl: 'wss://kusama-rpc.polkadot.io',
  },
  
  // Ethereum chains
  'ethereum:1': {
    id: '1',
    name: 'Ethereum Mainnet',
    type: ChainType.ETHEREUM,
    icon: '/icons/ethereum.svg',
    nativeToken: 'ETH',
    blockExplorer: 'https://etherscan.io',
    defaultRpcUrl: 'https://mainnet.infura.io/v3/',
    testnetRpcUrl: 'https://goerli.infura.io/v3/'
  },
  'ethereum:137': {
    id: '137',
    name: 'Polygon',
    type: ChainType.ETHEREUM,
    icon: '/icons/polygon.svg',
    nativeToken: 'MATIC',
    blockExplorer: 'https://polygonscan.com',
    defaultRpcUrl: 'https://polygon-rpc.com',
  },
  
  // Solana chains
  'solana:mainnet': {
    id: 'mainnet',
    name: 'Solana',
    type: ChainType.SOLANA,
    icon: '/icons/solana.svg',
    nativeToken: 'SOL',
    blockExplorer: 'https://explorer.solana.com',
    defaultRpcUrl: 'https://api.mainnet-beta.solana.com',
    testnetRpcUrl: 'https://api.devnet.solana.com'
  },
  
  // Cosmos chains
  'cosmos:cosmoshub-4': {
    id: 'cosmoshub-4',
    name: 'Cosmos Hub',
    type: ChainType.COSMOS,
    icon: '/icons/cosmos.svg',
    nativeToken: 'ATOM',
    blockExplorer: 'https://cosmos.bigdipper.live',
    defaultRpcUrl: 'https://rpc.cosmos.network',
  },
  
  // NEAR chains
  'near:mainnet': {
    id: 'mainnet',
    name: 'NEAR Protocol',
    type: ChainType.NEAR,
    icon: '/icons/near.svg',
    nativeToken: 'NEAR',
    blockExplorer: 'https://explorer.near.org',
    defaultRpcUrl: 'https://rpc.mainnet.near.org',
    testnetRpcUrl: 'https://rpc.testnet.near.org'
  }
};

/**
 * Get chain metadata by chain key (format: chainType:chainId)
 */
export function getChainMetadata(chainKey: string): ChainMetadata | null {
  return chainRegistry[chainKey] || null;
}

/**
 * Get all supported chains
 */
export function getAllChains(): ChainMetadata[] {
  return Object.values(chainRegistry);
}

/**
 * Get all chains of a specific type
 */
export function getChainsByType(chainType: ChainType): ChainMetadata[] {
  return Object.values(chainRegistry).filter(chain => chain.type === chainType);
}

/**
 * Get chain key from type and id
 */
export function getChainKey(chainType: ChainType, chainId: string): string {
  return `${chainType}:${chainId}`;
}

/**
 * Parse a chain key into its components
 */
export function parseChainKey(chainKey: string): { chainType: ChainType, chainId: string } | null {
  const parts = chainKey.split(':');
  if (parts.length !== 2) return null;
  
  const chainType = parts[0] as ChainType;
  const chainId = parts[1];
  
  // Validate chain type
  if (!Object.values(ChainType).includes(chainType)) return null;
  
  return { chainType, chainId };
} 