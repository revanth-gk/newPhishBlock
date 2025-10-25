'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet() {
  return (
    <div className="flex items-center justify-center rk-connect-wrapper">
      <ConnectButton
        showBalance={false}
        chainStatus="none"
        accountStatus="address"
      />
    </div>
  );
}