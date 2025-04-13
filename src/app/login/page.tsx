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
import { Terminal, Shield, CircuitBoard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'generating' | 'verified' | 'failed'>('unverified');
  const [isCreatingDid, setIsCreatingDid] = useState(false);
  const [nodeConnectionStatus, setNodeConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  
  // Initialize Substrate client and ZK prover
  useEffect(() => {
    const substratClient = SubstrateClient.getInstance();
    const zkProver = ZkProver.getInstance();
    
    // Initialize the clients
    const init = async () => {
      try {
        const connected = await substratClient.connect();
        setNodeConnectionStatus(connected ? 'connected' : 'failed');
        await zkProver.init();
      } catch (error) {
        console.error('Error initializing clients:', error);
        setNodeConnectionStatus('failed');
      }
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
        // No DID exists for this account
        toast.info('No DID found for this account. You need to create one.');
        setSelectedAccount(account);
      }
    } catch (error) {
      console.error('Error fetching identity:', error);
      toast.error('Error fetching identity information');
    }
  };
  
  const handleCreateDid = async () => {
    if (!selectedAccount) return;
    
    setIsCreatingDid(true);
    toast.loading('Creating your decentralized identity...');
    
    try {
      const substratClient = SubstrateClient.getInstance();
      const didId = await substratClient.createDid(selectedAccount);
      
      if (didId) {
        toast.success('DID created successfully!');
        
        // Fetch the newly created identity
        const identity = await substratClient.getUserIdentity(selectedAccount);
        
        if (identity) {
          setUserIdentity(identity);
          
          // Save session to localStorage
          localStorage.setItem('zkid-session', JSON.stringify({
            account: selectedAccount,
            identity,
            verificationStatus: 'unverified'
          }));
        }
      } else {
        toast.error('Failed to create DID');
      }
    } catch (error) {
      console.error('Error creating DID:', error);
      toast.error('Error creating DID');
    } finally {
      setIsCreatingDid(false);
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
              <span className="text-xs text-slate-500 font-mono">
                NODE STATUS: {' '}
                {nodeConnectionStatus === 'connected' && <span className="text-emerald-400">ONLINE</span>}
                {nodeConnectionStatus === 'connecting' && <span className="text-yellow-400">CONNECTING...</span>}
                {nodeConnectionStatus === 'failed' && <span className="text-red-400">OFFLINE (USING MOCK DATA)</span>}
              </span>
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
          
          {selectedAccount && !userIdentity && (
            <div className="w-full max-w-md">
              <div className="mb-4 p-2 bg-black/30 border border-emerald-400/20 rounded">
                <p className="text-sm text-slate-300 font-mono flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                  <span>NO IDENTITY FOUND</span>
                </p>
                <p className="text-xs text-slate-500 font-mono mt-2">
                  You need to create a decentralized identity (DID) to use this application.
                </p>
              </div>
              
              <button
                onClick={handleCreateDid}
                disabled={isCreatingDid}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-md text-white font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 flex justify-center items-center terminal-text"
              >
                {isCreatingDid ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    CREATING IDENTITY...
                  </>
                ) : (
                  'CREATE DECENTRALIZED IDENTITY'
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:text-white transition-colors duration-200 terminal-text text-sm"
              >
                DISCONNECT WALLET
              </button>
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
            <span>BLOCKCHAIN: {nodeConnectionStatus === 'connected' ? 'CONNECTED' : 'SIMULATED'}</span>
          </div>
        </footer>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
} 