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

// Substrate client for interacting with the blockchain
export class SubstrateClient {
  private static instance: SubstrateClient;
  private api: ApiPromise | null = null;
  private isConnected = false;
  private mockDIDs: Record<string, DID> = {};
  private mockSBTs: Record<string, SBT[]> = {};
  private useRealNode = false;

  private constructor() {
    // Determine whether to use real node or mock data
    this.useRealNode = process.env.NEXT_PUBLIC_USE_REAL_NODE === 'true';
    
    if (!this.useRealNode) {
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
  public async connect(endpoint: string = process.env.NEXT_PUBLIC_SUBSTRATE_NODE_URL || 'ws://127.0.0.1:9944'): Promise<boolean> {
    try {
      if (this.useRealNode) {
        console.log(`Connecting to Substrate node at ${endpoint}`);
        
        const provider = new WsProvider(endpoint);
        this.api = await ApiPromise.create({
          provider,
          types: {
            // Custom types for our pallets
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
          }
        });
        
        // Check if connection is established
        const [chain, nodeName, nodeVersion] = await Promise.all([
          this.api.rpc.system.chain(),
          this.api.rpc.system.name(),
          this.api.rpc.system.version()
        ]);
        
        console.log(`Connected to ${chain} using ${nodeName} v${nodeVersion}`);
        this.isConnected = true;
        return true;
      } else {
        // Mock connection for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isConnected = true;
        console.log('Connected to mock Substrate node');
        return true;
      }
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
      const address = account.address;
      
      if (this.useRealNode && this.api) {
        // Fetch DID from chain
        const didResult = await this.api.query.did.dids(address);
        
        if (didResult.isEmpty) {
          console.log('No DID found for this address');
          return null;
        }
        
        const didRecord = didResult.toJSON() as any;
        
        // Format DID data
        const did: DID = {
          id: `did:substrate:${address}`,
          controller: didRecord.controller,
          created: new Date(didRecord.created).toISOString(),
          updated: new Date(didRecord.updated).toISOString(),
        };
        
        // Fetch SBTs owned by this DID
        const sbtResult = await this.api.query.sbt.tokensByOwner(address);
        const sbtIds = sbtResult.toJSON() as string[];
        
        const sbts: SBT[] = [];
        
        // Fetch details for each SBT
        if (sbtIds && sbtIds.length > 0) {
          for (const sbtId of sbtIds) {
            const sbtData = await this.api.query.sbt.tokens(sbtId);
            if (!sbtData.isEmpty) {
              const token = sbtData.toJSON() as any;
              
              let metadata = {};
              if (token.metadata) {
                try {
                  metadata = JSON.parse(new TextDecoder().decode(token.metadata));
                } catch (e) {
                  console.warn('Could not parse SBT metadata', e);
                }
              }
              
              sbts.push({
                id: sbtId,
                name: new TextDecoder().decode(token.name),
                description: token.description ? new TextDecoder().decode(token.description) : undefined,
                issuer: token.issuer,
                issuedAt: new Date(token.issuedAt).toISOString(),
                metadata
              });
            }
          }
        }
        
        return { did, sbts };
      } else {
        // Use mock data for development
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
      }
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
      if (this.useRealNode && this.api) {
        const address = account.address;
        
        // Get the injector for the account
        const injector = await web3FromAddress(address);
        
        // Create extrinsic for creating a DID
        const extrinsic = this.api.tx.did.createDid();
        
        // Sign and send the transaction
        const hash = await extrinsic.signAndSend(
          address,
          { signer: injector.signer }
        );
        
        console.log('DID creation submitted with hash:', hash.toHex());
        return `did:substrate:${address}`;
      } else {
        // Mock DID creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const address = account.address;
        const did: DID = {
          id: `did:substrate:${address}`,
          controller: address,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
        
        this.mockDIDs[address] = did;
        return did.id;
      }
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
      if (this.useRealNode && this.api) {
        // Extract address from DID
        const address = did.replace('did:substrate:', '');
        
        // In a real scenario, we'd call the zkp-verify pallet
        // For now, we'll simulate the verification
        console.log(`Verifying proof for DID: ${did}`);
        
        // For a complete implementation, this would verify the proof on-chain
        // const result = await this.api.tx.zkp.verifyProof(proof, address).signAndSend(...);
        
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Random success for demonstration, would be real verification in production
        return Math.random() < 0.9;
      } else {
        // Mock verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        return Math.random() < 0.9;
      }
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
} 