'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubstrateClient, DID, SBT, UserIdentity } from '../substrate-client';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// Auth provider context state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  account: InjectedAccountWithMeta | null;
  identity: UserIdentity | null;
  error: Error | null;
}

// Auth context interface with state and methods
interface AuthContextType extends AuthState {
  login: () => Promise<boolean>;
  logout: () => void;
  createIdentity: () => Promise<string | null>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  account: null,
  identity: null,
  error: null,
  login: async () => false,
  logout: () => {},
  createIdentity: async () => null,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  // Auth state
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    account: null,
    identity: null,
    error: null,
  });

  // Get substrate client instance
  const client = SubstrateClient.getInstance();

  // Check if user is already authenticated from local storage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to connect to substrate node
        await client.connect();
        
        // Check if we have saved account data
        const savedAccount = localStorage.getItem('auth_account');
        if (!savedAccount) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        // Parse saved account data
        const account = JSON.parse(savedAccount) as InjectedAccountWithMeta;
        
        // Get identity for account
        const identity = await client.getUserIdentity(account);
        
        // Update auth state
        setState({
          isAuthenticated: !!identity,
          isLoading: false,
          account,
          identity,
          error: null,
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setState({
          isAuthenticated: false,
          isLoading: false,
          account: null,
          identity: null,
          error: new Error('Failed to check authentication status'),
        });
      }
    };
    
    checkAuth();
    
    // Cleanup on unmount
    return () => {
      // Close connection when component unmounts
      client.disconnect();
    };
  }, []);
  
  // Check if the user is authenticated by verifying their identity
  const checkAuth = async (account: InjectedAccountWithMeta): Promise<UserIdentity | null> => {
    try {
      const client = SubstrateClient.getInstance();
      await client.connect();
      
      const identity = await client.getUserIdentity(account);
      return identity;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  };
  
  // Login function to connect wallet and get account
  const login = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Request accounts from the injected extension
      const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
      const extensions = await web3Enable('zkID Login');
      
      if (extensions.length === 0) {
        throw new Error('No extension found. Please install Polkadot.js extension.');
      }
      
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in Polkadot.js extension.');
      }
      
      // Use the first account for now (in a real app, you'd let the user choose)
      const account = accounts[0];
      
      // Get user identity (DID and SBTs)
      const identity = await checkAuth(account);
      
      // If user has a DID, they are authenticated
      const isAuthenticated = !!identity;
      
      setState({
        isAuthenticated,
        isLoading: false,
        account,
        identity,
        error: null,
      });
      
      return isAuthenticated;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error during login'),
      }));
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('auth_account');
    
    // Reset state
    setState({
      isAuthenticated: false,
      isLoading: false,
      account: null,
      identity: null,
      error: null,
    });
  };
  
  // Function to create a new DID for the user
  const createIdentity = async (): Promise<string | null> => {
    if (!state.account) {
      setState(prev => ({
        ...prev,
        error: new Error('No account selected. Please connect your wallet first.'),
      }));
      return null;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const client = SubstrateClient.getInstance();
      await client.connect();
      
      // Create DID on-chain
      const didId = await client.createDid(state.account);
      
      if (didId) {
        // Refresh user identity after creating DID
        const identity = await client.getUserIdentity(state.account);
        
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          identity,
        }));
        
        return didId;
      }
      
      throw new Error('Failed to create identity.');
    } catch (error) {
      console.error('Create identity error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error creating identity'),
      }));
      return null;
    }
  };
  
  // Auth context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    createIdentity,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Add AuthProvider to your _app.tsx or layout.tsx to make auth available throughout the app 