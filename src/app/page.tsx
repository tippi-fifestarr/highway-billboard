'use client';

import React from 'react';
import FeaturedBillboard from '@/components/billboard/FeaturedBillboard';
import WalletConnector from '@/components/wallet/WalletConnector';
import TestHighwayStyling from '@/components/TestHighwayStyling';
import { COLORS } from '@/utils/constants';

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: COLORS.highwayLineYellow }}>
        Welcome to the Highway Billboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Featured Billboard */}
        <div className="lg:col-span-2">
          <FeaturedBillboard />
          
          <div className="mt-8 flex justify-center">
            <a 
              href="/drive-by"
              className="px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
              style={{ 
                backgroundColor: COLORS.highwaySignBlue,
                color: COLORS.highwaySignWhite
              }}
            >
              🚗 KEEP DRIVING
            </a>
          </div>
        </div>
        
        {/* Sidebar - Wallet Connector */}
        <div>
          <WalletConnector />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.highwaySignGreen }}>
              Highway Guide
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">🔑</span>
                <span>Connect your wallet to start your journey</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⛽</span>
                <span>Check your APT balance in the fuel gauge</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👁️</span>
                <span>View the featured billboard on the main page</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🚗</span>
                <span>Drive by to see all messages on the highway</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📝</span>
                <span>Post your own message at the gas station</span>
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
      
      {/* Test component to verify highway styling */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Highway Styling Test</h2>
        <TestHighwayStyling />
      </div>
    </div>
  );
}