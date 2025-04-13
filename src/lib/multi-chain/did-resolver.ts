import { MultiChainDID, ChainType, CrossChainIdentity } from './types';
import { getChainMetadata, parseChainKey } from './chain-registry';

/**
 * Parse a multi-chain DID into its components
 * Format: did:multi:<chain-type>:<chain-id>:<address>
 */
export function parseMultiChainDID(didString: string): MultiChainDID | null {
  if (!didString) return null;
  
  // Check if it's a multi-chain DID
  if (!didString.startsWith('did:multi:')) return null;
  
  const parts = didString.split(':');
  if (parts.length < 5) return null;
  
  const method = parts[1];
  const chainType = parts[2] as ChainType;
  const chainId = parts[3];
  const address = parts.slice(4).join(':'); // Join remaining parts in case address contains colons
  
  // Validate chain type
  if (!Object.values(ChainType).includes(chainType)) {
    return null;
  }
  
  return {
    method: 'multi' as const,
    chainType,
    chainId,
    address,
    raw: didString
  };
}

/**
 * Create a multi-chain DID string from components
 */
export function createMultiChainDID(
  chainType: ChainType,
  chainId: string,
  address: string
): string {
  return `did:multi:${chainType}:${chainId}:${address}`;
}

/**
 * Convert a chain-specific DID to a multi-chain DID
 * e.g., did:substrate:5FHneW46... -> did:multi:substrate:polkadot:5FHneW46...
 */
export function convertToMultiChainDID(
  did: string,
  chainType: ChainType,
  chainId: string
): string | null {
  if (!did || !chainType || !chainId) return null;
  
  // Extract the address from the DID
  const parts = did.split(':');
  if (parts.length < 3) return null;
  
  const address = parts.slice(2).join(':');
  return createMultiChainDID(chainType, chainId, address);
}

/**
 * Get the chain key from a multi-chain DID
 */
export function getChainKeyFromDID(did: string): string | null {
  const parsed = parseMultiChainDID(did);
  if (!parsed) return null;
  
  return `${parsed.chainType}:${parsed.chainId}`;
}

/**
 * Get the chain metadata from a multi-chain DID
 */
export function getChainFromDID(did: string): { chainType: ChainType, chainId: string } | null {
  const parsed = parseMultiChainDID(did);
  if (!parsed) return null;
  
  return {
    chainType: parsed.chainType,
    chainId: parsed.chainId
  };
}

/**
 * Build a standard DID document from the cross-chain identity
 * Following W3C DID Core Specification
 */
export function buildDIDDocument(identity: CrossChainIdentity): object {
  // Extract the chain type and ID from the master DID
  const masterDID = parseMultiChainDID(identity.id);
  if (!masterDID) throw new Error('Invalid master DID');
  
  const chainKey = `${masterDID.chainType}:${masterDID.chainId}`;
  const chainMetadata = getChainMetadata(chainKey);
  
  // Build verification methods
  const verificationMethodsWithContext = identity.verificationMethods.map(vm => ({
    id: vm.id,
    type: vm.type,
    controller: vm.controller,
    ...(vm.publicKeyMultibase ? { publicKeyMultibase: vm.publicKeyMultibase } : {}),
    ...(vm.blockchainAccountId ? { blockchainAccountId: vm.blockchainAccountId } : {})
  }));
  
  // Build services
  const servicesWithContext = identity.services.map(service => ({
    id: service.id,
    type: service.type,
    serviceEndpoint: service.serviceEndpoint
  }));
  
  // Build linked DIDs as alternative identifiers
  const alsoKnownAs = Object.entries(identity.linkedDids).map(([key, did]) => ({
    id: did,
    type: parseChainKey(key)?.chainType || 'unknown'
  }));
  
  // Create the DID document
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
      'https://w3id.org/security/suites/secp256k1-2020/v1'
    ],
    id: identity.id,
    controller: identity.controller,
    alsoKnownAs,
    verificationMethod: verificationMethodsWithContext,
    authentication: identity.verificationMethods
      .filter(vm => vm.type.includes('Authentication'))
      .map(vm => vm.id),
    assertionMethod: identity.verificationMethods
      .filter(vm => vm.type.includes('AssertionMethod'))
      .map(vm => vm.id),
    service: servicesWithContext,
    created: identity.created,
    updated: identity.updated
  };
} 