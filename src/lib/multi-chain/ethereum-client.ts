import { ethers } from 'ethers';
import { ChainClient, ChainCredential, ChainType, CrossChainIdentity } from './types';
import { createMultiChainDID, parseMultiChainDID } from './did-resolver';
import { getChainKey, getChainMetadata } from './chain-registry';

/**
 * Type definition for the Ethereum provider on window
 */
declare global {
  interface Window {
    ethereum?: {
      request: (args: {method: string, params?: any[]}) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    }
  }
}

/**
 * Ethereum DID registry contract ABI
 * This is a simplified version for demonstration - would use real contract in production
 */
const DID_REGISTRY_ABI = [
  'function identityOwner(address identity) view returns (address)',
  'function changed(address identity) view returns (uint256)',
  'function delegates(address identity, bytes32 delegateType) view returns (address[])',
  'function setAttribute(address identity, bytes32 name, bytes value, uint validity) returns (bool)',
];

/**
 * Ethereum DID registry addresses for different networks
 */
const DID_REGISTRY_ADDRESSES: Record<string, string> = {
  '1': '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', // Mainnet
  '5': '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', // Goerli testnet
  '137': '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b', // Polygon
};

/**
 * Client for interacting with Ethereum-based blockchains for DID operations
 */
export class EthereumClient implements ChainClient {
  private provider: ethers.providers.Provider | null = null;
  private chainId: string = '';
  private didRegistry: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private _connected: boolean = false;

  /**
   * Get the chain type (always ETHEREUM for this client)
   */
  getType(): ChainType {
    return ChainType.ETHEREUM;
  }

  /**
   * Get the current chain ID
   */
  async getChainId(): Promise<string> {
    if (!this.provider) {
      throw new Error('Not connected to Ethereum provider');
    }

    // Get network information
    const network = await this.provider.getNetwork();
    this.chainId = network.chainId.toString();
    return this.chainId;
  }

  /**
   * Connect to an Ethereum provider
   */
  async connect(endpoint?: string): Promise<boolean> {
    try {
      if (window.ethereum) {
        // Connect using browser provider (MetaMask, etc.)
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create a signer
        this.signer = (this.provider as ethers.providers.Web3Provider).getSigner();
      } else if (endpoint) {
        // Connect using specified endpoint
        this.provider = new ethers.providers.JsonRpcProvider(endpoint);
      } else {
        throw new Error('No Ethereum provider available');
      }

      // Get the chain ID
      await this.getChainId();
      
      // Initialize the DID registry contract
      const registryAddress = DID_REGISTRY_ADDRESSES[this.chainId];
      if (!registryAddress) {
        throw new Error(`DID registry not available for chain ID: ${this.chainId}`);
      }
      
      this.didRegistry = new ethers.Contract(
        registryAddress,
        DID_REGISTRY_ABI,
        this.signer || this.provider
      );
      
      this._connected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to Ethereum:', error);
      this._connected = false;
      return false;
    }
  }

  /**
   * Disconnect from the Ethereum provider
   */
  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.didRegistry = null;
    this._connected = false;
  }

  /**
   * Check if connected to Ethereum provider
   */
  isConnected(): boolean {
    return this._connected;
  }

  /**
   * Resolve a DID to a cross-chain identity
   */
  async resolveDid(did: string): Promise<CrossChainIdentity | null> {
    if (!this._connected || !this.didRegistry) {
      throw new Error('Not connected to Ethereum');
    }

    const parsedDid = parseMultiChainDID(did);
    if (!parsedDid || parsedDid.chainType !== ChainType.ETHEREUM) {
      throw new Error('Invalid Ethereum DID');
    }

    try {
      // Convert Ethereum address to checksum format
      const address = ethers.utils.getAddress(parsedDid.address);
      
      // Check if the identity exists
      const owner = await this.didRegistry.identityOwner(address);
      if (owner === ethers.constants.AddressZero) {
        return null;
      }
      
      // Get the last update time
      const lastChanged = await this.didRegistry.changed(address);
      const lastChangedDate = new Date(lastChanged.toNumber() * 1000).toISOString();
      
      // Get authentication delegates
      const authDelegates = await this.didRegistry.delegates(
        address,
        ethers.utils.formatBytes32String('authenticate')
      );
      
      // Get assertion delegates
      const assertionDelegates = await this.didRegistry.delegates(
        address,
        ethers.utils.formatBytes32String('assertion')
      );
      
      // Create verification methods
      const verificationMethods = [
        {
          id: `${did}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          blockchainAccountId: `eip155:${parsedDid.chainId}:${owner}`
        },
        ...authDelegates.map((delegate: string, index: number) => ({
          id: `${did}#delegate-${index + 1}`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          blockchainAccountId: `eip155:${parsedDid.chainId}:${delegate}`
        }))
      ];
      
      // Create the cross-chain identity
      const identity: CrossChainIdentity = {
        id: did,
        controller: owner,
        linkedDids: {
          [`ethereum:${parsedDid.chainId}`]: did
        },
        linkedAccounts: {
          [`ethereum:${parsedDid.chainId}`]: [address]
        },
        verificationMethods,
        services: [],
        created: lastChangedDate,
        updated: lastChangedDate
      };
      
      return identity;
    } catch (error) {
      console.error('Error resolving Ethereum DID:', error);
      return null;
    }
  }

  /**
   * Verify a credential issued on Ethereum
   */
  async verifyCredential(credential: ChainCredential): Promise<boolean> {
    if (!this._connected) {
      throw new Error('Not connected to Ethereum');
    }
    
    if (credential.chainType !== ChainType.ETHEREUM) {
      return false;
    }
    
    // In a real implementation, this would verify the credential's proof
    // using the appropriate cryptographic methods
    // For now, we'll simulate verification
    
    try {
      // Check if the credential has a proof
      if (!credential.proof) {
        return false;
      }
      
      // Mock verification logic
      const mockVerify = () => {
        // In a real implementation, we would:
        // 1. Verify the signature in the proof
        // 2. Check the issuer's authority
        // 3. Validate that the credential isn't revoked
        // 4. Check that it's not expired

        // Random success rate for demonstration
        return Math.random() > 0.2;
      };
      
      return mockVerify();
    } catch (error) {
      console.error('Error verifying Ethereum credential:', error);
      return false;
    }
  }

  /**
   * Get all accounts linked to a DID
   */
  async getLinkedAccounts(did: string): Promise<string[]> {
    if (!this._connected) {
      throw new Error('Not connected to Ethereum');
    }
    
    const parsedDid = parseMultiChainDID(did);
    if (!parsedDid || parsedDid.chainType !== ChainType.ETHEREUM) {
      return [];
    }
    
    try {
      const identity = await this.resolveDid(did);
      if (!identity) {
        return [];
      }
      
      const chainKey = `ethereum:${parsedDid.chainId}`;
      return identity.linkedAccounts[chainKey] || [];
    } catch (error) {
      console.error('Error getting linked accounts:', error);
      return [];
    }
  }

  /**
   * Create a new DID on Ethereum
   */
  async createDid(account: any): Promise<string | null> {
    if (!this._connected || !this.signer) {
      throw new Error('Not connected to Ethereum or no signer available');
    }
    
    try {
      // Get the current address
      const address = await this.signer.getAddress();
      
      // In a real implementation, we would:
      // 1. Deploy an identity contract or register with the registry
      // 2. Set initial attributes
      
      // For now, we'll just create the DID identifier
      return createMultiChainDID(ChainType.ETHEREUM, this.chainId, address);
    } catch (error) {
      console.error('Error creating Ethereum DID:', error);
      return null;
    }
  }
} 