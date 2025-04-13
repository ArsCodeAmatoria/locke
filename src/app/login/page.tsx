'use client';

import { useState, useEffect } from 'react';
import { WalletLogin } from '@/components/WalletLogin';
import { CredentialDisplay } from '@/components/CredentialDisplay';
import { ProofGenerator } from '@/components/ProofGenerator';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { SubstrateClient, UserIdentity } from '@/lib/substrate-client';
import { ZkProver } from '@/lib/wasm-zkp';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function LoginPage() {
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'generating' | 'verified' | 'failed'>('unverified');
  
  // Initialize Substrate client and ZK prover
  useEffect(() => {
    const substratClient = SubstrateClient.getInstance();
    const zkProver = ZkProver.getInstance();
    
    // Initialize the clients
    const init = async () => {
      await substratClient.connect();
      await zkProver.init();
    };
    
    init();
    
    // Check if we have a stored session
    const savedSession = localStorage.getItem('zkid-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.account && session.identity) {
          setSelectedAccount(session.account);
          setUserIdentity(session.identity);
          setVerificationStatus(session.verificationStatus || 'unverified');
          toast.success('Session restored');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('zkid-session');
      }
    }
    
    return () => {
      // Cleanup when component unmounts
      substratClient.disconnect();
    };
  }, []);
  
  const handleAccountSelect = async (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    
    try {
      // Get user's DID and SBTs from Substrate
      const substratClient = SubstrateClient.getInstance();
      const identity = await substratClient.getUserIdentity(account);
      
      if (identity) {
        setUserIdentity(identity);
        
        // Save session to localStorage
        localStorage.setItem('zkid-session', JSON.stringify({
          account,
          identity,
          verificationStatus: 'unverified'
        }));
      } else {
        toast.error('Failed to fetch identity information');
      }
    } catch (error) {
      console.error('Error fetching identity:', error);
      toast.error('Error fetching identity information');
    }
  };
  
  const handleRequestProof = () => {
    setIsGeneratingProof(true);
    setVerificationStatus('generating');
    
    // Update localStorage
    if (selectedAccount && userIdentity) {
      localStorage.setItem('zkid-session', JSON.stringify({
        account: selectedAccount,
        identity: userIdentity,
        verificationStatus: 'generating'
      }));
    }
  };
  
  const handleProofGenerated = (status: 'verified' | 'failed') => {
    setVerificationStatus(status);
    setIsGeneratingProof(false);
    
    // Update localStorage
    if (selectedAccount && userIdentity) {
      localStorage.setItem('zkid-session', JSON.stringify({
        account: selectedAccount,
        identity: userIdentity,
        verificationStatus: status
      }));
    }
  };
  
  const handleLogout = () => {
    setSelectedAccount(null);
    setUserIdentity(null);
    setVerificationStatus('unverified');
    localStorage.removeItem('zkid-session');
    toast.success('Logged out successfully');
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">zkID Login</h1>
        
        {!selectedAccount && (
          <WalletLogin onAccountSelect={handleAccountSelect} />
        )}
        
        {selectedAccount && userIdentity && (
          <CredentialDisplay 
            account={selectedAccount}
            credentials={{
              did: userIdentity.did.id,
              sbts: userIdentity.sbts,
              verificationStatus
            }}
            onLogout={handleLogout}
            onRequestProof={handleRequestProof}
          />
        )}
        
        {isGeneratingProof && userIdentity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md mx-auto">
              <ProofGenerator
                did={userIdentity.did.id}
                onProofGenerated={handleProofGenerated}
                onClose={() => setIsGeneratingProof(false)}
              />
            </div>
          </div>
        )}
        
        <Toaster position="top-center" />
      </div>
    </div>
  );
} 