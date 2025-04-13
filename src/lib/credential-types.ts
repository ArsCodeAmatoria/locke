import { SBT } from './substrate-client';

// Enhanced credential types with verification rules and metadata schemas
export enum CredentialType {
  KYC = 'KYC Verification',
  AGE = 'Age Credential',
  CITIZENSHIP = 'Citizenship Verification',
  EDUCATION = 'Education Credential',
  PROFESSIONAL = 'Professional License',
  INCOME = 'Income Verification',
  HEALTH = 'Health Credential',
  MEMBERSHIP = 'Membership Credential'
}

// Credential schema definitions with validation rules
export interface CredentialSchema {
  type: CredentialType;
  name: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: ValidationRule[];
  zkProvable: boolean; // Can be proven with zero-knowledge
  zkFields: string[]; // Fields that can be proven with ZK
}

// Validation rule for credential fields
export interface ValidationRule {
  field: string;
  rule: string;
  description: string;
}

// Proof request parameters for different verification scenarios
export interface ProofRequest {
  id: string;
  type: CredentialType;
  requiredFields: string[];
  predicates: Predicate[];
  callbackUrl?: string;
}

// Predicate for zero-knowledge proofs (e.g., age >= 18)
export interface Predicate {
  field: string;
  operator: '>' | '>=' | '=' | '<=' | '<' | '!=' | 'in' | 'contains';
  value: any;
}

// Verification result
export interface VerificationResult {
  success: boolean;
  credentialType: CredentialType;
  proofId?: string;
  message?: string;
  timestamp: string;
  verifier?: string;
}

// Define credential schemas for each type
export const CREDENTIAL_SCHEMAS: Record<CredentialType, CredentialSchema> = {
  [CredentialType.KYC]: {
    type: CredentialType.KYC,
    name: 'KYC Verification',
    description: 'Know Your Customer verification credential',
    requiredFields: ['fullName', 'dateOfBirth', 'nationality', 'documentType', 'documentNumber', 'verificationLevel'],
    optionalFields: ['address', 'phoneNumber', 'email'],
    validationRules: [
      {
        field: 'verificationLevel',
        rule: 'in:1,2,3,4',
        description: 'Verification level must be between 1-4'
      }
    ],
    zkProvable: true,
    zkFields: ['verificationLevel', 'nationality']
  },
  
  [CredentialType.AGE]: {
    type: CredentialType.AGE,
    name: 'Age Credential',
    description: 'Verifies a person is of a certain age',
    requiredFields: ['dateOfBirth', 'ageAtIssuance'],
    optionalFields: ['documentType', 'documentNumber'],
    validationRules: [
      {
        field: 'ageAtIssuance',
        rule: '>= 0',
        description: 'Age must be a non-negative number'
      }
    ],
    zkProvable: true,
    zkFields: ['ageAtIssuance']
  },
  
  [CredentialType.CITIZENSHIP]: {
    type: CredentialType.CITIZENSHIP,
    name: 'Citizenship Verification',
    description: 'Verifies citizenship of a country',
    requiredFields: ['country', 'documentType', 'documentNumber', 'issuanceDate', 'expiryDate'],
    optionalFields: ['region', 'issuingAuthority'],
    validationRules: [
      {
        field: 'expiryDate',
        rule: '> currentDate',
        description: 'Document must not be expired'
      }
    ],
    zkProvable: true,
    zkFields: ['country']
  },
  
  [CredentialType.EDUCATION]: {
    type: CredentialType.EDUCATION,
    name: 'Education Credential',
    description: 'Verifies educational achievements',
    requiredFields: ['institution', 'degree', 'fieldOfStudy', 'graduationDate'],
    optionalFields: ['gpa', 'honors', 'certificateNumber'],
    validationRules: [
      {
        field: 'gpa',
        rule: 'between:0,4.0',
        description: 'GPA must be between 0 and 4.0'
      }
    ],
    zkProvable: true,
    zkFields: ['degree', 'graduationDate']
  },
  
  [CredentialType.PROFESSIONAL]: {
    type: CredentialType.PROFESSIONAL,
    name: 'Professional License',
    description: 'Verifies professional qualifications and licenses',
    requiredFields: ['licenseType', 'licenseNumber', 'issuingAuthority', 'issuanceDate', 'expiryDate'],
    optionalFields: ['specialty', 'jurisdiction', 'verificationUrl'],
    validationRules: [
      {
        field: 'expiryDate',
        rule: '> currentDate',
        description: 'License must not be expired'
      }
    ],
    zkProvable: true,
    zkFields: ['licenseType', 'issuingAuthority']
  },
  
  [CredentialType.INCOME]: {
    type: CredentialType.INCOME,
    name: 'Income Verification',
    description: 'Verifies income level',
    requiredFields: ['incomeAmount', 'currency', 'period', 'verificationDate'],
    optionalFields: ['employer', 'taxId', 'incomeSource'],
    validationRules: [
      {
        field: 'incomeAmount',
        rule: '> 0',
        description: 'Income must be greater than 0'
      }
    ],
    zkProvable: true,
    zkFields: ['incomeAmount', 'period']
  },
  
  [CredentialType.HEALTH]: {
    type: CredentialType.HEALTH,
    name: 'Health Credential',
    description: 'Verifies health status or records',
    requiredFields: ['status', 'testType', 'testDate', 'issuingFacility'],
    optionalFields: ['expiryDate', 'batchNumber', 'resultDetails'],
    validationRules: [
      {
        field: 'testDate',
        rule: '< currentDate',
        description: 'Test date must be in the past'
      }
    ],
    zkProvable: true,
    zkFields: ['status', 'testType']
  },
  
  [CredentialType.MEMBERSHIP]: {
    type: CredentialType.MEMBERSHIP,
    name: 'Membership Credential',
    description: 'Verifies membership in an organization',
    requiredFields: ['organization', 'membershipId', 'joinDate', 'membershipLevel'],
    optionalFields: ['expiryDate', 'benefits', 'verificationUrl'],
    validationRules: [
      {
        field: 'expiryDate',
        rule: '> currentDate',
        description: 'Membership must not be expired'
      }
    ],
    zkProvable: true,
    zkFields: ['organization', 'membershipLevel']
  }
};

// Helper functions for working with credentials

/**
 * Check if an SBT matches a specific credential type
 */
export function matchesCredentialType(sbt: SBT, type: CredentialType): boolean {
  return sbt.name === type;
}

/**
 * Extract metadata field from an SBT
 */
export function getCredentialField(sbt: SBT, field: string): any {
  return sbt.metadata?.[field];
}

/**
 * Create a proof request for a specific verification scenario
 */
export function createProofRequest(type: CredentialType, predicates: Predicate[]): ProofRequest {
  const schema = CREDENTIAL_SCHEMAS[type];
  
  return {
    id: `proof-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    type,
    requiredFields: schema.requiredFields,
    predicates
  };
}

/**
 * Validate a credential against its schema
 */
export function validateCredential(sbt: SBT): boolean {
  const type = sbt.name as CredentialType;
  const schema = CREDENTIAL_SCHEMAS[type];
  
  if (!schema) return false;
  
  // Check required fields
  for (const field of schema.requiredFields) {
    if (!(field in (sbt.metadata || {}))) {
      return false;
    }
  }
  
  // Future implementation would validate against rules
  
  return true;
}

/**
 * Get ZK-provable fields for a credential type
 */
export function getZkProvableFields(type: CredentialType): string[] {
  return CREDENTIAL_SCHEMAS[type]?.zkFields || [];
} 