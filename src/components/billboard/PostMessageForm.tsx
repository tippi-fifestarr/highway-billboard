import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { sendMessage } from '@/services/contract';
import { WalletStatus } from '@/types';
import { COLORS } from '@/utils/constants';

/**
 * PostMessageForm component allows users to post new messages to the billboard
 */
export default function PostMessageForm() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { 
    status, 
    account, 
    connectWallet,
    signAndSubmitTransaction 
  } = useWallet();

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
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      
      // Create the transaction payload
      const transaction = await sendMessage(account.address, message);
      
      // Sign and submit the transaction
      const result = await signAndSubmitTransaction(transaction);
      
      console.log('Transaction submitted:', result);
      
      // Clear the form and show success message
      setMessage('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error posting message:', err);
      setError(err instanceof Error ? err.message : 'Failed to post message');
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
            <button
              type="button"
              onClick={connectWallet}
              className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
            >
              🔑 Start Engine
            </button>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">
              💡 Your wallet is connected and ready to post!
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">
              ✅ Your message has been posted successfully!
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          disabled={isSubmitting || status !== WalletStatus.CONNECTED}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </>
          ) : (
            <>🚗 POST TO HIGHWAY</>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 In Phase 2, you'll be able to pay more APT to feature your message longer!</p>
      </div>
    </div>
  );
}