'use client';

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { web3FromAddress } from '@polkadot/extension-dapp';

// Types
export interface DID {
  id: string;
  controller: string;
  created: string;
  updated: string;
}

export interface SBT {
  id: string;
  name: string;
  description?: string;
  issuer: string;
  issuedAt: string;
  metadata?: Record<string, any>;
}

export interface UserIdentity {
  did: DID;
  sbts: SBT[];
}

// Mock data generator for development without a real node
const generateMockData = () => {
  const mockDids: Record<string, DID> = {};
  const mockSBTs: Record<string, SBT[]> = {};
  
  // Sample credential types for mock data
  const credentialTypes = [
    'KYC Verification',
    'Age Credential',
    'Citizenship Verification',
    'Education Credential',
    'Professional License'
  ];
  
  return {
    createDid: (address: string): string => {
      const timestamp = Date.now();
      const didId = `did:substrate:${address.substring(0, 16)}`;
      
      mockDids[address] = {
        id: didId,
        controller: address,
        created: new Date(timestamp).toISOString(),
        updated: new Date(timestamp).toISOString(),
      };
      
      // Create a random number of sample credentials
      const numCredentials = Math.floor(Math.random() * 3);
      mockSBTs[address] = [];
      
      for (let i = 0; i < numCredentials; i++) {
        const credentialType = credentialTypes[Math.floor(Math.random() * credentialTypes.length)];
        mockSBTs[address].push({
          id: `sbt:${Math.random().toString(36).substring(2, 10)}`,
          name: credentialType,
          issuer: `did:substrate:issuer:${Math.random().toString(36).substring(2, 10)}`,
          issuedAt: new Date(timestamp - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
          description: 'A verifiable credential stored as a Soul-Bound Token',
          metadata: {
            schema: 'https://example.com/schemas/credential',
            version: '1.0'
          }
        });
      }
      
      return didId;
    },
    
    getDid: (address: string): DID | null => {
      return mockDids[address] || null;
    },
    
    getSbts: (address: string): SBT[] => {
      return mockSBTs[address] || [];
    },
    
    verifyProof: (proof: string, didId: string): Promise<boolean> => {
      // Simulate verification with 90% success rate
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() < 0.9);
        }, 1000);
      });
    }
  };
};

// Substrate client for interacting with the blockchain
export class SubstrateClient {
  private static instance: SubstrateClient;
  private api: ApiPromise | null = null;
  private mockDataGenerator = generateMockData();
  private isConnected = false;
  private useMockData = false;

  private constructor() {
    // Determine whether to use real node or mock data
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    
    if (!this.useMockData) {
      // Initialize mock data for development/testing
      this.initMockData();
    }
  }

  public static getInstance(): SubstrateClient {
    if (!SubstrateClient.instance) {
      SubstrateClient.instance = new SubstrateClient();
    }
    return SubstrateClient.instance;
  }

