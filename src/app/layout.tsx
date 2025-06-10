import './globals.css';
import './highway-styles.css';
import './layout-fix.css';
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
      <body className={`${inter.className} bg-white`}>
        <WalletProvider>
          <div className="min-h-screen bg-gray-100">
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