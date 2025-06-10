import React from 'react';
import { COLORS } from '@/utils/constants';

interface GasGaugeProps {
  percentage: number;
  balance: number;
}

/**
 * GasGauge component displays the user's APT balance as a fuel gauge
 */
export default function GasGauge({ percentage, balance }: GasGaugeProps) {
  // Determine the color based on the percentage
  const getGaugeColor = () => {
    if (percentage < 25) return COLORS.gasGaugeEmpty;
    if (percentage < 75) return COLORS.gasGaugeHalf;
    return COLORS.gasGaugeFull;
  };

  return (
    <div className="relative w-32 h-16 flex flex-col items-center">
      <div className="text-sm font-bold mb-1">⛽ Fuel Gauge</div>
      
      {/* Gauge background */}
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-400">
        {/* Gauge fill */}
        <div 
          className="h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getGaugeColor()
          }}
        />
      </div>
      
      {/* Gauge labels */}
      <div className="w-full flex justify-between text-xs mt-1">
        <span>E</span>
        <span>{balance.toFixed(2)} APT</span>
        <span>F</span>
      </div>
    </div>
  );
}