  private initMockData() {
    // Generate some mock DIDs and SBTs for demo purposes
    const addresses = [
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
    ];

    addresses.forEach((address, index) => {
      const did: DID = {
        id: `did:substrate:${address}`,
        controller: address,
        created: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updated: new Date().toISOString(),
      };

      this.mockDataGenerator.getDid(address);

      const sbts: SBT[] = [];
      
      // Generate 1-3 random SBTs for each address
      const numSbts = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numSbts; i++) {
        const sbtTypes = [
          'Digital Identity Verification',
          'KYC Approval',
          'Community Membership',
          'Educational Credential',
          'Professional Certification',
        ];
        
        const issuers = [
          'TrustID Foundation',
          'Polkadot Identity Council',
          'Web3 Foundation',
          'Blockchain Trust Alliance',
          'Chainlink Verifiable Credentials',
        ];
        
        sbts.push({
          id: `sbt:${Math.random().toString(36).substring(2, 15)}`,
          name: sbtTypes[Math.floor(Math.random() * sbtTypes.length)],
          issuer: issuers[Math.floor(Math.random() * issuers.length)],
          issuedAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date within last year
          description: 'A verifiable credential stored as a Soul-Bound Token',
          metadata: {
            schema: 'https://example.com/schemas/credential',
            version: '1.0'
          }
        });
      }
      
      this.mockDataGenerator.getSbts(address);
    });
  }

  // Connect to Substrate node
  public async connect(endpoint: string = process.env.NEXT_PUBLIC_SUBSTRATE_NODE_URL || 'ws://127.0.0.1:9944'): Promise<boolean> {
    try {
      // Check if environment variable for mock mode is set
      const mockParam = new URLSearchParams(window.location.search).get('mock');
      if (mockParam === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.info('Using mock data for Substrate operations');
        this.useMockData = true;
        this.isConnected = true;
        return true;
      }
      
      const provider = new WsProvider(endpoint);
      
      // Create a connection timeout
      const connectionPromise = new Promise<ApiPromise>(async (resolve, reject) => {
        try {
          const api = await ApiPromise.create({ provider });
          resolve(api);
        } catch (error) {
          reject(error);
        }
      });
      
      // Set a timeout for connection attempts
      const timeoutPromise = new Promise<ApiPromise>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout: Using mock data instead'));
        }, 5000);
      });
      
      // Try to connect with timeout
      try {
        this.api = await Promise.race([connectionPromise, timeoutPromise]);
        
        // Check connection
        const [chain, nodeName, nodeVersion] = await Promise.all([
          this.api.rpc.system.chain(),
          this.api.rpc.system.name(),
          this.api.rpc.system.version()
        ]);
        
        console.info(`Connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
        this.isConnected = true;
        return true;
      } catch (error) {
        console.warn('Failed to connect to Substrate node:', error);
        this.useMockData = true;
        this.isConnected = true;
        return true; // Return true since we'll fall back to mock data
      }
    } catch (error) {
      console.error('Error connecting to Substrate node:', error);
      this.useMockData = true;
      this.isConnected = true;
      return true; // Return true since we'll fall back to mock data
    }
  }

  // Get user's DID and SBTs
  public async getUserIdentity(account: InjectedAccountWithMeta): Promise<UserIdentity | null> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const address = account.address;
      
      if (this.useMockData) {
        const did = this.mockDataGenerator.getDid(address);
        if (!did) return null;
        
        const sbts = this.mockDataGenerator.getSbts(address);
        return { did, sbts };
      }
      
      if (!this.api || !this.isConnected) {
        throw new Error('Not connected to Substrate node');
      }
      
      // In a real implementation, this would query the chain for the DID and SBTs
      // For now, we'll just use mock data even in "connected" mode
      const did = this.mockDataGenerator.getDid(address);
      if (!did) return null;
      
      const sbts = this.mockDataGenerator.getSbts(address);
      return { did, sbts };
    } catch (error) {
      console.error('Error fetching user identity:', error);
      return null;
    }
  }

  // Create a new DID on-chain
  public async createDid(account: InjectedAccountWithMeta): Promise<string | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      if (this.useMockData) {
        return this.mockDataGenerator.createDid(account.address);
      }
      
      if (!this.api || !this.isConnected) {
        throw new Error('Not connected to Substrate node');
      }
      
      // In a real implementation, we would:
      // 1. Get the signer from the extension
      // 2. Create an extrinsic to register a DID
      // 3. Sign and submit the transaction
      // 4. Wait for confirmation
      
      // For now, we'll just use mock data
      return this.mockDataGenerator.createDid(account.address);
    } catch (error) {
      console.error('Error creating DID:', error);
      return null;
    }
  }

  // Verify a ZK proof
  public async verifyProof(proof: string, did: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      if (this.useMockData) {
        return this.mockDataGenerator.verifyProof(proof, did);
      }
      
      if (!this.api || !this.isConnected) {
        throw new Error('Not connected to Substrate node');
      }
      
      // In a real implementation, we would:
      // 1. Parse the proof data
      // 2. Call the verification function on chain or locally
      // 3. Return the verification result
      
      // For now, we'll just use mock data
      return this.mockDataGenerator.verifyProof(proof, did);
    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }

  // Disconnect from the node
  public async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
    this.isConnected = false;
    console.log('Disconnected from Substrate node');
  }

  // Check connection status
  public isNodeConnected(): boolean {
    return this.isConnected;
  }

  // Is using mock data
  public isMockMode(): boolean {
    return this.useMockData;
  }
} 