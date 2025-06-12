import { useState, useEffect } from 'react';
import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';
import { getAccountAPTBalance } from '@/services/contract';
import { WalletStatus } from '@/types';
import { MAX_APT_DISPLAY } from '@/utils/constants';
// No need to import specific types for now

/**
 * Custom hook to manage wallet connection and balance
 * @returns Object containing wallet state and functions
 */
export function useWallet() {
  const { 
    connect,
    disconnect,
    account,
    connected,
    wallet,
    network,
    signAndSubmitTransaction
  } = useAptosWallet();
  
  const [status, setStatus] = useState<WalletStatus>(WalletStatus.DISCONNECTED);
  const [balance, setBalance] = useState<number>(0);
  const [fuelPercentage, setFuelPercentage] = useState<number>(0);
  
  // Connect to Petra wallet
  const connectWallet = async () => {
    try {
      setStatus(WalletStatus.CONNECTING);
      
      // Check if the wallet is connected to the correct network
      if (network && network.name && !network.name.toLowerCase().includes('testnet')) {
        console.warn('Wallet is not connected to Testnet. Please switch to Testnet in your Petra wallet.');
        alert('Please make sure your Petra wallet is connected to Testnet, not Devnet or Mainnet.');
      }
      
      await connect("Petra");
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setStatus(WalletStatus.ERROR);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setStatus(WalletStatus.DISCONNECTED);
      setBalance(0);
      setFuelPercentage(0);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  // Update balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && account) {
        try {
          // Ensure account.address is a string
          const addressStr = typeof account.address === 'string'
            ? account.address
            : String(account.address);
          
          const aptBalance = await getAccountAPTBalance(addressStr);
          setBalance(aptBalance);
          
          // Calculate fuel percentage (0-100)
          const percentage = Math.min((aptBalance / MAX_APT_DISPLAY) * 100, 100);
          setFuelPercentage(percentage);
          
          setStatus(WalletStatus.CONNECTED);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setStatus(WalletStatus.ERROR);
        }
      } else {
        setStatus(WalletStatus.DISCONNECTED);
        setBalance(0);
        setFuelPercentage(0);
      }
    };
    
    fetchBalance();
  }, [connected, account]);
  

  return {
    connectWallet,
    disconnectWallet,
    status,
    balance,
    fuelPercentage,
    account,
    connected,
    wallet,
    network,
    signAndSubmitTransaction
  };
}