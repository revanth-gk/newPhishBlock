'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  description?: string;
  evidence?: string;
}

const mockReport: Report = {
  id: 1,
  reporter: '0x1234567890123456789012345678901234567890',
  reportType: 'URL',
  target: 'https://fake-binance.com',
  ipfsHash: 'QmHash1234567890abcdef1234567890',
  timestamp: Date.now() - 86400000, // 1 day ago
  status: 'VALIDATED',
  votesFor: 5,
  votesAgainst: 1,
  description: 'This website mimics the Binance interface to steal user credentials. It asks for seed phrases and private keys.',
  evidence: 'Screenshot of the fake login page, transaction history showing funds being drained',
};

export function ReportDetails({ reportId }: { reportId: number }) {
  const router = useRouter();
  const [report] = useState<Report>(mockReport);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to reports
        </button>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 break-all">{report.target}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>Report ID: {report.id}</span>
          <span>•</span>
          <span>Reported by {report.reporter.slice(0, 6)}...{report.reporter.slice(-4)}</span>
          <span>•</span>
          <span>{new Date(report.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Report Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {report.reportType}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Target</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all flex items-center">
                {report.target}
                <button
                  onClick={() => handleCopy(report.target)}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Voting Results</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-green-700">Valid Votes</span>
                <span className="text-sm font-medium text-gray-700">{report.votesFor}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(report.votesFor / (report.votesFor + report.votesAgainst)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-700">Invalid Votes</span>
                <span className="text-sm font-medium text-gray-700">{report.votesAgainst}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(report.votesAgainst / (report.votesFor + report.votesAgainst)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700">{report.description}</p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Evidence</h3>
        <p className="text-gray-700">{report.evidence}</p>
      </div>

      {copied && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:items-start sm:justify-end">
          <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">Copied to clipboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}