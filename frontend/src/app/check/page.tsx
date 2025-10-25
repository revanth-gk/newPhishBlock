'use client';

import { QuickCheck } from '@/components/QuickCheck';

export default function CheckPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quick Check</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quickly verify if a URL or wallet address has been reported as malicious
        </p>
      </div>
      <QuickCheck />
    </div>
  );
}