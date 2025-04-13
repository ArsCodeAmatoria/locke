'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Shield, Lock, FileBadge, KeyRound, ChevronRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';
import { ZkProver } from '@/lib/wasm-zkp';
import { SubstrateClient } from '@/lib/substrate-client';

enum LoginStep {
  ConnectWallet = 'connect-wallet',
  CreateIdentity = 'create-identity',
  VerifyIdentity = 'verify-identity',
  Complete = 'complete'
}

export default function LoginPage() {
  const { login, createIdentity, isAuthenticated, isLoading, account, identity, error } = useAuth();
  const [step, setStep] = useState<LoginStep>(LoginStep.ConnectWallet);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Update steps based on authentication state
  useEffect(() => {
    if (isAuthenticated && identity) {
      setStep(LoginStep.VerifyIdentity);
    }
  }, [isAuthenticated, identity]);

  // Connect wallet handler
  const handleConnectWallet = async () => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      const success = await login();
      
      if (success) {
        // If user has identity, they'll be moved to verification in the useEffect
        // If not, move to create identity step
        if (!identity) {
          setStep(LoginStep.CreateIdentity);
        }
      } else {
        if (account && !identity) {
          setStep(LoginStep.CreateIdentity);
        } else {
          setLocalError('Failed to authenticate. Please try again.');
        }
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setLocalLoading(false);
    }
  };

  // Create identity handler
  const handleCreateIdentity = async () => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      const didId = await createIdentity();
      
      if (didId) {
        setStep(LoginStep.VerifyIdentity);
      } else {
        setLocalError('Failed to create identity. Please try again.');
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create identity');
    } finally {
      setLocalLoading(false);
    }
  };

  // Generate ZK proof and verify identity
  const verifyIdentity = async () => {
    if (!identity) return;
    
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // Initialize ZK prover
      const prover = ZkProver.getInstance();
      await prover.init();
      
      // Generate a proof (using a simple example value for demo)
      // In a real app, this would use real credential data
      const secretValue = 7; // This is kept private
      const result = await prover.generateProof(secretValue);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate proof');
      }
      
      if (result.publicInput) {
        // Verify the proof on-chain (or mock verification)
        const client = SubstrateClient.getInstance();
        const isValid = await client.verifyProof(JSON.stringify(result), identity.did.id);
        
        setVerificationResult(isValid);
        
        if (isValid) {
          setStep(LoginStep.Complete);
        } else {
          throw new Error('Identity verification failed');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to verify identity');
      setVerificationResult(false);
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Reset the login flow
  const reset = () => {
    setStep(LoginStep.ConnectWallet);
    setVerificationResult(null);
    setLocalError(null);
  };
  
  // Determine if loading is active
  const isProcessing = isLoading || localLoading;
  
  // Determine which error to display
  const displayError = localError || (error instanceof Error ? error.message : error);

  return (
    <div className="min-h-screen bg-background cyber-scanline py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 cyber-glow terminal-text">zkID Secure Terminal</h1>
          <p className="text-slate-400 mt-2 font-mono">Decentralized Identity Verification Protocol</p>
        </div>
        
        {/* Login Terminal Card */}
        <Card 
          className="mx-auto max-w-2xl"
          borderGlow
          scanlineEffect
          titleGlow
          noiseEffect
        >
          {/* Step Indicator */}
          <div className="flex bg-black/40 p-3 border-b border-emerald-400/20">
            {Object.values(LoginStep).map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div 
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2
                    ${step === s ? 'bg-emerald-400 text-black' : 
                     Object.values(LoginStep).indexOf(step) > i ? 'bg-emerald-900 text-emerald-400 border border-emerald-400' : 
                     'bg-slate-800 text-slate-500'}`}
                >
                  {i + 1}
                </div>
                {i < Object.values(LoginStep).length - 1 && (
                  <div className="flex-1 h-[1px] bg-emerald-400/20"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-6">
            {/* Connect Wallet Step */}
            {step === LoginStep.ConnectWallet && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-lg font-bold text-emerald-400">Connect Wallet</h2>
                </div>
                
                <p className="text-sm text-slate-300 mb-4">
                  To access your decentralized identity, connect your Polkadot wallet. This allows
                  secure authentication without exposing your private keys.
                </p>
                
                <div className="p-3 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300 mb-6">
                  <div className="text-emerald-400">{`>`} connect --wallet polkadot</div>
                  <div className="text-slate-500">Connecting to secure node...</div>
                </div>
                
                <button
                  onClick={handleConnectWallet}
                  disabled={isProcessing}
                  className="cyber-button w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4 mr-2" />
                      Connect Polkadot Wallet
                    </>
                  )}
                </button>
                
                {displayError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/20 rounded text-sm text-red-400 flex items-start mt-4">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                    <span>{displayError}</span>
                  </div>
                )}
                
                <div className="text-center text-xs text-slate-500 mt-8">
                  Don't have a Polkadot wallet? <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Install extension</a>
                </div>
              </motion.div>
            )}
            
            {/* Create Identity Step */}
            {step === LoginStep.CreateIdentity && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileBadge className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-lg font-bold text-emerald-400">Create Identity</h2>
                </div>
                
                <div className="p-4 bg-black/40 rounded border border-yellow-500/20 flex items-start mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-yellow-400 font-medium">No identity found</p>
                    <p className="text-sm text-slate-300 mt-1">
                      You don't have a decentralized identifier (DID) yet. Create one to proceed with
                      secure authentication.
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300">
                  Your decentralized identifier (DID) will be stored on the blockchain and linked to your
                  account address. This will allow you to manage verifiable credentials securely.
                </p>
                
                <div className="p-3 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300 mb-4">
                  <div className="text-emerald-400">{`>`} did:create --account {account?.address.substring(0, 10)}...</div>
                  {isProcessing && <div className="text-slate-500 animate-pulse">Generating DID...</div>}
                </div>
                
                <button
                  onClick={handleCreateIdentity}
                  disabled={isProcessing}
                  className="cyber-button w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Identity...
                    </>
                  ) : (
                    <>Create Decentralized Identity</>
                  )}
                </button>
                
                {displayError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/20 rounded text-sm text-red-400 flex items-start mt-4">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                    <span>{displayError}</span>
                  </div>
                )}
                
                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
              </motion.div>
            )}
            
            {/* Verify Identity Step */}
            {step === LoginStep.VerifyIdentity && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-lg font-bold text-emerald-400">Verify Identity</h2>
                </div>
                
                {identity && (
                  <div className="p-4 bg-black/40 rounded border border-emerald-400/20 mb-6">
                    <p className="text-sm text-emerald-400 font-medium">Identity Found</p>
                    <p className="text-xs text-slate-300 mt-1 font-mono">
                      {identity.did.id}
                    </p>
                    
                    {identity.sbts.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-xs text-slate-300 mb-2">Credentials:</p>
                        <div className="space-y-2">
                          {identity.sbts.map((sbt) => (
                            <div key={sbt.id} className="p-2 bg-black/30 rounded border border-emerald-400/10 text-xs text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-emerald-400">{sbt.name}</span>
                                <span className="text-slate-400">Issuer: {sbt.issuer.substring(0, 6)}...</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-3">
                        No credentials found
                      </p>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-slate-300 mb-4">
                  Generate a zero-knowledge proof to verify your identity without revealing your private
                  credentials. This allows secure authentication while maintaining privacy.
                </p>
                
                <div className="p-3 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300 mb-6">
                  <div className="text-emerald-400">{`>`} zk:prove --identity {identity?.did.id.substring(0, 15)}...</div>
                  {isProcessing && <div className="text-slate-500 animate-pulse">Generating proof...</div>}
                  {verificationResult === true && (
                    <div className="text-green-400">Proof verified successfully!</div>
                  )}
                  {verificationResult === false && (
                    <div className="text-red-400">Proof verification failed</div>
                  )}
                </div>
                
                <button
                  onClick={verifyIdentity}
                  disabled={isProcessing}
                  className="cyber-button w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Proof...
                    </>
                  ) : (
                    <>Verify with Zero-Knowledge Proof</>
                  )}
                </button>
                
                {displayError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/20 rounded text-sm text-red-400 flex items-start mt-4">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                    <span>{displayError}</span>
                  </div>
                )}
                
                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
              </motion.div>
            )}
            
            {/* Complete Step */}
            {step === LoginStep.Complete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 bg-emerald-400/10 border border-emerald-400/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-emerald-400">Authentication Successful</h2>
                
                <div className="p-4 bg-black/40 rounded border border-emerald-400/20 mb-6 text-left">
                  <p className="text-sm text-emerald-400 font-medium">Access Granted</p>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    Identity confirmed: {identity?.did.id}
                  </p>
                  <p className="text-xs text-slate-300 mt-3">
                    Your identity has been verified using zero-knowledge cryptography.
                    No personal data was exposed during this process.
                  </p>
                </div>
                
                <Link href="/" className="cyber-button block w-full">
                  Return to Dashboard
                </Link>
                
                <div className="text-sm text-slate-400">
                  <Link href="/docs/substrate-login" className="text-emerald-400 hover:underline">
                    Learn more about Substrate Login
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 