/**
 * Multi-chain support type definitions
 * These types define the core structures for cross-chain identity resolution
 */

/**
 * Supported blockchain networks
 */
export enum ChainType {
  SUBSTRATE = 'substrate',
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  NEAR = 'near'
}

/**
 * ChainMetadata provides information about a supported blockchain
 */
export interface ChainMetadata {
  id: string;
  name: string;
  type: ChainType;
  icon: string;
  nativeToken: string;
  blockExplorer: string;
  defaultRpcUrl: string;
  testnetRpcUrl?: string;
}

/**
 * Multi-chain DID format
 * Format: did:multi:<chain-type>:<chain-id>:<address>
 */
export interface MultiChainDID {
  method: 'multi';
  chainType: ChainType;
  chainId: string;
  address: string;
  raw: string; // The complete DID string
}

/**
 * Chain-specific credential format
 */
export interface ChainCredential {
  id: string;
  chainType: ChainType;
  chainId: string;
  issuer: string;
  subject: string;
  type: string[];
  issuanceDate: string;
  expirationDate?: string;
  properties: Record<string, any>;
  proof?: any;
}

/**
 * Cross-chain identity - links identities across multiple chains
 */
export interface CrossChainIdentity {
  id: string; // Master DID
  controller: string;
  linkedDids: {
    [chainKey: string]: string; // chainKey = chainType:chainId
  };
  linkedAccounts: {
    [chainKey: string]: string[]; // Multiple addresses per chain
  };
  verificationMethods: {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
    blockchainAccountId?: string;
  }[];
  services: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
  created: string;
  updated: string;
}

/**
 * Interface for chain-specific client implementations
 */
export interface ChainClient {
  getType(): ChainType;
  getChainId(): Promise<string>;
  connect(endpoint?: string): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  resolveDid(did: string): Promise<CrossChainIdentity | null>;
  verifyCredential(credential: ChainCredential): Promise<boolean>;
  getLinkedAccounts(did: string): Promise<string[]>;
  createDid(account: any): Promise<string | null>;
}

/**
 * Result of a cross-chain identity resolution
 */
export interface IdentityResolutionResult {
  success: boolean;
  identity?: CrossChainIdentity;
  credentials?: ChainCredential[];
  error?: string;
}

/**
 * Bridge transaction for cross-chain message passing
 */
export interface BridgeTransaction {
  id: string;
  sourceChain: {
    type: ChainType;
    id: string;
  };
  targetChain: {
    type: ChainType;
    id: string;
  };
  payload: any;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  timestamp: string;
} 