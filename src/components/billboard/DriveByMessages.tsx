import React from 'react';
import { useMessages } from '@/hooks/useMessages';
import { UIMessage } from '@/types';
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
const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * MessageCard component displays a single message in the drive-by view
 */
interface MessageCardProps {
  message: UIMessage;
  index: number;
}

function MessageCard({ message, index }: MessageCardProps) {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md border-l-8 mb-8 transform transition-all duration-300 hover:scale-[1.02]" 
      style={{ borderLeftColor: COLORS.highwayLineYellow }}>
      {/* Mile marker */}
      <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>
      
      <h3 className="text-xl font-bold mb-2">📍 Mile {index + 1}: "{message.content}"</h3>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>👤 {formatAddress(message.author)}</span>
        <span>{formatTimestamp(message.timestamp)}</span>
      </div>
    </div>
  );
}

/**
 * DriveByMessages component displays all messages in a scrollable list
 */
export default function DriveByMessages() {
  const { data: messages, loading, error } = useMessages();

  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.highwaySignGreen }}>
          🚗 Cruising Down The Highway
        </h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-white rounded-lg shadow-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.highwaySignRed }}>
          ⚠️ Highway Closed
        </h2>
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.highwaySignGreen }}>
          🚗 Cruising Down The Highway
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg">No billboards on this highway yet. Be the first to post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.highwaySignGreen }}>
        🚗 Cruising Down The Highway
      </h2>
      
      {/* Highway background with dashed line */}
      <div className="relative">
        {/* Dashed line down the middle */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 z-0" 
          style={{ 
            backgroundImage: `linear-gradient(${COLORS.highwayLineYellow} 50%, transparent 50%)`,
            backgroundSize: '10px 20px'
          }}>
        </div>
        
        {/* Messages */}
        <div className="relative z-10 space-y-8 py-4">
          {messages.map((message, index) => (
            <MessageCard key={index} message={message} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}