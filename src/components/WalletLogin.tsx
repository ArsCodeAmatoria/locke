import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Wallet, CircleX, Loader2, ShieldAlert, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { MobileWalletConnect } from './MobileWalletConnect';

interface WalletLoginProps {
  onAccountSelect: (account: InjectedAccountWithMeta) => void;
}

export function WalletLogin({ onAccountSelect }: WalletLoginProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileWallet, setShowMobileWallet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };
    
    setIsMobile(checkMobile());
  }, []);
  
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Enable the extension
      const extensions = await web3Enable('zkID Login');
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found. Please install the Polkadot.js extension.');
      }
      
      // Get accounts
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in the Polkadot.js extension.');
      }
      
      setAccounts(allAccounts);
      toast.success('Wallet connected successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAccountSelect = (account: InjectedAccountWithMeta) => {
    onAccountSelect(account);
    toast.success(`Logged in with account: ${account.meta.name}`);
  };
  
  const handleMobileWalletConnect = () => {
    setShowMobileWallet(true);
  };
  
  const handleMobileWalletDismiss = () => {
    setShowMobileWallet(false);
  };
  
  return (
    <>
      <Card className="cyber-card backdrop-blur-sm w-full max-w-md">
        <CardHeader className="border-b border-emerald-400/20">
          <CardTitle className="flex items-center gap-2 terminal-text">
            <Wallet className="h-5 w-5 text-emerald-400" />
            Polkadot Wallet Authentication
          </CardTitle>
          <CardDescription className="text-slate-400">
            Connect your blockchain wallet to access secure identity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          {error && (
            <div className="bg-black/50 p-3 rounded-md flex items-center gap-2 mb-4 text-red-400 border border-red-900/50">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-mono">ERROR: AUTHENTICATION FAILED</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}
          
          {accounts.length === 0 ? (
            <div>
              <div className="p-3 bg-black/40 rounded-md border border-emerald-400/20 mb-4">
                <p className="text-sm text-slate-300 font-mono mb-1">
                  <span className="text-emerald-400">{`>`}</span> SECURE AUTHENTICATION PROTOCOL
                </p>
                <p className="text-xs text-slate-500">
                  Connect your Polkadot extension to verify your blockchain identity. Protect your data with zero-knowledge proofs.
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  className="cyber-button w-full" 
                  onClick={connectWallet} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      INITIALIZING CONNECTION...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      ESTABLISH DESKTOP CONNECTION
                    </>
                  )}
                </button>
                
                <button 
                  className="cyber-button-outline w-full" 
                  onClick={handleMobileWalletConnect}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  USE MOBILE WALLET
                </button>
                
                {!isMobile && (
                  <div className="p-2 bg-emerald-900/20 border border-emerald-400/20 rounded-md mt-2">
                    <p className="text-xs text-emerald-400 font-mono flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Mobile wallet provides enhanced security on smartphones and tablets
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-2 bg-black/40 rounded-md border border-emerald-400/20 mb-2">
                <p className="text-xs text-emerald-400 font-mono">
                  <ShieldCheck className="h-3 w-3 inline-block mr-1" />
                  IDENTITIES DETECTED: {accounts.length}
                </p>
              </div>
              
              <p className="text-sm text-slate-300 font-mono">SELECT ACCOUNT:</p>
              
              {accounts.map((account) => (
                <button
                  key={account.address}
                  className="w-full bg-black/30 border border-emerald-400/30 hover:border-emerald-400/60 rounded-md p-3 text-left transition-all"
                  onClick={() => handleAccountSelect(account)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-900/30 border border-emerald-400/40 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-emerald-400 terminal-text">
                        {account.meta.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono truncate">
                        {account.address.substring(0, 8)}...{account.address.substring(account.address.length - 8)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              <button 
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-center w-full mt-2"
                onClick={() => {
                  setAccounts([]);
                  setError(null);
                }}
              >
                <CircleX className="h-3 w-3 mr-1" />
                Clear connected accounts
              </button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-slate-500 border-t border-emerald-400/20 pt-4">
          <p className="font-mono">ZERO-KNOWLEDGE VERIFICATION · SUBSTRATE NETWORK · SECURE</p>
        </CardFooter>
      </Card>
      
      {showMobileWallet && (
        <MobileWalletConnect 
          onAccountSelect={handleAccountSelect}
          onDismiss={handleMobileWalletDismiss}
        />
      )}
    </>
  );
} 