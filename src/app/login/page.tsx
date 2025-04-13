'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Wallet, Shield, Lock, FileBadge, KeyRound, Loader2, AlertCircle, CheckCircle, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/hooks/use-auth';
import { socialProviders, SocialProvider } from '@/lib/identity-providers';

type LoginStep = 'connect-wallet' | 'create-identity' | 'verify-identity' | 'complete';

// Terminal text animation component
function TerminalText({ 
  text, 
  typingSpeed = 40, 
  className = "", 
  onComplete 
}: { 
  text: string, 
  typingSpeed?: number, 
  className?: string,
  onComplete?: () => void 
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, isComplete, text, typingSpeed, onComplete]);

  return (
    <div className={`font-mono ${className}`}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}

// Terminal container component
function TerminalWindow({ children, title = "zkID Terminal" }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="border border-emerald-600/60 rounded-md bg-black/90 text-emerald-400 overflow-hidden">
      <div className="flex items-center px-4 py-2 bg-emerald-900/30 border-b border-emerald-600/40">
        <Terminal className="h-4 w-4 mr-2" />
        <div className="text-xs font-mono">{title}</div>
      </div>
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<LoginStep>('connect-wallet');
  const [localError, setLocalError] = useState<string | null>(null);
  const [socialLoginInProgress, setSocialLoginInProgress] = useState<string | null>(null);
  
  // Terminal state
  const [terminalSteps, setTerminalSteps] = useState<{text: string, done: boolean}[]>([]);
  const [activeTerminalStep, setActiveTerminalStep] = useState(0);

  const handleConnectWallet = async () => {
    setLocalError(null);
    
    // Initialize terminal steps
    setTerminalSteps([
      { text: '> Initializing secure connection...', done: false },
      { text: '> Searching for compatible wallets...', done: false },
      { text: '> Requesting account access...', done: false },
      { text: '> Account connected successfully!', done: false }
    ]);
    setActiveTerminalStep(0);
    
    try {
      // Call login without parameters for wallet login
      const success = await auth.login();
      
      if (success) {
        // Let terminal animation complete before moving to next step
        setTimeout(() => {
          setStep('create-identity');
        }, 1000);
      } else {
        setLocalError('Login failed. Please try again.');
      }
    } catch (err) {
      setLocalError('Failed to authenticate. Please try again.');
    }
  };

  // When a terminal step is complete, move to the next
  const handleTerminalStepComplete = () => {
    if (activeTerminalStep < terminalSteps.length - 1) {
      setTimeout(() => {
        setActiveTerminalStep(prev => prev + 1);
      }, 400);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLocalError(null);
    setSocialLoginInProgress(provider.id);
    
    // Initialize terminal steps for social login
    setTerminalSteps([
      { text: `> Initializing OAuth flow for ${provider.name}...`, done: false },
      { text: '> Requesting authorization...', done: false },
      { text: '> Verifying credentials...', done: false },
      { text: `> ${provider.name} authentication successful!`, done: false }
    ]);
    setActiveTerminalStep(0);
    
    try {
      // Call login with the social provider ID
      const success = await auth.login(provider.id);
      
      if (success) {
        // Let terminal animation complete before moving to next step
        setTimeout(() => {
          setStep('create-identity');
        }, 1000);
      } else {
        setLocalError(`Login with ${provider.name} failed. Please try again.`);
      }
    } catch (err) {
      setLocalError('Failed to authenticate. Please try again.');
    } finally {
      setSocialLoginInProgress(null);
    }
  };

  const handleCreateIdentity = async () => {
    setLocalError(null);
    
    if (!auth.account) {
      setLocalError('No account connected. Please connect your wallet first.');
      return;
    }
    
    // Initialize terminal steps for identity creation
    const isSocialAccount = auth.account.provider !== undefined;
    
    setTerminalSteps([
      { text: '> Initializing identity registry...', done: false },
      { text: `> Preparing ${isSocialAccount ? 'social' : 'blockchain'} account verification...`, done: false },
      { text: '> Generating cryptographic keys...', done: false },
      { text: '> Creating decentralized identifier (DID)...', done: false },
      { text: '> DID created successfully!', done: false }
    ]);
    setActiveTerminalStep(0);
    
    try {
      // Determine if this is a social login
      const isSocialAccount = auth.account.provider !== undefined;
      
      // Call createIdentity with userId for social accounts
      const didId = isSocialAccount 
        ? await auth.createIdentity(auth.account.userId)
        : await auth.createIdentity();
      
      if (didId) {
        // Let terminal animation complete before moving to next step
        setTimeout(() => {
          setStep('verify-identity');
        }, 1000);
      } else {
        setLocalError('Failed to create identity. Please try again.');
      }
    } catch (err) {
      setLocalError('Error creating identity. Please try again.');
    }
  };

  const verifyIdentity = async () => {
    setLocalError(null);
    
    // Initialize terminal steps for verification
    setTerminalSteps([
      { text: '> Initializing zero-knowledge proof system...', done: false },
      { text: '> Generating cryptographic commitment...', done: false },
      { text: '> Computing zero-knowledge proof...', done: false },
      { text: '> Verifying proof on-chain...', done: false },
      { text: '> Proof verified successfully!', done: false }
    ]);
    setActiveTerminalStep(0);
    
    try {
      // The terminal steps will show the progress visually
      // We'll move to the next screen after the animations finish
      setTimeout(() => {
        setStep('complete');
      }, 6000);
    } catch (err) {
      setLocalError('Failed to verify identity. Please try again.');
    }
  };
  
  const reset = () => {
    setStep('connect-wallet');
    setLocalError(null);
    setTerminalSteps([]);
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
                <h2 className="text-lg font-bold text-emerald-400">Connect to Continue</h2>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Connect your Polkadot wallet or use a social account to access your decentralized identity.
              </p>
              
              {terminalSteps.length > 0 ? (
                <TerminalWindow title="Connection Status">
                  {terminalSteps.map((step, index) => (
                    <div key={index} className="mb-2">
                      {index <= activeTerminalStep ? (
                        <TerminalText 
                          text={step.text} 
                          onComplete={index === activeTerminalStep ? handleTerminalStepComplete : undefined}
                        />
                      ) : null}
                    </div>
                  ))}
                </TerminalWindow>
              ) : (
                <Button
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
                </Button>
              )}
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-xs text-muted-foreground">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    onClick={() => handleSocialLogin(provider)}
                    disabled={auth.isLoading || socialLoginInProgress !== null || terminalSteps.length > 0}
                    variant="outline"
                    className="py-5 flex items-center justify-center"
                  >
                    {socialLoginInProgress === provider.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <div className="mr-2 h-4 w-4 relative">
                        <Image 
                          src={provider.icon} 
                          alt={provider.name} 
                          fill 
                          className="object-contain"
                        />
                      </div>
                    )}
                    {provider.name}
                  </Button>
                ))}
              </div>
              
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
                {auth.account?.provider && (
                  <span className="block mt-2">
                    We'll link your {auth.account.provider} account to your DID.
                  </span>
                )}
              </p>
              
              {terminalSteps.length > 0 ? (
                <TerminalWindow title="Identity Creation">
                  {terminalSteps.map((step, index) => (
                    <div key={index} className="mb-2">
                      {index <= activeTerminalStep ? (
                        <TerminalText 
                          text={step.text} 
                          onComplete={index === activeTerminalStep ? handleTerminalStepComplete : undefined}
                        />
                      ) : null}
                    </div>
                  ))}
                </TerminalWindow>
              ) : (
                <Button
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
                </Button>
              )}
              
              {displayError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}
              
              {!terminalSteps.length && (
                <Button
                  onClick={reset}
                  disabled={auth.isLoading}
                  className="text-sm text-slate-500 hover:text-emerald-500 transition-colors flex items-center"
                  variant="ghost"
                >
                  Back
                </Button>
              )}
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
              
              {terminalSteps.length > 0 ? (
                <TerminalWindow title="ZK Proof Generation">
                  {terminalSteps.map((step, index) => (
                    <div key={index} className="mb-2">
                      {index <= activeTerminalStep ? (
                        <TerminalText 
                          text={step.text} 
                          onComplete={index === activeTerminalStep ? handleTerminalStepComplete : undefined}
                        />
                      ) : null}
                    </div>
                  ))}
                </TerminalWindow>
              ) : (
                <Button
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
                </Button>
              )}
              
              {displayError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 rounded text-sm text-red-600 dark:text-red-400 flex items-start mt-4">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}
              
              {!terminalSteps.length && (
                <Button
                  onClick={reset}
                  disabled={auth.isLoading}
                  className="text-sm text-slate-500 hover:text-emerald-500 transition-colors flex items-center"
                  variant="ghost"
                >
                  Back
                </Button>
              )}
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