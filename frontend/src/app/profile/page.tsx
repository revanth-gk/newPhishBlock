'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { UserVotes } from '@/components/UserVotes';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('votes');

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          <p className="text-lg text-gray-600 mb-4">
            Please connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your activity and contributions to the PhishBlock community
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">Your Wallet</h2>
            <p className="text-sm text-gray-500">{address}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('votes')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'votes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Your Votes
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'votes' && <UserVotes />}
        
        {activeTab === 'stats' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Contribution Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600">24</div>
                <div className="mt-1 text-sm text-gray-500">Reports Submitted</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">89</div>
                <div className="mt-1 text-sm text-gray-500">Votes Cast</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <div className="mt-1 text-sm text-gray-500">Accuracy Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}