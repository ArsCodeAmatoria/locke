'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  ChainType, 
  CrossChainIdentity, 
  ChainCredential, 
  IdentityResolutionResult 
} from './types';
import { CrossChainIdentityManager } from './identity-manager';
import { chainRegistry, getAllChains, getChainsByType } from './chain-registry';

/**
 * State for the multi-chain identity hook
 */
interface MultiChainState {
  isInitializing: boolean;
  isReady: boolean;
  activeIdentity: CrossChainIdentity | null;
  activeDid: string | null;
  supportedChains: ChainType[];
  initializedChains: ChainType[];
  error: string | null;
}

/**
 * Hook for managing multi-chain identities
 */
export function useMultiChain() {
  const [state, setState] = useState<MultiChainState>({
    isInitializing: false,
    isReady: false,
    activeIdentity: null,
    activeDid: null,
    supportedChains: Object.values(ChainType),
    initializedChains: [],
    error: null
  });

  /**
   * Initialize the multi-chain identity manager
   */
  const initialize = useCallback(async (chains?: ChainType[]) => {
    setState(prev => ({ ...prev, isInitializing: true, error: null }));
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      
      // Default to all chain types if none specified
      const chainsToInitialize = chains || Object.values(ChainType);
      
      // Create a promise with timeout to prevent infinite spinning
      const initializeWithTimeout = async () => {
        return new Promise<Map<ChainType, boolean>>(async (resolve, reject) => {
          // Set a 10-second timeout
          const timeoutId = setTimeout(() => {
            reject(new Error('Initialization timed out after 10 seconds'));
          }, 10000);
          
          try {
            // Initialize each chain
            const results = await manager.initializeChains(chainsToInitialize);
            clearTimeout(timeoutId);
            resolve(results);
          } catch (error) {
            clearTimeout(timeoutId);
            reject(error);
          }
        });
      };
      
      // Initialize with timeout
      const results = await initializeWithTimeout();
      
      // Filter to successfully initialized chains
      const initializedChains = Array.from(results.entries())
        .filter(([_, success]) => success)
        .map(([chainType]) => chainType);
      
      setState(prev => ({
        ...prev,
        isInitializing: false,
        isReady: initializedChains.length > 0,
        initializedChains,
        error: initializedChains.length === 0 ? 'No chains could be initialized' : null
      }));
      
      return initializedChains.length > 0;
    } catch (error) {
      console.error('Error initializing multi-chain identity manager:', error);
      
      setState(prev => ({
        ...prev,
        isInitializing: false,
        isReady: false,
        error: error instanceof Error ? error.message : 'Unknown error initializing chains'
      }));
      
      return false;
    }
  }, []);

  /**
   * Resolve a DID across chains
   */
  const resolveDid = useCallback(async (did: string): Promise<IdentityResolutionResult> => {
    if (!state.isReady) {
      return {
        success: false,
        error: 'Multi-chain identity manager not initialized'
      };
    }
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      return await manager.resolveDID(did);
    } catch (error) {
      console.error('Error resolving DID:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error resolving DID'
      };
    }
  }, [state.isReady]);

  /**
   * Create a new DID on a specific chain
   */
  const createDid = useCallback(async (chainType: ChainType, account: any): Promise<string | null> => {
    if (!state.isReady) {
      throw new Error('Multi-chain identity manager not initialized');
    }
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      const did = await manager.createDID(chainType, account);
      
      if (did) {
        // Set as active DID
        setActiveDid(did);
      }
      
      return did;
    } catch (error) {
      console.error('Error creating DID:', error);
      return null;
    }
  }, [state.isReady]);

  /**
   * Set the active DID
   */
  const setActiveDid = useCallback(async (did: string): Promise<boolean> => {
    if (!state.isReady) {
      return false;
    }
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      
      // Resolve the DID first to verify it exists
      const result = await manager.resolveDID(did);
      
      if (result.success && result.identity) {
        manager.setActiveDID(did);
        
        setState(prev => ({
          ...prev,
          activeDid: did,
          activeIdentity: result.identity || null
        }));
        
        return true;
      } else {
        console.error('Could not set active DID:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error setting active DID:', error);
      return false;
    }
  }, [state.isReady]);

  /**
   * Verify a credential
   */
  const verifyCredential = useCallback(async (credential: ChainCredential): Promise<boolean> => {
    if (!state.isReady) {
      return false;
    }
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      return await manager.verifyCredential(credential);
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }, [state.isReady]);

  /**
   * Link an existing DID to the active DID
   */
  const linkDid = useCallback(async (targetDid: string): Promise<boolean> => {
    if (!state.isReady || !state.activeDid) {
      return false;
    }
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      return await manager.linkDID(targetDid);
    } catch (error) {
      console.error('Error linking DIDs:', error);
      return false;
    }
  }, [state.isReady, state.activeDid]);

  /**
   * Get chains by type
   */
  const getChains = useCallback((chainType?: ChainType) => {
    if (chainType) {
      return getChainsByType(chainType);
    } else {
      return getAllChains();
    }
  }, []);

  /**
   * Disconnect from all chains
   */
  const disconnect = useCallback(async () => {
    if (!state.isReady) return;
    
    try {
      const manager = CrossChainIdentityManager.getInstance();
      await manager.disconnectAll();
      
      setState(prev => ({
        ...prev,
        isReady: false,
        activeIdentity: null,
        activeDid: null,
        initializedChains: []
      }));
    } catch (error) {
      console.error('Error disconnecting chains:', error);
    }
  }, [state.isReady]);

  // Return the hook API
  return {
    ...state,
    initialize,
    resolveDid,
    createDid,
    setActiveDid,
    verifyCredential,
    linkDid,
    getChains,
    disconnect
  };
} 