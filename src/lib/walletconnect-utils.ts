'use client';

// This is a mock implementation of WalletConnect for demonstration purposes
// In production, you would implement the real WalletConnect API

export interface WalletConnectSession {
  id: string;
  uri: string;
  peerMeta?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

export interface WalletAccount {
  address: string;
  chainId: number;
  name?: string;
}

export class WalletConnectProvider {
  private static instance: WalletConnectProvider;
  private session: WalletConnectSession | null = null;
  private connected = false;
  private accounts: WalletAccount[] = [];
  private onConnectionCallbacks: ((accounts: WalletAccount[]) => void)[] = [];
  private onDisconnectCallbacks: (() => void)[] = [];
  
  private constructor() {}
  
  public static getInstance(): WalletConnectProvider {
    if (!WalletConnectProvider.instance) {
      WalletConnectProvider.instance = new WalletConnectProvider();
    }
    return WalletConnectProvider.instance;
  }
  
  public async connect(): Promise<string> {
    // In a real implementation, this would create a WalletConnect client and return the URI
    // For demo purposes, we'll return a fake URI
    
    return new Promise(resolve => {
      setTimeout(() => {
        const sessionId = Math.random().toString(36).substring(2, 15);
        const uri = `wc:${sessionId}@1?bridge=https://bridge.walletconnect.org&key=${Math.random().toString(36).substring(2, 15)}`;
        
        this.session = {
          id: sessionId,
          uri,
          peerMeta: {
            name: "zkID Login",
            description: "Decentralized identity verification with zero-knowledge proofs",
            url: window.location.origin,
            icons: [`${window.location.origin}/logo.svg`]
          }
        };
        
        // Mock QR code generation
        resolve(uri);
        
        // After 3 seconds, simulate a successful connection
        setTimeout(() => {
          this.mockSuccessfulConnection();
        }, 3000);
      }, 500);
    });
  }
  
  private mockSuccessfulConnection() {
    // Generate mock accounts
    this.accounts = [
      {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        chainId: 0,
        name: 'Mobile Wallet Account'
      }
    ];
    
    this.connected = true;
    
    // Notify listeners
    this.onConnectionCallbacks.forEach(callback => callback(this.accounts));
  }
  
  public disconnect() {
    this.connected = false;
    this.session = null;
    this.accounts = [];
    
    // Notify listeners
    this.onDisconnectCallbacks.forEach(callback => callback());
  }
  
  public isConnected(): boolean {
    return this.connected;
  }
  
  public getAccounts(): WalletAccount[] {
    return this.accounts;
  }
  
  public onConnect(callback: (accounts: WalletAccount[]) => void) {
    this.onConnectionCallbacks.push(callback);
    return () => {
      this.onConnectionCallbacks = this.onConnectionCallbacks.filter(cb => cb !== callback);
    };
  }
  
  public onDisconnect(callback: () => void) {
    this.onDisconnectCallbacks.push(callback);
    return () => {
      this.onDisconnectCallbacks = this.onDisconnectCallbacks.filter(cb => cb !== callback);
    };
  }
  
  public getQRCodeUrl(uri: string): string {
    // In a real implementation, you'd use a QR code library
    // For demo, we'll use Google Charts API to generate a QR code
    return `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(uri)}&chs=300x300&chld=L|0`;
  }
}

// Helper function to convert WalletConnect accounts to Polkadot.js compatible format
export function convertWalletConnectAccount(account: WalletAccount): any {
  return {
    address: account.address,
    meta: {
      name: account.name || 'Mobile Account',
      source: 'walletconnect'
    }
  };
} 