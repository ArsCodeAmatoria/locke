'use client';

import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { Loader2, ChevronRight, AlertCircle, Shield, User, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function Login() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [extError, setExtError] = useState<string | null>(null);
  const auth = useAuth();

  // Load accounts from extension
  const loadAccounts = async () => {
    setLoading(true);
    setExtError(null);
    
    try {
      // Enable the extension
      const extensions = await web3Enable('Locke Identity App');
      
      if (extensions.length === 0) {
        setExtError('No Polkadot extension found. Please install the extension and refresh the page.');
        setLoading(false);
        return;
      }
      
      // Get all accounts
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        setExtError('No accounts found in the Polkadot extension. Please create an account and refresh the page.');
        setLoading(false);
        return;
      }
      
      setAccounts(allAccounts);
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to Polkadot extension:', err);
      setExtError('Failed to connect to Polkadot extension. Please ensure it is installed and accessible.');
      setLoading(false);
    }
  };

  // Handle login - no longer passing account parameter
  const handleLogin = async () => {
    const success = await auth.login();
    
    if (success) {
      toast({
        title: 'Logged in successfully',
        description: 'Welcome back to Locke Identity',
      });
    } else {
      toast({
        title: 'Login failed',
        description: auth.error || 'Could not log in with the selected account',
        variant: 'destructive',
      });
    }
  };

  // Handle creating a new identity - no longer passing account parameter
  const handleCreateIdentity = async () => {
    const didId = await auth.createIdentity();
    
    if (didId) {
      toast({
        title: 'Identity created',
        description: `Your new DID has been created: ${didId.substring(0, 15)}...`,
      });
    } else {
      toast({
        title: 'Identity creation failed',
        description: auth.error || 'Could not create a new identity',
        variant: 'destructive',
      });
    }
  };

  // Load accounts on component mount
  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      loadAccounts();
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  // Render loader while checking auth state
  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication status...</span>
      </div>
    );
  }

  // Render authenticated state
  if (auth.isAuthenticated && auth.identity) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
          <Shield className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authenticated</h2>
          <p className="text-muted-foreground mb-4">
            You are logged in with your decentralized identity.
          </p>
          <div className="bg-muted p-3 rounded-md w-full mb-4">
            <p className="font-mono text-sm break-all">
              <span className="font-bold">DID:</span> {auth.identity.did}
            </p>
            <p className="font-mono text-sm mt-2 break-all">
              <span className="font-bold">Account:</span> {auth.identity.address}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Render login form
  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <User className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <p className="text-muted-foreground">
          Select an account to log in or create a new identity
        </p>
      </div>

      {extError && (
        <div className="bg-destructive/10 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <p className="text-destructive text-sm">{extError}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Connecting to wallet...</span>
        </div>
      ) : (
        <>
          {accounts.length === 0 && !extError ? (
            <Button onClick={loadAccounts} className="w-full">
              Connect to Polkadot Extension
            </Button>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.address} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">{account.meta.name}</p>
                      <p className="text-xs text-muted-foreground truncate w-48">
                        {account.address}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleCreateIdentity}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        New ID
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleLogin}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
} 