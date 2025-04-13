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
import { Terminal, Shield, CircuitBoard } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background cyber-scanline">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 flex items-center">
              <span className="w-8 h-8 rounded border border-emerald-400/40 flex items-center justify-center mr-2">
                <Terminal size={16} />
              </span>
              <span className="terminal-text">Return to Main Terminal</span>
            </Link>
            <div className="px-2 py-1 bg-black/30 border border-emerald-400/30 rounded-md">
              <span className="text-xs text-slate-500 font-mono">NODE STATUS: <span className="text-emerald-400">ONLINE</span></span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold cyber-glow terminal-text mb-2">SECURE ACCESS TERMINAL</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            <div className="p-2 bg-black/30 border border-emerald-400/20 rounded flex items-center">
              <Shield className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-xs text-slate-400 font-mono">IDENTITY VERIFICATION</span>
            </div>
            <div className="p-2 bg-black/30 border border-emerald-400/20 rounded flex items-center">
              <CircuitBoard className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-xs text-slate-400 font-mono">CRYPTOGRAPHIC PROTOCOL ACTIVE</span>
            </div>
            <div className="p-2 bg-black/30 border border-emerald-400/20 rounded flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2"></div>
              <span className="text-xs text-slate-400 font-mono overflow-hidden">
                SESSION: {Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase()}
              </span>
            </div>
          </div>
        </header>
        
        <div className="flex flex-col items-center justify-center">
          {!selectedAccount && (
            <div className="w-full max-w-md">
              <div className="mb-4 p-2 bg-black/30 border border-emerald-400/20 rounded">
                <p className="text-sm text-slate-300 font-mono">
                  <span className="text-emerald-400">{`>`}</span> AUTHENTICATION REQUIRED
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Connect your Polkadot.js wallet to authorize access
                </p>
              </div>
              <WalletLogin onAccountSelect={handleAccountSelect} />
            </div>
          )}
          
          {selectedAccount && userIdentity && (
            <div className="w-full max-w-md">
              <div className="mb-4 p-2 bg-black/30 border border-emerald-400/20 rounded">
                <p className="text-sm text-emerald-400 font-mono">
                  <span className="text-emerald-400">{`>`}</span> AUTHENTICATION SUCCESSFUL
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Decentralized Identity connected: {userIdentity.did.id.substring(0, 12)}...
                </p>
              </div>
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
            </div>
          )}
          
          {isGeneratingProof && userIdentity && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="w-full max-w-md mx-auto">
                <ProofGenerator
                  did={userIdentity.did.id}
                  onProofGenerated={handleProofGenerated}
                  onClose={() => setIsGeneratingProof(false)}
                />
              </div>
            </div>
          )}
        </div>
        
        <footer className="mt-16 pt-4 border-t border-emerald-400/20">
          <div className="flex justify-between items-center text-xs text-slate-600 font-mono">
            <span>SYSTEM v0.1.3</span>
            <span>ENCRYPTION: ACTIVE</span>
            <span>BLOCKCHAIN: CONNECTED</span>
          </div>
        </footer>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
} 