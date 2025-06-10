import React from 'react';
import { useFeaturedMessage } from '@/hooks/useMessages';
import { COLORS } from '@/utils/constants';

/**
 * Helper function to format timestamp to a readable date
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp / 1000); // Convert microseconds to milliseconds
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Helper function to format wallet address
 */
const formatAddress = (address: string | object | unknown): string => {
  if (!address) return '';
  
  // Ensure address is a string
  const addressStr = typeof address === 'string'
    ? address
    : String(address);
    
  return `${addressStr.substring(0, 6)}...${addressStr.substring(addressStr.length - 4)}`;
};

/**
 * FeaturedBillboard component displays the featured message
 */
export default function FeaturedBillboard() {
  const { data: message, loading, error } = useFeaturedMessage();

  if (loading) {
    return (
      <div className="w-full p-8 bg-white rounded-lg shadow-lg border-4 flex flex-col items-center justify-center min-h-[300px]" style={{ borderColor: COLORS.highwaySignBlue }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-white rounded-lg shadow-lg border-4" style={{ borderColor: COLORS.highwaySignRed }}>
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: COLORS.highwaySignRed }}>⚠️ Billboard Error</h2>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="w-full p-8 bg-white rounded-lg shadow-lg border-4" style={{ borderColor: COLORS.highwaySignBlue }}>
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: COLORS.highwaySignBlue }}>⭐ FEATURED BILLBOARD</h2>
        <p className="text-xl text-center mb-4">No messages yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Billboard structure */}
      <div className="w-full p-8 bg-white rounded-lg shadow-lg border-4" style={{ borderColor: COLORS.highwaySignBlue }}>
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: COLORS.highwaySignBlue }}>⭐ FEATURED BILLBOARD</h2>
        
        {/* Message content */}
        <div className="bg-gray-50 p-6 rounded-lg mb-4 shadow-inner">
          <p className="text-2xl text-center font-bold mb-2" style={{ fontFamily: 'Interstate, Arial, sans-serif' }}>
            &ldquo;{message.content}&rdquo;
          </p>
        </div>
        
        {/* Message metadata */}
        <div className="flex justify-between text-sm">
          <span>📍 Posted by: {formatAddress(message.author)}</span>
          <span>⏰ {formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
      
      {/* Billboard posts */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1/4 h-16 bg-gray-700 flex justify-center items-center">
        <div className="w-1/2 h-full bg-gray-800"></div>
      </div>
    </div>
  );
}