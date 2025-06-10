'use client';

import React from 'react';
import DriveByMessages from '@/components/billboard/DriveByMessages';
import { COLORS } from '@/utils/constants';

export default function DriveBySPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: COLORS.highwayLineYellow }}>
        Drive-By Messages
      </h1>
      
      <DriveByMessages />
      
      <div className="flex justify-center space-x-4 mt-8">
        <a 
          href="/"
          className="px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
          style={{ 
            backgroundColor: COLORS.highwaySignGreen,
            color: COLORS.highwaySignWhite
          }}
        >
          🏠 BACK TO MAIN
        </a>
        
        <a 
          href="/post"
          className="px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
          style={{ 
            backgroundColor: COLORS.highwaySignOrange,
            color: COLORS.highwaySignWhite
          }}
        >
          ⛽ GAS STATION
        </a>
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