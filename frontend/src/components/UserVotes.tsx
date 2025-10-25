'use client';

import { useState } from 'react';

interface Vote {
  id: number;
  reportId: number;
  target: string;
  reportType: string;
  votedAt: number;
  vote: 'valid' | 'invalid';
}

const mockVotes: Vote[] = [
  {
    id: 1,
    reportId: 101,
    target: 'https://fake-binance.com',
    reportType: 'URL',
    votedAt: Date.now() - 86400000, // 1 day ago
    vote: 'valid',
  },
  {
    id: 2,
    reportId: 102,
    target: '0xabcdef1234567890abcdef1234567890abcdef12',
    reportType: 'WALLET',
    votedAt: Date.now() - 172800000, // 2 days ago
    vote: 'invalid',
  },
  {
    id: 3,
    reportId: 103,
    target: 'https://phishing-metamask.com',
    reportType: 'URL',
    votedAt: Date.now() - 259200000, // 3 days ago
    vote: 'valid',
  },
];

export function UserVotes() {
  const [votes] = useState<Vote[]>(mockVotes);
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');

  const filteredVotes = votes.filter(vote => {
    if (filter === 'all') return true;
    return vote.vote === filter;
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Your Votes</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'valid'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Valid
          </button>
          <button
            onClick={() => setFilter('invalid')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'invalid'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Invalid
          </button>
        </div>
      </div>

      {filteredVotes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No votes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't voted on any reports yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVotes.map((vote) => (
            <div key={vote.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vote.reportType}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vote.vote === 'valid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vote.vote}
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-medium text-gray-900 break-all">
                    {vote.target}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Voted {Math.floor((Date.now() - vote.votedAt) / 86400000)} days ago
                  </p>
                </div>
                <div className="ml-4">
                  <span className="text-sm text-gray-500">Report #{vote.reportId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}