import { 
  ChainType, 
  ChainClient, 
  CrossChainIdentity, 
  IdentityResolutionResult,
  ChainCredential
} from './types';
import { parseMultiChainDID, getChainFromDID } from './did-resolver';
import { getChainKey } from './chain-registry';

// Import chain-specific clients
// These will be dynamically loaded and instantiated
// Note: These imports would be used in real implementation
// For now, we'll mock the clients using a factory pattern
// import { EthereumClient } from './ethereum-client';
// import { SubstrateClient } from './substrate-client';
// import { SolanaClient } from './solana-client';

/**
 * Factory function to create chain-specific clients
 */
function createChainClient(chainType: ChainType): ChainClient | null {
  // In a real implementation, we would import and instantiate the actual clients
  // For now, we'll just create mock clients
  return {
    getType: () => chainType,
    getChainId: async () => '1', // Mock chain ID
    connect: async () => true,
    disconnect: async () => {},
    isConnected: () => true,
    resolveDid: async () => null,
    verifyCredential: async () => true,
    getLinkedAccounts: async () => [],
    createDid: async () => null
  };
}

/**
 * Cross-Chain Identity Manager
 * Orchestrates and coordinates identity operations across multiple blockchains
 */
export class CrossChainIdentityManager {
  private static instance: CrossChainIdentityManager;
  private clients: Map<ChainType, ChainClient> = new Map();
  private activeDID: string | null = null;
  private identityCache: Map<string, CrossChainIdentity> = new Map();
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): CrossChainIdentityManager {
    if (!this.instance) {
      this.instance = new CrossChainIdentityManager();
    }
    return this.instance;
  }
  
  /**
   * Initialize a specific chain client
   */
  public async initializeChain(chainType: ChainType, endpoint?: string): Promise<boolean> {
    try {
      // Check if client already exists
      let client = this.clients.get(chainType);
      
      // Create new client if needed
      if (!client) {
        client = createChainClient(chainType);
        if (!client) {
          console.error(`No client implementation available for chain type: ${chainType}`);
          return false;
        }
        this.clients.set(chainType, client);
      }
      
      // Connect to the chain
      const connected = await client.connect(endpoint);
      return connected;
    } catch (error) {
      console.error(`Error initializing chain ${chainType}:`, error);
      return false;
    }
  }
  
  /**
   * Initialize multiple chains
   */
  public async initializeChains(chains: ChainType[]): Promise<Map<ChainType, boolean>> {
    const results = new Map<ChainType, boolean>();
    
    for (const chainType of chains) {
      const success = await this.initializeChain(chainType);
      results.set(chainType, success);
    }
    
    return results;
  }
  
  /**
   * Resolve a DID across chains
   * If the DID is a multi-chain DID, it will resolve the specific chain.
   * Otherwise, it will search across all initialized chains.
   */
  public async resolveDID(did: string): Promise<IdentityResolutionResult> {
    // Check if DID is a multi-chain DID
    const didInfo = getChainFromDID(did);
    
    if (didInfo) {
      // It's a multi-chain DID, resolve using the specific chain
      const client = this.clients.get(didInfo.chainType);
      
      if (!client) {
        return { 
          success: false, 
          error: `Chain not initialized: ${didInfo.chainType}` 
        };
      }
      
      try {
        const identity = await client.resolveDid(did);
        
        if (!identity) {
          return { 
            success: false, 
            error: `DID not found: ${did}` 
          };
        }
        
        // Cache the identity
        this.identityCache.set(did, identity);
        
        return {
          success: true,
          identity
        };
      } catch (error) {
        return { 
          success: false, 
          error: `Error resolving DID: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    } else {
      // It's not a multi-chain DID or we couldn't parse it
      // Try to resolve across all initialized chains
      const errors: string[] = [];
      
      for (const client of this.clients.values()) {
        try {
          const identity = await client.resolveDid(did);
          
          if (identity) {
            // Found the identity on this chain
            this.identityCache.set(did, identity);
            
            return {
              success: true,
              identity
            };
          }
        } catch (error) {
          errors.push(`${client.getType()}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      return { 
        success: false, 
        error: `DID not found on any chain. Errors: ${errors.join('; ')}` 
      };
    }
  }
  
  /**
   * Create a new DID on a specific chain
   */
  public async createDID(chainType: ChainType, account: any): Promise<string | null> {
    const client = this.clients.get(chainType);
    
    if (!client) {
      throw new Error(`Chain not initialized: ${chainType}`);
    }
    
    return client.createDid(account);
  }
  
  /**
   * Verify a credential across chains
   */
  public async verifyCredential(credential: ChainCredential): Promise<boolean> {
    // Get the appropriate client for this credential
    const client = this.clients.get(credential.chainType);
    
    if (!client) {
      console.error(`No client initialized for chain type: ${credential.chainType}`);
      return false;
    }
    
    try {
      return await client.verifyCredential(credential);
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }
  
  /**
   * Link an existing DID from one chain to the active DID
   */
  public async linkDID(targetDid: string): Promise<boolean> {
    if (!this.activeDID) {
      throw new Error('No active DID. Set an active DID first.');
    }
    
    // Resolve both DIDs
    const sourceResult = await this.resolveDID(this.activeDID);
    const targetResult = await this.resolveDID(targetDid);
    
    if (!sourceResult.success || !sourceResult.identity) {
      throw new Error(`Could not resolve source DID: ${this.activeDID}`);
    }
    
    if (!targetResult.success || !targetResult.identity) {
      throw new Error(`Could not resolve target DID: ${targetDid}`);
    }
    
    // In a real implementation, we would:
    // 1. Verify ownership of both DIDs
    // 2. Create a link record on both chains
    // 3. Update the identity data
    
    // For now, just mock a successful linking
    console.log(`Linked DIDs: ${this.activeDID} -> ${targetDid}`);
    
    return true;
  }
  
  /**
   * Set the active DID for operations
   */
  public setActiveDID(did: string): void {
    this.activeDID = did;
  }
  
  /**
   * Get the active DID
   */
  public getActiveDID(): string | null {
    return this.activeDID;
  }
  
  /**
   * Get all initialized chains
   */
  public getInitializedChains(): ChainType[] {
    return Array.from(this.clients.keys());
  }
  
  /**
   * Disconnect from all chains
   */
  public async disconnectAll(): Promise<void> {
    for (const client of this.clients.values()) {
      await client.disconnect();
    }
    
    this.clients.clear();
    this.activeDID = null;
    this.identityCache.clear();
  }
} 