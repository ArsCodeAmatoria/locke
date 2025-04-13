'use client';

import { useState, useEffect } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Smartphone, QrCode, Scan, Loader2, CircleAlert, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { WalletConnectProvider, convertWalletConnectAccount } from '@/lib/walletconnect-utils';

// Mock wallet types for mobile
export type MobileWalletType = 'walletconnect' | 'nova' | 'talisman' | 'subwallet' | 'polkadotjs';

interface MobileWalletDetails {
  id: MobileWalletType;
  name: string;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
}

interface MobileWalletConnectProps {
  onAccountSelect: (account: InjectedAccountWithMeta) => void;
  onDismiss: () => void;
}

export function MobileWalletConnect({ onAccountSelect, onDismiss }: MobileWalletConnectProps) {
  const [selectedWallet, setSelectedWallet] = useState<MobileWalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };
    
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    // Setup WalletConnect event listeners if WalletConnect is selected
    if (selectedWallet === 'walletconnect') {
      const walletConnect = WalletConnectProvider.getInstance();
      
      const onConnectHandler = (accounts: any[]) => {
        if (accounts.length > 0) {
          // Convert the first account to the format expected by onAccountSelect
          const account = convertWalletConnectAccount(accounts[0]);
          
          setIsConnecting(false);
          toast.success(`Connected to WalletConnect`);
          onAccountSelect(account);
        }
      };
      
      const unsubscribeConnect = walletConnect.onConnect(onConnectHandler);
      
      return () => {
        unsubscribeConnect();
      };
    }
  }, [selectedWallet, onAccountSelect]);

  const wallets: MobileWalletDetails[] = [
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: <QrCode className="h-5 w-5" />,
      description: 'Connect using any WalletConnect-compatible wallet',
      isAvailable: true,
    },
    {
      id: 'nova',
      name: 'Nova Wallet',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Polkadot & Kusama mobile wallet',
      isAvailable: true,
    },
    {
      id: 'talisman',
      name: 'Talisman',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Cross-chain wallet',
      isAvailable: true,
    },
    {
      id: 'subwallet',
      name: 'SubWallet',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Polkadot ecosystem wallet',
      isAvailable: true,
    },
    {
      id: 'polkadotjs',
      name: 'Polkadot.js',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Official Polkadot mobile wallet',
      isAvailable: true,
    },
  ];

  const connectWallet = async (walletType: MobileWalletType) => {
    try {
      setSelectedWallet(walletType);
      setIsConnecting(true);
      setError(null);

      if (walletType === 'walletconnect') {
        // Use our WalletConnect provider to establish connection
        const walletConnect = WalletConnectProvider.getInstance();
        const uri = await walletConnect.connect();
        
        // Generate QR code for the URI
        const qrCodeUrl = walletConnect.getQRCodeUrl(uri);
        setQrCode(qrCodeUrl);
        
        // Also set a deep link for mobile browsers
        setDeepLink(`https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`);
      } else {
        // For other wallet types, we'd generate a deep link
        const dappUrl = window.location.href;
        let deepLinkUri = `${walletType}://wallet/connect?dappUrl=${encodeURIComponent(dappUrl)}`;
        
        // Set specific deep links for known wallets
        if (walletType === 'nova') {
          deepLinkUri = `https://novawallet.io/connect?dappUrl=${encodeURIComponent(dappUrl)}`;
        } else if (walletType === 'talisman') {
          deepLinkUri = `https://app.talisman.xyz/connect?dappUrl=${encodeURIComponent(dappUrl)}`;
        } else if (walletType === 'subwallet') {
          deepLinkUri = `https://mobile.subwallet.app/connect?dappUrl=${encodeURIComponent(dappUrl)}`;
        } else if (walletType === 'polkadotjs') {
          deepLinkUri = `polkadot://wallet/connect?dappUrl=${encodeURIComponent(dappUrl)}`;
        }
        
        setDeepLink(deepLinkUri);
        
        // If on mobile, we can directly open the app
        if (isMobile) {
          window.location.href = deepLinkUri;
        }
        
        // For non-WalletConnect wallets, we'll simulate a connection after a delay
        // In a real implementation, this would be handled by the wallet's callback
        setTimeout(() => {
          handleNonWalletConnectSuccess(walletType);
        }, 3000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      toast.error(message);
      setIsConnecting(false);
    }
  };

  const handleNonWalletConnectSuccess = (walletType: MobileWalletType) => {
    // Create a mock account for demonstration
    const mockAccount: InjectedAccountWithMeta = {
      address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      meta: {
        name: `${wallets.find(w => w.id === walletType)?.name} Account`,
        source: walletType,
      },
    };
    
    toast.success(`Connected to ${walletType} wallet`);
    setIsConnecting(false);
    onAccountSelect(mockAccount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="cyber-card max-w-md w-full max-h-[80vh] overflow-auto">
        <CardHeader className="border-b border-emerald-400/20">
          <div className="flex justify-between items-center">
            <CardTitle className="terminal-text text-emerald-400">Mobile Wallet</CardTitle>
            <button 
              onClick={onDismiss}
              className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40"
            >
              <CircleAlert className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <CardDescription className="text-slate-400">
            Connect using your preferred mobile wallet
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-4">
          {!selectedWallet ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 mb-2">Select a wallet to continue:</p>
              <div className="wallet-grid">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    className="w-full bg-black/30 border border-emerald-400/20 hover:border-emerald-400/60 rounded-md p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    onClick={() => connectWallet(wallet.id)}
                    disabled={!wallet.isAvailable}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-900/30 border border-emerald-400/40 flex items-center justify-center shrink-0 mr-3">
                        {wallet.icon}
                      </div>
                      <div>
                        <p className="font-medium text-emerald-400 terminal-text">{wallet.name}</p>
                        <p className="text-xs text-slate-500">{wallet.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-black/50 p-4 rounded-md mb-4">
                <p className="text-sm text-emerald-400 mb-2 terminal-text">
                  Connecting to {wallets.find(w => w.id === selectedWallet)?.name}...
                </p>
                
                {isConnecting ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-4">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                )}
                
                {qrCode && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-300 mb-2">Scan with your wallet app:</p>
                    <div className="qr-container">
                      <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                    </div>
                  </div>
                )}
                
                {deepLink && isMobile && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-300 mb-2">Open in wallet app:</p>
                    <button 
                      className="deep-link-button"
                      onClick={() => window.location.href = deepLink}
                    >
                      <Scan className="h-4 w-4 mr-2 inline-block" />
                      Open {wallets.find(w => w.id === selectedWallet)?.name}
                    </button>
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-500/20 rounded-md mt-4 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>
              
              <button 
                className="text-sm text-slate-400 hover:text-emerald-400"
                onClick={() => {
                  setSelectedWallet(null);
                  setQrCode(null);
                  setDeepLink(null);
                  setError(null);
                }}
              >
                Choose different wallet
              </button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-emerald-400/20 pt-4">
          <p className="text-xs text-slate-500 text-center w-full">
            Secure connection using approved mobile wallet applications
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 