'use client';

import { ZkProver, Credential, ProofResult } from '@/lib/wasm-zkp';
import { CredentialType } from '@/lib/credential-types';
import { CredentialType as WasmCredentialType } from './wasm-zkp';

// Define types for the proof generation parameters
export interface ProofGenerationParams {
  id: string;
  type: CredentialType;
  subject: string;
  attributes: { name: string; value: string; reveal: boolean }[];
}

// Define structured proof format
export interface StructuredProof {
  id: string;
  subject: string;
  type: CredentialType;
  timestamp: string;
  proof: string;
  publicInputs: string[];
}

// Singleton instance
let _instance: AdvancedZkProver | null = null;

/**
 * Advanced ZK Prover for credential verification
 * Implements singleton pattern to ensure only one instance
 */
export class AdvancedZkProver {
  private prover: ZkProver | null = null;

  constructor() {
    this.initialize();
  }

  // Get the singleton instance
  public static getInstance(): AdvancedZkProver {
    if (!_instance) {
      _instance = new AdvancedZkProver();
    }
    return _instance;
  }

  // Initialize the prover
  private async initialize(): Promise<void> {
    try {
      this.prover = ZkProver.getInstance();
      await this.prover.init();
    } catch (error) {
      console.error('Failed to initialize ZK Prover:', error);
      throw error;
    }
  }

  /**
   * Generate a credential proof
   * @param params Parameters for proof generation
   * @returns The generated proof
   */
  public async generateProof(params: ProofGenerationParams): Promise<StructuredProof | null> {
    try {
      if (!this.prover) {
        await this.initialize();
      }

      if (!this.prover) {
        throw new Error('ZK Prover not initialized');
      }

      // Build credential object for the WASM ZKP module
      const credential = {
        id: params.id,
        issuer: 'did:multi:zklocke:issuer',
        subject: params.subject || 'did:multi:zklocke:holder',
        type: this.mapCredentialType(params.type),
        attributes: params.attributes || [],
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 31536000000).toISOString(), // 1 year from now
        revoked: false
      };

      // Generate the proof
      const proofStr = await this.prover.prover.generate_credential_proof(
        JSON.stringify(credential)
      );
      
      if (!proofStr) {
        console.error('Failed to generate proof: Empty proof string');
        return null;
      }
      
      const proofObj = JSON.parse(proofStr);
      
      if (!proofObj.success) {
        console.error('Proof generation failed:', proofObj.message || 'Unknown error');
        return null;
      }

      // Build the structured proof
      return {
        id: params.id,
        subject: params.subject || 'did:multi:zklocke:holder',
        type: params.type,
        timestamp: new Date().toISOString(),
        proof: proofStr,
        publicInputs: [proofObj.credentialHash, proofObj.issuerHash, proofObj.attributeHash]
      };
    } catch (error) {
      console.error('Error generating proof:', error);
      return null;
    }
  }

  /**
   * Verify a credential proof
   * @param proof The proof to verify
   * @returns Whether the proof is valid
   */
  public async verifyProof(proof: StructuredProof): Promise<boolean> {
    try {
      if (!this.prover) {
        await this.initialize();
      }

      if (!this.prover || !proof || !proof.proof) {
        return false;
      }

      return await this.prover.prover.verify_credential_proof(proof.proof);
    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }

  // Map our application CredentialType to WASM ZKP module's CredentialType
  private mapCredentialType(type: CredentialType): string {
    // Map our application CredentialType to WASM ZKP module's CredentialType
    switch (type) {
      case CredentialType.KYC:
        return WasmCredentialType.Kyc;
      case CredentialType.MEMBERSHIP:
        return WasmCredentialType.Membership;
      case CredentialType.EDUCATION:
        return WasmCredentialType.Education;
      case CredentialType.PROFESSIONAL:
        return WasmCredentialType.Professional;
      case CredentialType.AGE:
        return WasmCredentialType.Custom;
      case CredentialType.CITIZENSHIP:
        return WasmCredentialType.Custom;
      case CredentialType.INCOME:
        return WasmCredentialType.Custom;
      case CredentialType.HEALTH:
        return WasmCredentialType.Custom;
      default:
        return WasmCredentialType.Custom;
    }
  }
} 