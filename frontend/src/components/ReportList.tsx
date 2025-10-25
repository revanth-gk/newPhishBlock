'use client';

import { useState } from 'react';

interface Report {
  id: number;
  reporter: string;
  reportType: string;
  target: string;
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
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'VALIDATED',
    votesFor: 5,
    votesAgainst: 1,
  },
  {
    id: 2,
    reporter: '0x5678...9012',
    reportType: 'WALLET',
    target: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: Date.now() - 172800000, // 2 days ago
    status: 'REJECTED',
    votesFor: 2,
    votesAgainst: 4,
  },
  {
    id: 3,
    reporter: '0x9012...3456',
    reportType: 'URL',
    target: 'https://phishing-metamask.com',
    timestamp: Date.now() - 259200000, // 3 days ago
    status: 'VALIDATED',
    votesFor: 7,
    votesAgainst: 0,
  },
];

export function ReportList() {
  const [filter, setFilter] = useState<'all' | 'validated' | 'pending' | 'rejected'>('all');
  const [reports] = useState<Report[]>(mockReports);

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDATED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
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
            onClick={() => setFilter('validated')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'validated'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Validated
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No reports match the current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.reportType}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-medium text-gray-900 break-all">
                    {report.target}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Reported by {report.reporter} • {Math.floor((Date.now() - report.timestamp) / 86400000)} days ago
                  </p>
                </div>
                <div className="flex items-center ml-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700">{report.votesFor}</span>
                  </div>
                  <div className="flex items-center ml-3">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0119.264 15H15m0 0v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700">{report.votesAgainst}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}