import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Wallet, CircleX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WalletLoginProps {
  onAccountSelect: (account: InjectedAccountWithMeta) => void;
}

export function WalletLogin({ onAccountSelect }: WalletLoginProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Polkadot Wallet Login
        </CardTitle>
        <CardDescription>
          Connect your Polkadot wallet to access zkID services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 mb-4 text-red-700">
            <CircleX className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {accounts.length === 0 ? (
          <Button 
            className="w-full" 
            onClick={connectWallet} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">Select an account:</p>
            {accounts.map((account) => (
              <Button
                key={account.address}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleAccountSelect(account)}
              >
                <div className="truncate">
                  <p className="font-medium">{account.meta.name}</p>
                  <p className="text-xs text-gray-500 truncate">{account.address}</p>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-gray-500">
        Your credentials will be verified without revealing personal data
      </CardFooter>
    </Card>
  );
} 