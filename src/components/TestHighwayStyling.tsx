import React from 'react';
import { COLORS } from '@/utils/constants';

export default function TestHighwayStyling() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Highway Styling Test</h2>
      
      <div className="space-y-6">
        {/* Test highway road */}
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Road Elements</h3>
          <div className="h-20 highway-road relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 highway-lane-divider"></div>
          </div>
        </div>
        
        {/* Test highway signs */}
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Sign Elements</h3>
          <div className="flex space-x-4">
            <div className="highway-sign highway-sign-blue p-2">Blue Sign</div>
            <div className="highway-sign highway-sign-green p-2">Green Sign</div>
            <div className="highway-sign highway-sign-red p-2">Red Sign</div>
            <div className="highway-sign highway-sign-orange p-2">Orange Sign</div>
            <div className="highway-sign highway-sign-brown p-2">Brown Sign</div>
          </div>
        </div>
        
        {/* Test billboard */}
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Billboard Elements</h3>
          <div className="billboard">
            <p>This is a billboard</p>
          </div>
          <div className="mt-4 billboard-post">
            <p>This is a billboard post</p>
          </div>
        </div>
        
        {/* Test gas station */}
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Gas Station Elements</h3>
          <div className="gas-gauge">
            <div className="gas-gauge-fill bg-green-500 w-full"></div>
          </div>
        </div>
        
        {/* Test with inline styles */}
        <div className="p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Inline Styles Test</h3>
          <div style={{ 
            backgroundColor: COLORS.highwayAsphalt,
            height: '50px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: COLORS.highwayLineYellow
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}