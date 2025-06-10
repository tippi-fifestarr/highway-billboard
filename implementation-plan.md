# Highway Billboard dApp Implementation Plan

This document outlines the specific code changes needed to fix the highway styling issues in the Highway Billboard dApp.

## 1. Fix Dark Mode Override in globals.css

The current dark mode implementation is likely overriding our highway styling. Let's modify it to be class-based instead of using `prefers-color-scheme`.

```diff
// highway-billboard/src/app/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

- @media (prefers-color-scheme: dark) {
-   :root {
-     --foreground-rgb: 255, 255, 255;
-     --background-start-rgb: 0, 0, 0;
-     --background-end-rgb: 0, 0, 0;
-   }
- }

+ .dark-mode {
+   --foreground-rgb: 255, 255, 255;
+   --background-start-rgb: 0, 0, 0;
+   --background-end-rgb: 0, 0, 0;
+ }

- body {
-   color: rgb(var(--foreground-rgb));
-   background: linear-gradient(
-       to bottom,
-       transparent,
-       rgb(var(--background-end-rgb))
-     )
-     rgb(var(--background-start-rgb));
- }

+ body {
+   color: rgb(var(--foreground-rgb));
+ }
```

## 2. Update Tailwind Configuration

Ensure the tailwind.config.js file is properly configured for v4 and includes all necessary paths.

```diff
// highway-billboard/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
+   './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Highway theme colors
        'highway-asphalt': '#333333',
        'highway-line-yellow': '#FFCC00',
        'highway-line-white': '#FFFFFF',
        'highway-shoulder': '#A9A9A9',
        'highway-sign-blue': '#0066CC',
        'highway-sign-green': '#006633',
        'highway-sign-red': '#CC0000',
        'highway-sign-orange': '#FF6600',
        'highway-sign-brown': '#8B4513',
        'gas-gauge-empty': '#FF0000',
        'gas-gauge-half': '#FFCC00',
        'gas-gauge-full': '#00CC00',
      },
      backgroundImage: {
        'highway-lane': 'linear-gradient(to right, #FFCC00 50%, transparent 50%)',
        'highway-lane-vertical': 'linear-gradient(#FFCC00 50%, transparent 50%)',
      },
      fontFamily: {
        'highway': ['Highway Gothic', 'Arial Narrow', 'Arial', 'sans-serif'],
      },
    },
  },
+  safelist: [
+    'highway-road',
+    'highway-lane-divider',
+    'highway-sign',
+    'highway-sign-blue',
+    'highway-sign-green',
+    'highway-sign-red',
+    'highway-sign-orange',
+    'highway-sign-brown',
+    'billboard',
+    'billboard-post',
+    'gas-gauge',
+    'gas-gauge-fill',
+    'driving-animation',
+    'highway-font'
+  ],
  plugins: [],
}
```

## 3. Modify the Layout Component

Update the layout.tsx file to remove the dark background and ensure highway styling is applied.

```diff
// highway-billboard/src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { COLORS } from '@/utils/constants';
import WalletProvider from '@/components/wallet/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Highway Billboard',
  description: 'A highway-themed billboard dApp on Aptos blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
-     <body className={inter.className}>
+     <body className={`${inter.className} bg-white`}>
        <WalletProvider>
-         <div className="min-h-screen" style={{ backgroundColor: COLORS.highwayAsphalt }}>
+         <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.highwaySignBlue }}>
                    🛣️ Highway Billboard
                  </span>
                </div>
                <nav>
                  <ul className="flex space-x-4">
                    <li>
                      <a 
                        href="/" 
                        className="px-4 py-2 rounded-full font-bold"
                        style={{ 
                          backgroundColor: COLORS.highwaySignGreen,
                          color: COLORS.highwaySignWhite
                        }}
                      >
                        🏠 Home
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/drive-by" 
                        className="px-4 py-2 rounded-full font-bold"
                        style={{ 
                          backgroundColor: COLORS.highwaySignBlue,
                          color: COLORS.highwaySignWhite
                        }}
                      >
                        🚗 Drive-By
                      </a>
                    </li>
                    <li>
                      <a 
                        href="/post" 
                        className="px-4 py-2 rounded-full font-bold"
                        style={{ 
                          backgroundColor: COLORS.highwaySignOrange,
                          color: COLORS.highwaySignWhite
                        }}
                      >
                        ⛽ Post Message
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="bg-gray-800 text-white py-4">
              <div className="container mx-auto px-4 text-center">
                <p>🛣️ Highway Billboard dApp - Built on Aptos Blockchain</p>
              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
```

## 4. Create a Test Component

Create a simple test component to verify that highway styling is working correctly.

```tsx
// highway-billboard/src/components/TestHighwayStyling.tsx

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
```

## 5. Update the Home Page

Modify the home page to include the test component and ensure it's using the correct styling.

