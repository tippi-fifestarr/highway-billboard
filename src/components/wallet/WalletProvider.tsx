'use client';

import React, { ReactNode } from 'react';
import { AptosWalletAdapterProvider, WalletName } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import { NETWORK } from '@/utils/constants';

interface WalletProviderProps {
  children: ReactNode;
}

/**
 * WalletProvider component wraps the application with the AptosWalletAdapterProvider
 * This is a client component that provides wallet functionality to the app
 */
export default function WalletProvider({ children }: WalletProviderProps) {
  // Determine which network to use
  const network = NETWORK.name === 'devnet' ? Network.DEVNET : Network.TESTNET;

  return (
    <AptosWalletAdapterProvider
      optInWallets={["Petra"]}
      autoConnect={false}
      dappConfig={{ network }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}