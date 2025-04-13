'use client';

import { ZkProver } from './wasm-zkp';
import { CredentialType, Predicate, ProofRequest, VerificationResult } from './credential-types';

// Interface for proof generation parameters
export interface ProofGenerationParams {
  did: string;
  credentialType: CredentialType;
  challenge: string;
}

// Structured proof returned from the prover
export interface StructuredProof {
  proof: string;
  publicInputs: number;
  success: boolean;
  message: string;
}

/**
 * Advanced ZK Prover for credential verification
 * Implements singleton pattern to ensure only one instance
 */
export class AdvancedZkProver {
  private static instance: AdvancedZkProver;
  private zkProver: ZkProver | null = null;
  private isInitialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): AdvancedZkProver {
    if (!AdvancedZkProver.instance) {
      AdvancedZkProver.instance = new AdvancedZkProver();
    }
    return AdvancedZkProver.instance;
  }

  /**
   * Initialize the ZK prover
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.zkProver = ZkProver.getInstance();
      await this.zkProver.init();
      this.isInitialized = true;
      console.log('Advanced ZK Prover initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Advanced ZK Prover:', error);
      throw new Error('Failed to initialize Advanced ZK Prover');
    }
  }

  /**
   * Check if the prover is initialized
   */
  public isReady(): boolean {
    return this.isInitialized && this.zkProver !== null;
  }

  /**
   * Generate a proof based on credential type
   */
  public async generateProof(params: ProofGenerationParams): Promise<StructuredProof> {
    if (!this.isReady()) {
      await this.initialize();
    }

    if (!this.zkProver) {
      return {
        proof: '',
        publicInputs: 0,
        success: false,
        message: 'ZK Prover not initialized'
      };
    }

    try {
      switch (params.credentialType) {
        case CredentialType.AGE:
          return this.generateAgeProof(params);
        case CredentialType.KYC:
          return this.generateKycProof(params);
        case CredentialType.INCOME:
          return this.generateIncomeProof(params);
        case CredentialType.EDUCATION:
          return this.generateEducationProof(params);
        case CredentialType.CITIZENSHIP:
          return this.generateCitizenshipProof(params);
        case CredentialType.HEALTH:
          return this.generateHealthProof(params);
        case CredentialType.MEMBERSHIP:
          return this.generateCreditScoreProof(params);
        default:
          return {
            proof: '',
            publicInputs: 0,
            success: false,
            message: `Unsupported credential type: ${params.credentialType}`
          };
      }
    } catch (error) {
      console.error('Error generating proof:', error);
      return {
        proof: '',
        publicInputs: 0,
        success: false,
        message: `Error generating proof: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Generic proof generation method to reduce duplication
   */
  private async generateGenericProof(
    params: ProofGenerationParams,
    credentialValue: number
  ): Promise<StructuredProof> {
    if (!this.zkProver) {
      throw new Error('ZK Prover not initialized');
    }

    try {
      // Convert the params to a number for the zkProver
      // In a real-world implementation, we would hash the did, challenge, etc.
      // For simplicity, we'll use a mock value based on the credential type
      const result = await this.zkProver.generateProof(credentialValue);
      
      return {
        proof: JSON.stringify(result),
        publicInputs: result.publicInput || 0,
        success: result.success,
        message: result.message
      };
    } catch (error) {
      console.error(`Error generating proof:`, error);
      throw error;
    }
  }

  private async generateAgeProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 25); // Example age value
  }

  private async generateKycProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 1); // KYC verified = 1
  }

  private async generateIncomeProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 75000); // Example income value
  }

  private async generateEducationProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 16); // Example years of education
  }

  private async generateCitizenshipProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 1); // Citizenship verified = 1
  }

  private async generateHealthProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 85); // Example health score
  }

  private async generateCreditScoreProof(params: ProofGenerationParams): Promise<StructuredProof> {
    return this.generateGenericProof(params, 720); // Example credit score
  }

  /**
   * Verify a proof against public inputs
   */
  public async verifyProof(proof: string, publicInput: number): Promise<boolean> {
    if (!this.isReady()) {
      await this.initialize();
    }

    if (!this.zkProver) {
      throw new Error('ZK Prover not initialized');
    }

    try {
      return await this.zkProver.verifyProof(proof, publicInput);
    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }
} 