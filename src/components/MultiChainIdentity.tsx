'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChainType, useMultiChain } from '@/lib/multi-chain';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FadeIn } from '@/components/ui/motion-component';
import { 
  Layers, 
  Check, 
  Link2, 
  Plus, 
  Unlink, 
  AlertCircle, 
  Shield,
  Database,
  Wallet
} from 'lucide-react';

/**
 * Multi-Chain Identity Management Component
 * Displays and manages identities across multiple blockchains
 */
export function MultiChainIdentity() {
  const {
    isInitializing,
    isReady,
    activeIdentity,
    activeDid,
    supportedChains,
    initializedChains,
    error,
    initialize,
    resolveDid,
    createDid,
    setActiveDid,
    linkDid,
    getChains,
    disconnect
  } = useMultiChain();

  const [didInput, setDidInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionError, setResolutionError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [availableChains, setAvailableChains] = useState<ChainType[]>([]);

  // Initialize chains on component mount
  useEffect(() => {
    const initChains = async () => {
      try {
        // Initialize with all supported chains
        await initialize([
          ChainType.SUBSTRATE, 
          ChainType.ETHEREUM,
          ChainType.SOLANA,
          ChainType.COSMOS,
          ChainType.NEAR
        ]);
      } catch (error) {
        console.error('Failed to initialize chains:', error);
        // The state will be updated by the initialize function
        // so we don't need to do anything else here
      }
    };

    if (!isReady && !isInitializing) {
      initChains();
    }
  }, [isReady, isInitializing, initialize]);

  // Get available chains
  useEffect(() => {
    setAvailableChains(supportedChains.filter(chain => !initializedChains.includes(chain)));
  }, [supportedChains, initializedChains]);

  // Handle DID resolution
  const handleResolveDid = async () => {
    if (!didInput.trim()) return;

    setIsResolving(true);
    setResolutionError(null);

    try {
      const result = await resolveDid(didInput);

      if (result.success && result.identity) {
        // Set as active DID if resolution was successful
        await setActiveDid(didInput);
      } else {
        setResolutionError(result.error || 'Failed to resolve DID');
      }
    } catch (error) {
      setResolutionError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsResolving(false);
    }
  };

  // Handle DID creation
  const handleCreateDid = async () => {
    if (!selectedChain) return;

    setIsCreating(true);

    try {
      // We'd typically get the account from a wallet here
      // For now, just mock an account object
      const mockAccount = { address: '0x1234567890abcdef', type: selectedChain };
      
      const did = await createDid(selectedChain, mockAccount);
      
      if (!did) {
        throw new Error(`Failed to create DID on ${selectedChain}`);
      }
      
      // Success message or further actions would be implemented here
    } catch (error) {
      console.error('Error creating DID:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle DID linking
  const handleLinkDid = async () => {
    if (!didInput.trim() || !activeDid) return;

    setIsLinking(true);

    try {
      const success = await linkDid(didInput);
      
      if (!success) {
        throw new Error('Failed to link DIDs');
      }
      
      // Clear input on success
      setDidInput('');
      
      // Success message or further actions would be implemented here
    } catch (error) {
      console.error('Error linking DIDs:', error);
    } finally {
      setIsLinking(false);
    }
  };

  // Connect a new chain
  const handleConnectChain = async (chainType: ChainType) => {
    try {
      await initialize([chainType]);
    } catch (error) {
      console.error(`Failed to connect ${chainType} chain:`, error);
    }
  };

  // Get color for chain badge
  const getChainColor = (chain: ChainType): string => {
    const colors: Record<ChainType, string> = {
      [ChainType.SUBSTRATE]: 'bg-emerald-100 text-emerald-800',
      [ChainType.ETHEREUM]: 'bg-blue-100 text-blue-800',
      [ChainType.SOLANA]: 'bg-purple-100 text-purple-800',
      [ChainType.COSMOS]: 'bg-indigo-100 text-indigo-800',
      [ChainType.NEAR]: 'bg-yellow-100 text-yellow-800',
    };
    return colors[chain] || 'bg-gray-100 text-gray-800';
  };

  // Get name for chain
  const getChainName = (chain: ChainType): string => {
    const names: Record<ChainType, string> = {
      [ChainType.SUBSTRATE]: 'Polkadot/Kusama',
      [ChainType.ETHEREUM]: 'Ethereum/Polygon',
      [ChainType.SOLANA]: 'Solana',
      [ChainType.COSMOS]: 'Cosmos Hub',
      [ChainType.NEAR]: 'NEAR Protocol',
    };
    return names[chain] || chain;
  };

  // Render loading state
  if (isInitializing) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <LoadingSpinner size={40} />
          <p className="text-sm text-muted-foreground">Initializing multi-chain support...</p>
        </div>
      </Card>
    );
  }

  // Render error state
  if (error && !isReady) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold">Initialization Error</h3>
          <p className="text-center text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => initialize()} variant="outline">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Multi-Chain Identity</h2>
        </div>

        {/* Supported Blockchains */}
        <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
          <h3 className="mb-3 font-medium">Supported Blockchains</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.values(ChainType).map((chain) => (
              <div
                key={chain}
                className={`px-3 py-2 rounded-md ${
                  initializedChains.includes(chain) 
                    ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900' 
                    : 'bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getChainName(chain)}</span>
                  {initializedChains.includes(chain) && (
                    <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3 mr-1" /> Connected
                    </span>
                  )}
                </div>
                {!initializedChains.includes(chain) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full text-xs h-7"
                    onClick={() => handleConnectChain(chain)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connected Chains */}
        <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
          <h3 className="mb-3 font-medium">Connected Blockchains</h3>
          <div className="flex flex-wrap gap-2">
            {initializedChains.map((chain) => (
              <div 
                key={chain} 
                className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${getChainColor(chain)}`}
              >
                <Database className="mr-1 h-3 w-3" />
                {getChainName(chain)}
              </div>
            ))}
          </div>
          
          {initializedChains.length === 0 && (
            <p className="text-sm text-muted-foreground">No blockchains connected</p>
          )}
        </div>

        {/* Active Identity */}
        {activeIdentity ? (
          <FadeIn>
            <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
              <h3 className="mb-3 font-medium">Active Identity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DID:</span>
                  <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
                    {activeDid}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Controller:</span>
                  <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
                    {activeIdentity.controller.substring(0, 10)}...
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Linked DIDs:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(activeIdentity.linkedDids).map(([chainKey, did]) => (
                      <div 
                        key={chainKey} 
                        className="flex items-center justify-between rounded bg-slate-100 px-2 py-1 dark:bg-slate-800"
                      >
                        <span className="text-xs font-medium">{chainKey}:</span>
                        <span className="font-mono text-xs">{did.substring(0, 12)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ) :
          <div className="rounded-md border border-dashed p-6 text-center">
            <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 font-medium">No Active Identity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Resolve an existing DID or create a new one to get started
            </p>
          </div>
        }

        {/* Actions */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 font-medium">Resolve DID</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={didInput}
                onChange={(e) => setDidInput(e.target.value)}
                placeholder="Enter DID (did:multi:...)"
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <Button 
                onClick={handleResolveDid} 
                disabled={isResolving || !didInput.trim()}
              >
                {isResolving ? <LoadingSpinner size={16} className="mr-2" /> : null}
                Resolve
              </Button>
            </div>
            {resolutionError && (
              <p className="mt-2 text-sm text-red-500">{resolutionError}</p>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-medium">Create New DID</h3>
            <div className="flex space-x-2">
              <select
                value={selectedChain || ''}
                onChange={(e) => setSelectedChain(e.target.value as ChainType)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Select Blockchain</option>
                {initializedChains.map((chain) => (
                  <option key={chain} value={chain}>
                    {getChainName(chain)}
                  </option>
                ))}
              </select>
              <Button 
                onClick={handleCreateDid} 
                disabled={isCreating || !selectedChain}
              >
                {isCreating ? <LoadingSpinner size={16} className="mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                Create
              </Button>
            </div>
          </div>

          {activeIdentity && (
            <div>
              <h3 className="mb-3 font-medium">Link DID</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={didInput}
                  onChange={(e) => setDidInput(e.target.value)}
                  placeholder="Enter DID to link"
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <Button 
                  onClick={handleLinkDid} 
                  disabled={isLinking || !didInput.trim()}
                >
                  {isLinking ? (
                    <LoadingSpinner size={16} className="mr-2" />
                  ) : (
                    <Link2 className="mr-2 h-4 w-4" />
                  )}
                  Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Disconnect Button */}
        {initializedChains.length > 0 && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={disconnect} 
              className="w-full"
            >
              <Unlink className="mr-2 h-4 w-4" />
              Disconnect All Chains
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 