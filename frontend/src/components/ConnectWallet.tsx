'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet() {
  return (
    <div className="flex items-center justify-center h-full">
      <ConnectButton
        showBalance={false}
        chainStatus="none"
        accountStatus="address"
      />
    </div>
  );
}