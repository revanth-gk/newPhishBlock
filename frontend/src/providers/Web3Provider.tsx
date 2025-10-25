'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';

// Create wagmi config with a demo project ID
const config = getDefaultConfig({
  appName: 'PhishBlock',
  projectId: 'YOUR_PROJECT_ID_HERE', // In production, replace with your actual WalletConnect project ID
  chains: [mainnet, sepolia],
  ssr: true,
});

// Create query client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}