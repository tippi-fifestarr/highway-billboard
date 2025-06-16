'use client';

import React from 'react';
import PostMessageForm from '@/components/billboard/PostMessageForm';
import WalletConnector from '@/components/wallet/WalletConnector';
import { COLORS } from '@/utils/constants';

export default function PostPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: COLORS.highwayLineYellow }}>
        Post Your Billboard Message
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Post Message Form */}
        <div className="lg:col-span-2">
          <PostMessageForm />
          
          <div className="mt-8 flex justify-center">
            <a 
              href="/"
              className="px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105 mr-4"
              style={{ 
                backgroundColor: COLORS.highwaySignGreen,
                color: COLORS.highwaySignWhite
              }}
            >
              🏠 BACK TO MAIN
            </a>
            
            <a 
              href="/drive-by"
              className="px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
              style={{ 
                backgroundColor: COLORS.highwaySignBlue,
                color: COLORS.highwaySignWhite
              }}
            >
              🚗 VIEW HIGHWAY
            </a>
          </div>
        </div>
        
        {/* Sidebar - Wallet Connector and Info */}
        <div>
          <WalletConnector />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.highwaySignOrange }}>
              Gas Station Guide
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">🔑</span>
                <span>Connect your wallet to post messages</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📝</span>
                <span>Write your message (max 100 characters)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💡</span>
                <span>In Phase 2, pay more APT to feature your message longer!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Road graphics at the bottom */}
      <div className="relative h-16 mt-12">
        <div className="absolute inset-0 bg-gray-800"></div>
        <div className="absolute inset-x-0 top-1/2 h-2 transform -translate-y-1/2" 
          style={{ 
            backgroundImage: `linear-gradient(to right, ${COLORS.highwayLineYellow} 50%, transparent 50%)`,
            backgroundSize: '20px 2px',
            backgroundRepeat: 'repeat-x'
          }}>
        </div>
      </div>
    </div>
  );
}