'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubstrateClient, DID, SBT, UserIdentity } from '../substrate-client';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// Auth provider context state
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  account: any | null;
  identity: any | null;
  error: string | null;
}

// Auth context interface with state and methods
interface AuthContextType extends AuthState {
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  createIdentity: () => Promise<string | null>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  // Auth state
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    account: null,
    identity: null,
    error: null,
  });

  // Get substrate client instance
  const client = SubstrateClient.getInstance();

  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Mock check auth - in reality would check local storage or session
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: err instanceof Error ? err.message : 'Authentication check failed'
        }));
      }
    };

    checkAuth();
  }, []);

  // Check if the user is authenticated by verifying their identity
  const checkAuth = async (account: any): Promise<UserIdentity | null> => {
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
      // This would normally make an API call or interact with blockchain
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock account
      const mockAccount = {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      };
      
      // Mock finding identity for this account
      const mockIdentity = {
        did: `did:substrate:${mockAccount.address}`,
        address: mockAccount.address
      };
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        account: mockAccount,
        identity: mockIdentity,
        isLoading: false
      }));
      
      return true;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Login failed'
      }));
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Mock logout delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        account: null,
        identity: null,
        error: null
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Logout failed'
      }));
    }
  };
  
  // Function to create a new DID for the user
  const createIdentity = async (): Promise<string | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock identity creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock account if none exists
      const mockAccount = state.account || {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      };
      
      // Create a mock DID
      const didId = `did:substrate:${mockAccount.address}`;
      
      // Update state with new identity
      const mockIdentity = {
        did: didId,
        address: mockAccount.address
      };
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        account: mockAccount,
        identity: mockIdentity,
        isLoading: false
      }));
      
      return didId;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Identity creation failed'
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