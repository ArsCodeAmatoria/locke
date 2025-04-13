import { ApiPromise, WsProvider } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

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

// For demo purposes, this is a mock implementation
// In production, this would connect to a real Substrate node
export class SubstrateClient {
  private static instance: SubstrateClient;
  private api: ApiPromise | null = null;
  private isConnected = false;
  private mockDIDs: Record<string, DID> = {};
  private mockSBTs: Record<string, SBT[]> = {};

  private constructor() {
    // Initialize mock data
    this.initMockData();
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

      this.mockDIDs[address] = did;

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
      
      this.mockSBTs[address] = sbts;
    });
  }

  // Connect to Substrate node
  public async connect(endpoint: string = 'wss://rpc.polkadot.io'): Promise<boolean> {
    try {
      // In a real implementation, we would connect to a WebSocket endpoint
      // For the demo, we'll simulate a connection
      console.log(`Connecting to Substrate node at ${endpoint}`);
      
      // Simulate connection latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isConnected = true;
      console.log('Connected to Substrate node');
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Substrate node:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Get user's DID and SBTs
  public async getUserIdentity(account: InjectedAccountWithMeta): Promise<UserIdentity | null> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      // For demo purposes, we'll use our mock data
      // If the account doesn't exist in our mock data, generate one
      const address = account.address;
      
      if (!this.mockDIDs[address]) {
        const did: DID = {
          id: `did:substrate:${address}`,
          controller: address,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
        
        this.mockDIDs[address] = did;
        
        // Generate some random SBTs
        const sbts: SBT[] = [
          {
            id: `sbt:${Math.random().toString(36).substring(2, 15)}`,
            name: 'Digital Identity Verification',
            issuer: 'TrustID Foundation',
            issuedAt: new Date().toISOString(),
          }
        ];
        
        this.mockSBTs[address] = sbts;
      }

      return {
        did: this.mockDIDs[address],
        sbts: this.mockSBTs[address] || [],
      };
    } catch (error) {
      console.error('Error fetching user identity:', error);
      return null;
    }
  }

  // Verify a ZK proof
  public async verifyProof(proof: string, did: string): Promise<boolean> {
    // In a real implementation, this would verify the proof on-chain
    // For the demo, we'll simulate verification with a 90% success rate
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return Math.random() < 0.9;
  }

  // Disconnect from the node
  public async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
    this.isConnected = false;
  }
} 