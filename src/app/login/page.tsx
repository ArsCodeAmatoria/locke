'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Shield, Lock, FileBadge, KeyRound, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';

type LoginStep = 'connect-wallet' | 'create-identity' | 'verify-identity' | 'complete';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<LoginStep>('connect-wallet');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setLocalError(null);
    
    try {
      // Call login without parameters now
      const success = await auth.login();
      
      if (success) {
        setStep('create-identity');
      } else {
        setLocalError('Login failed. Please try again.');
      }
    } catch (err) {
      setLocalError('Failed to authenticate. Please try again.');
    }
  };

  const handleCreateIdentity = async () => {
    setLocalError(null);
    
    if (!auth.account) {
      setLocalError('No account connected. Please connect your wallet first.');
      return;
    }
    
    try {
      // Call createIdentity without parameters now
      const didId = await auth.createIdentity();
      
      if (didId) {
        setStep('verify-identity');
      } else {
        setLocalError('Failed to create identity. Please try again.');
      }
    } catch (err) {
      setLocalError('Error creating identity. Please try again.');
    }
  };

  const verifyIdentity = async () => {
    setLocalError(null);
    
    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('complete');
    } catch (err) {
      setLocalError('Failed to verify identity. Please try again.');
    }
  };
  
  const reset = () => {
    setStep('connect-wallet');
    setLocalError(null);
  };

  // Display either local error or error from auth context
  const displayError = localError || (auth.error ? auth.error.toString() : null);

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
                disabled={auth.isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {auth.isLoading ? (
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
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
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
                disabled={auth.isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {auth.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Identity...
                  </>
                ) : (
                  <>Create Decentralized Identity</>
                )}
              </button>
              
              {displayError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}
              
              <button
                onClick={reset}
                disabled={auth.isLoading}
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
                disabled={auth.isLoading}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition flex items-center justify-center"
              >
                {auth.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Proof...
                  </>
                ) : (
                  <>Verify with Zero-Knowledge Proof</>
                )}
              </button>
              
              {displayError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}
              
              <button
                onClick={reset}
                disabled={auth.isLoading}
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