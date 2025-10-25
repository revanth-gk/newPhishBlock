'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface Report {
  id: number;
  reporter: string;
  reportType: string;
  target: string;
  ipfsHash: string;
  timestamp: number;
  status: string;
  votesFor: number;
  votesAgainst: number;
}

const mockReports: Report[] = [
  {
    id: 1,
    reporter: '0x1234...5678',
    reportType: 'URL',
    target: 'https://fake-binance.com',
    ipfsHash: 'QmHash123',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'PENDING',
    votesFor: 2,
    votesAgainst: 1,
  },
  {
    id: 2,
    reporter: '0x5678...9012',
    reportType: 'WALLET',
    target: '0xabcdef1234567890abcdef1234567890abcdef12',
    ipfsHash: 'QmHash456',
    timestamp: Date.now() - 172800000, // 2 days ago
    status: 'PENDING',
    votesFor: 1,
    votesAgainst: 0,
  },
];

export function VotingInterface() {
  const { address, isConnected } = useAccount();
  const [reports] = useState<Report[]>(mockReports);
  const [votedReports, setVotedReports] = useState<Set<number>>(new Set());
  const [votingReport, setVotingReport] = useState<number | null>(null);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState('');

  const handleVote = async (reportId: number, support: boolean) => {
    if (!isConnected) {
      setVoteError('Please connect your wallet to vote');
      return;
    }

    setVotingReport(reportId);
    setVoteError('');
    setVoteSuccess(false);

    try {
      // In a real implementation, you would call the smart contract here
      // For now, we'll just simulate the voting
      console.log(`Voting ${support ? 'for' : 'against'} report ${reportId}`);
      
      // Update local state to reflect the vote
      setVotedReports(prev => new Set(prev).add(reportId));
      setVoteSuccess(true);
    } catch (error) {
      console.error('Error voting:', error);
      setVoteError('Failed to submit vote. Please try again.');
    } finally {
      setVotingReport(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {voteSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Vote submitted successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {voteError && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {voteError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Reports for Validation</h3>
      
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports to validate</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no pending reports that need validation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.reportType}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Reported by {report.reporter}
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-medium text-gray-900 break-all">
                    {report.target}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Submitted {Math.floor((Date.now() - report.timestamp) / 3600000)} hours ago
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {report.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700">{report.votesFor}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0119.264 15H15m0 0v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700">{report.votesAgainst}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVote(report.id, true)}
                    disabled={votedReports.has(report.id) || votingReport === report.id}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm ${
                      votedReports.has(report.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50'
                    }`}
                  >
                    {votingReport === report.id && votedReports.has(report.id) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Voting...
                      </>
                    ) : votedReports.has(report.id) ? (
                      'Voted ✓'
                    ) : (
                      'Valid'
                    )}
                  </button>
                  <button
                    onClick={() => handleVote(report.id, false)}
                    disabled={votedReports.has(report.id) || votingReport === report.id}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm ${
                      votedReports.has(report.id)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
                    }`}
                  >
                    {votedReports.has(report.id) ? (
                      'Voted ✗'
                    ) : (
                      'Invalid'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}