```diff
// highway-billboard/src/app/page.tsx

import FeaturedBillboard from '@/components/billboard/FeaturedBillboard';
+ import TestHighwayStyling from '@/components/TestHighwayStyling';

export default function Home() {
  return (
    <div className="space-y-8">
      <FeaturedBillboard />
+     
+     {/* Temporary test component to verify styling */}
+     <TestHighwayStyling />
    </div>
  );
}
```

## 6. Build Process Fixes

Clear the cache and rebuild the project:

```bash
# Navigate to the project directory
cd highway-billboard

# Remove the .next directory to clear the cache
rm -rf .next

# Reinstall dependencies
npm install

# Start the development server
npm run dev
```

## 7. Debugging Steps

If the above changes don't fix the issue, try these debugging steps:

1. Check the browser console for any CSS-related errors
2. Use browser dev tools to inspect the rendered HTML and applied CSS
3. Try adding `!important` to critical styles
4. Consider downgrading Tailwind to v3 if v4 issues persist
5. Test with a minimal HTML file using only inline styles

## 8. Fallback Plan

If Tailwind continues to cause issues, create a fallback CSS file with traditional CSS:

```css
/* highway-billboard/src/app/highway-styles.css */

/* Road elements */
.highway-road {
  background-color: #333333 !important;
}

.highway-lane-divider {
  background-color: #FFCC00 !important;
}

/* Sign elements */
.highway-sign {
  font-weight: bold !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.highway-sign-blue {
  background-color: #0066CC !important;
  color: white !important;
}

.highway-sign-green {
  background-color: #006633 !important;
  color: white !important;
}

.highway-sign-red {
  background-color: #CC0000 !important;
  color: white !important;
}

.highway-sign-orange {
  background-color: #FF6600 !important;
  color: white !important;
}

.highway-sign-brown {
  background-color: #8B4513 !important;
  color: white !important;
}

/* Billboard elements */
.billboard {
  background-color: white !important;
  border: 4px solid #333 !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1) !important;
  padding: 1.5rem !important;
}

.billboard-post {
  position: relative !important;
  background-color: #f9fafb !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

/* Gas station elements */
.gas-gauge {
  position: relative !important;
  width: 8rem !important;
  height: 4rem !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.gas-gauge-fill {
  height: 100% !important;
  transition: all 500ms ease-in-out !important;
}

/* Animation classes */
.driving-animation {
  transition: transform 500ms ease-in-out !important;
}

/* Highway font */
.highway-font {
  font-family: 'Highway Gothic', 'Arial Narrow', Arial, sans-serif !important;
}
```

Import this file in layout.tsx after globals.css:

```diff
// highway-billboard/src/app/layout.tsx

import './globals.css';
+ import './highway-styles.css';
```

## 9. Testing and Verification

After implementing these changes, verify that:

1. The highway graphics are displaying correctly
2. The dark mode is not overriding the highway styling
3. All components are rendering with the correct styles
4. The application is functioning as expected

## 10. Long-term Solutions

Once the immediate issues are fixed, consider these long-term solutions:

1. Refactor the CSS to use a more stable approach
2. Consider using CSS Modules or styled-components instead of Tailwind
3. Create a comprehensive design system for the highway theme
4. Add automated tests for visual regression

## 11. Fixing Wallet Functionality Error

The application is also experiencing a wallet-related error:

```
TypeError: t.startsWith is not a function
    at e.fromString (http://localhost:3000/_next/static/chunks/node_modules_%40aptos-labs_ts-sdk_dist_esm_83a9d561._.js:808:15)
    at getAccountAPTBalance (http://localhost:3000/_next/static/chunks/src_97e30dd4._.js:127:263)
    at useWallet.useEffect.fetchBalance (http://localhost:3000/_next/static/chunks/src_97e30dd4._.js:611:209)
    at useWallet.useEffect (http://localhost:3000/_next/static/chunks/src_97e30dd4._.js:628:13)
```

This error occurs when the wallet code is trying to use `startsWith()` on a value that is not a string. Let's fix this issue in the useWallet hook:

```diff
// highway-billboard/src/hooks/useWallet.ts

// Find the getAccountAPTBalance function and update it to handle non-string values
const getAccountAPTBalance = async (address: string): Promise<number> => {
  try {
    const client = new Aptos();
+   // Ensure address is a string before using startsWith
+   if (typeof address !== 'string') {
+     console.error('Invalid address format:', address);
+     return 0;
+   }
    
    // Rest of the function...
  } catch (error) {
    console.error('Error fetching APT balance:', error);
    return 0;
  }
};

// In the useWallet hook, update the fetchBalance function
const fetchBalance = async () => {
  if (account && account.address) {
+   // Ensure account.address is a string
+   const addressStr = typeof account.address === 'string'
+     ? account.address
+     : String(account.address);
    
-   const balance = await getAccountAPTBalance(account.address);
+   const balance = await getAccountAPTBalance(addressStr);
    setBalance(balance);
  }
};
```

This fix ensures that we're always passing a string to functions that expect a string, preventing the "startsWith is not a function" error.