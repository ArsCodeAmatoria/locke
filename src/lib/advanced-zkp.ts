'use client';

import { ZkProver } from '@/lib/wasm-zkp';
import { CredentialType } from '@/lib/credential-types';

// Define types for the proof generation parameters
export interface ProofGenerationParams {
  credentialType: CredentialType;
  holderDid: string;
  attributes: Record<string, string>;
  revealedAttributes: string[];
}

// Define structured proof format
export interface StructuredProof {
  proofData: string;
  publicInputs: string[];
  credentialType: CredentialType;
  revealed: Record<string, string>;
}

// Singleton instance
let _instance: AdvancedZkProver | null = null;

/**
 * Advanced ZK Prover for credential verification
 * Implements singleton pattern to ensure only one instance
 */
export class AdvancedZkProver {
  private zkProver: ZkProver | null = null;
  private isInitialized = false;

  // Get the singleton instance
  public static getInstance(): AdvancedZkProver {
    if (!_instance) {
      _instance = new AdvancedZkProver();
    }
    return _instance;
  }

  // Initialize the prover
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    
    try {
      this.zkProver = ZkProver.getInstance();
      if (this.zkProver) {
        await this.zkProver.init();
        this.isInitialized = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to initialize ZK prover:", error);
      return false;
    }
  }

  // Generate proof for credential verification
  public async generateProof(params: ProofGenerationParams): Promise<StructuredProof | null> {
    if (!this.isInitialized || !this.zkProver) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("ZK prover is not initialized");
      }
    }
    
    try {
      if (!this.zkProver) {
        throw new Error("ZK prover is not initialized");
      }
      
      // Create a mock proof for development
      const mockResult = await this.zkProver.generateProof(100);
      
      // Extract the revealed attributes
      const revealed: Record<string, string> = {};
      for (const attr of params.revealedAttributes) {
        if (params.attributes[attr]) {
          revealed[attr] = params.attributes[attr];
        }
      }
      
      return {
        proofData: JSON.stringify(mockResult),
        publicInputs: [params.holderDid, params.credentialType.toString()],
        credentialType: params.credentialType,
        revealed
      };
    } catch (error) {
      console.error("Error generating ZK proof:", error);
      return null;
    }
  }

  // Verify a proof
  public async verifyProof(proof: StructuredProof): Promise<boolean> {
    if (!this.isInitialized || !this.zkProver) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("ZK prover is not initialized");
      }
    }
    
    try {
      if (!this.zkProver) {
        throw new Error("ZK prover is not initialized");
      }
      
      // For development, we'll use a mock verification
      // We're converting the StructuredProof to work with our existing ZkProver interface
      return await this.zkProver.verifyProof(proof.proofData, 100);
    } catch (error) {
      console.error("Error verifying ZK proof:", error);
      return false;
    }
  }
} 