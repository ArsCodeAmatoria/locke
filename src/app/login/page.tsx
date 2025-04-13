'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Shield, Lock, FileBadge, KeyRound, ChevronRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

type LoginStep = 'connect-wallet' | 'create-identity' | 'verify-identity' | 'complete';

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>('connect-wallet');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<{address: string} | null>(null);
  const [identity, setIdentity] = useState<{did: {id: string}, sbts: any[]} | null>(null);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setAccount({
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      });
      
      setStep('create-identity');
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIdentity = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock identity creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIdentity({
        did: {
          id: 'did:substrate:' + account?.address
        },
        sbts: []
      });
      
      setStep('verify-identity');
    } catch (err) {
      setError('Failed to create identity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyIdentity = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('complete');
    } catch (err) {
      setError('Failed to verify identity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setStep('connect-wallet');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">zkID Secure Login</h1>
          <p className="text-slate-400 mt-2">Decentralized Identity Verification</p>
        </div>
        
        <Card className="mx-auto max-w-2xl p-6">
          {/* Connect Wallet Step */}
          {step === 'connect-wallet' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="h-6 w-6 text-emerald-400" />
                <h2 className="text-lg font-bold text-emerald-400">Connect Wallet</h2>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Connect your Polkadot wallet to access your decentralized identity.
              </p>
              
              <button
                onClick={handleConnectWallet}
                disabled={isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {isLoading ? (
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
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Create Identity Step */}
          {step === 'create-identity' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileBadge className="h-6 w-6 text-emerald-400" />
                <h2 className="text-lg font-bold text-emerald-400">Create Identity</h2>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Create your decentralized identifier (DID) to proceed with secure authentication.
              </p>
              
              <button
                onClick={handleCreateIdentity}
                disabled={isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Identity...
                  </>
                ) : (
                  <>Create Decentralized Identity</>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={reset}
                disabled={isLoading}
                className="text-sm text-slate-500 hover:text-emerald-500 transition-colors flex items-center"
              >
                Back
              </button>
            </motion.div>
          )}
          
          {/* Verify Identity Step */}
          {step === 'verify-identity' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-emerald-400" />
                <h2 className="text-lg font-bold text-emerald-400">Verify Identity</h2>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Generate a zero-knowledge proof to verify your identity while maintaining privacy.
              </p>
              
              <button
                onClick={verifyIdentity}
                disabled={isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Proof...
                  </>
                ) : (
                  <>Verify with Zero-Knowledge Proof</>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={reset}
                disabled={isLoading}
                className="text-sm text-slate-500 hover:text-emerald-500 transition-colors flex items-center"
              >
                Back
              </button>
            </motion.div>
          )}
          
          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-400/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">Authentication Successful</h2>
              
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Your identity has been verified using zero-knowledge cryptography.
                No personal data was exposed during this process.
              </p>
              
              <Link href="/" className="block w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition text-center">
                Return to Dashboard
              </Link>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
} 