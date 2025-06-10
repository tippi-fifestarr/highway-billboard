import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletStatus } from '@/types';
import GasGauge from './GasGauge';
import { COLORS } from '@/utils/constants';

/**
 * WalletConnector component handles wallet connection and displays wallet status
 */
export default function WalletConnector() {
  const { 
    connectWallet, 
    disconnectWallet, 
    status, 
    balance, 
    fuelPercentage,
    account 
  } = useWallet();

  // Format wallet address for display
  const formatAddress = (address: string | object | unknown) => {
    if (!address) return '';
    
    // Ensure address is a string
    const addressStr = typeof address === 'string'
      ? address
      : String(address);
      
    return `${addressStr.substring(0, 6)}...${addressStr.substring(addressStr.length - 4)}`;
  };

  // Render different button based on wallet status
  const renderConnectButton = () => {
    switch (status) {
      case WalletStatus.DISCONNECTED:
        return (
          <button 
            onClick={connectWallet}
            className="bg-gradient-to-r from-yellow-500 to-green-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            🔑 Start Engine
          </button>
        );
      
      case WalletStatus.CONNECTING:
        return (
          <button 
            disabled
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded-full shadow-md"
          >
            🔄 Starting...
          </button>
        );
      
      case WalletStatus.CONNECTED:
        return (
          <button 
            onClick={disconnectWallet}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            🛑 Stop Engine
          </button>
        );
      
      case WalletStatus.ERROR:
        return (
          <button 
            onClick={connectWallet}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            ⚠️ Engine Failure - Retry
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border-2" style={{ borderColor: COLORS.highwaySignBlue }}>
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: COLORS.highwaySignBlue }}>Dashboard</h2>
        {renderConnectButton()}
      </div>
      
      {status === WalletStatus.CONNECTED && account && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">
              <div className="font-bold">Driver:</div>
              <div>{formatAddress(account.address)}</div>
            </div>
            <GasGauge percentage={fuelPercentage} balance={balance} />
          </div>
        </div>
      )}
    </div>
  );
}