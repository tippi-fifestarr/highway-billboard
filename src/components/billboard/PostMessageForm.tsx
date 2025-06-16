import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletStatus } from '@/types';
import { COLORS, CONTRACT_ADDRESS, MODULE_NAME, APTOS_API_KEY } from '@/utils/constants';
import { createGasStationClient } from '@aptos-labs/gas-station-client';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

/**
 * PostMessageForm component with simple gas station integration following README exactly
 */
export default function PostMessageForm() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  
  const {
    status,
    account,
    connectWallet,
    signTransaction,
    network,
    walletName
  } = useWallet();

  // Create Aptos client (following README)
  const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

  // Create gas station client (following README exactly)
  const gasStationClient = createGasStationClient({
    network: Network.TESTNET,
    apiKey: APTOS_API_KEY,
  });

  const handleConnectWallet = (walletType: 'petra' | 'social') => {
    setShowWalletOptions(false);
    connectWallet(walletType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (status !== WalletStatus.CONNECTED || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!APTOS_API_KEY) {
      setError('Gas station API key not configured');
      return;
    }

    // Different approaches for different wallets
    const isSocialLogin = walletName === 'social';
    const useGasStation = !isSocialLogin; // Only use gas station for Petra
    
    console.log(`Using ${isSocialLogin ? 'social login (normal transaction)' : 'Petra (gas station sponsored)'} approach`);
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      
      // Convert account.address to string if needed
      const addressStr = typeof account.address === 'string'
        ? account.address
        : account.address.toString();
      
      console.log('Starting simple gas station flow for:', addressStr);
      console.log('Using wallet:', walletName);
      
      // Step 1: Build the transaction (different for each wallet type)
      console.log('Building transaction...');
      const transaction = await aptos.transaction.build.simple({
        sender: addressStr,
        // Only use withFeePayer for Petra (gas station), not for social login
        withFeePayer: useGasStation,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_message`,
          functionArguments: [CONTRACT_ADDRESS, message],
        },
        options: {
          // Gas station has a maximum gas limit of 50, normal transactions can use more
          maxGasAmount: useGasStation ? 50 : 200000,
        },
      });
      
      console.log('Transaction built successfully');
      
      // Step 2: Sign the transaction
      console.log('Signing transaction...');
      const signResult = await signTransaction({ transactionOrPayload: transaction });
      
      if (!signResult) {
        throw new Error('Failed to sign transaction - no result returned');
      }
      
      console.log('Transaction signed successfully, extracting authenticator...');
      console.log('Sign result structure:', Object.keys(signResult));
      
      // Extract the authenticator from wallet adapter result to match README pattern
      // Wallet adapter returns { authenticator, rawTransaction }, but gas station needs just authenticator
      const senderAuth = signResult.authenticator;
      
      console.log('Extracted authenticator for gas station');
      
      let transactionHash;
      
      if (useGasStation) {
        // Step 3a: Submit to gas station (Petra wallet)
        console.log('Submitting to gas station...');
        console.log('Transaction object:', transaction);
        console.log('SenderAuth object:', senderAuth);
        
        const response = await gasStationClient.simpleSignAndSubmitTransaction(transaction, senderAuth);
        
        if (response.error !== undefined || response.data === undefined) {
          console.error('Gas station response error:', response.error);
          throw new Error("Error signing and submitting transaction: " + JSON.stringify(response.error));
        }
        
        console.log('Gas station submission successful:', response.data.transactionHash);
        transactionHash = response.data.transactionHash;
      } else {
        // Step 3b: Submit normally (Social login)
        console.log('Submitting transaction normally (user pays gas)...');
        const response = await aptos.transaction.submit.simple({
          transaction: transaction,
          senderAuthenticator: senderAuth,
        });
        
        console.log('Normal transaction submission successful:', response.hash);
        transactionHash = response.hash;
      }
      
      // Step 4: Wait for the transaction to be executed
      console.log('Waiting for transaction execution...');
      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: transactionHash,
        options: { checkSuccess: true },
      });
      
      console.log("Transaction executed successfully", executedTransaction.hash);
      
      // Clear the form and show success message
      setMessage('');
      setSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Gas station error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to post message';
      
      if (err instanceof Error) {
        if (err.message.includes('Rate limit')) {
          errorMessage = 'Too many requests. Please wait a minute before posting again.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('gas station')) {
          errorMessage = 'Gas station service unavailable. Please try again later.';
        } else if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (err.message.includes('insufficient')) {
          errorMessage = 'Insufficient funds. For social login, please use Petra Wallet or fund your account first.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg border-2" style={{ borderColor: COLORS.highwaySignOrange }}>
      <h2 className="text-2xl font-bold text-center mb-4" style={{ color: COLORS.highwaySignOrange }}>
        ⛽ Gas Station - Buy Billboard Space
      </h2>
      
      {/* Gas station graphics */}
      <div className="relative mb-6">
        <div className="w-full h-2 bg-gray-300"></div>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-200 rounded-t-lg border-2 border-gray-400 border-b-0 flex items-center justify-center">
          <span className="text-xs font-bold">GAS</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
            Your Message:
          </label>
          <textarea
            id="message"
            className="w-full p-3 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your billboard message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            maxLength={100} // Limit message length
          />
          <div className="text-right text-sm text-gray-500">
            {message.length}/100 characters
          </div>
        </div>
        
        {status !== WalletStatus.CONNECTED ? (
          <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
            <p className="text-yellow-800">
              💡 You need to connect your wallet before posting a message.
            </p>
            
            {!showWalletOptions ? (
              <button
                type="button"
                onClick={() => setShowWalletOptions(true)}
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
              >
                🔑 Start Engine
              </button>
            ) : (
              <div className="mt-3 space-y-2">
                <p className="text-yellow-700 font-medium mb-2">Choose your connection method:</p>
                
                <button
                  type="button"
                  onClick={() => handleConnectWallet('petra')}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🦊</span>
                  Connect with Petra Wallet
                </button>
                
                <button
                  type="button"
                  onClick={() => handleConnectWallet('social')}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Continue with Google
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowWalletOptions(false)}
                  className="w-full bg-gray-400 text-white py-1 px-4 rounded hover:bg-gray-500 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">
              💡 Your wallet is connected and ready to post!
            </p>
            {walletName && (
              <p className="text-green-700 text-sm mt-1">
                Connected via: {walletName === 'petra' ? '🦊 Petra Wallet' : '🔗 Google Social Login'}
              </p>
            )}
            {walletName === 'social' && (
              <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <p className="text-yellow-800 text-sm">
                  💰 <strong>Note:</strong> Social login accounts pay their own gas fees.
                  For zero gas fees, use Petra Wallet with gas station sponsorship.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Network warning */}
        {status === WalletStatus.CONNECTED && network && network.name && !network.name.toLowerCase().includes('testnet') && (
          <div className="mb-4 p-4 bg-red-100 rounded-lg">
            <p className="text-red-800 font-bold">
              ⚠️ Warning: You are not connected to Testnet!
            </p>
            <p className="text-red-700 mt-1">
              The gas station only works on Testnet. Please switch your wallet to Testnet to use free transactions.
            </p>
          </div>
        )}
        
        {/* Gas station info */}
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800 font-bold">
            ⛽ Dual Payment System
          </p>
          <p className="text-blue-600 mt-1">
            <strong>🦊 Petra Wallet:</strong> Zero gas fees (sponsored by gas station)<br/>
            <strong>🔗 Social Login:</strong> You pay gas fees (normal transaction)
          </p>
          {!APTOS_API_KEY && (
            <p className="text-red-600 text-sm mt-1">
              ⚠️ API key not configured - gas station sponsorship unavailable
            </p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">
              ✅ Your message has been posted successfully with zero gas fees!
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          disabled={isSubmitting || status !== WalletStatus.CONNECTED || !APTOS_API_KEY}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {walletName === 'social' ? 'Testing Social Login Workaround...' : 'Posting via Gas Station...'}
            </>
          ) : (
            <>🚗 POST TO HIGHWAY {walletName === 'social' ? '(YOU PAY GAS)' : '(FREE GAS)'}</>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Gas station + social login integration with zero gas fees!</p>
      </div>
    </div>
  );
}