import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from '@/providers/Web3Provider';
import { NavBar } from '@/components/NavBar';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhishBlock - Decentralized Phishing Detection',
  description: 'A community-driven platform for detecting and reporting phishing URLs and scam wallet addresses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Web3Provider>
            <div className="min-h-screen bg-white">
              <NavBar />
              <div className="py-10">
                <main>
                  {children}
                </main>
              </div>
            </div>
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  );
}