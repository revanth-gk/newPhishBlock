'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Report {
  id: number;
  reporter_address: string;
  report_type: string;
  target: string;
  ipfs_hash: string;
  status: string;
  votes_for: number;
  votes_against: number;
  created_at: string;
  updated_at: string;
}

export default function MyReportsPage() {
  const { address, isConnected } = useAccount();
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isConnected && address) {
          // Fetch reports from the API
          const response = await fetch(`/api/user/reports?address=${address}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch reports');
          }
          
          const data = await response.json();
          setUserReports(data.reports);
        } else {
          setUserReports([]);
        }
      } catch (error: any) {
        console.error('Error fetching user reports:', error);
        setError('Failed to load your reports. Please try again later.');
        setUserReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [address, isConnected]);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all reports you have submitted to the PhishBlock community
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your wallet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please connect your wallet to view your submitted reports.
          </p>
        </div>
      ) : loading ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading your reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we fetch your submitted reports.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      ) : userReports.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't submitted any reports yet. <a href="/submit" className="text-indigo-600 hover:text-indigo-500">Submit your first report</a>.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {userReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.report_type}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <h4 className="mt-2 text-lg font-medium text-gray-900 break-all">
                      {report.target}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted on {formatDate(report.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-700">{report.votes_for}</span>
                    </div>
                    <div className="flex items-center ml-3">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0119.264 15H15m0 0v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-700">{report.votes_against}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}