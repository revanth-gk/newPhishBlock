'use client';

import { useState } from 'react';

export function QuickCheck() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ isMalicious: boolean; confidence: string } | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL or wallet address to check');
      return;
    }

    setIsChecking(true);
    setError('');
    setResult(null);

    try {
      // In a real implementation, you would call your API here
      // For now, we'll simulate the check with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different results based on the input
      const isMalicious = url.includes('fake') || url.includes('scam') || url.startsWith('0xabcdef');
      const confidence = isMalicious ? 'high' : 'none';
      
      setResult({ isMalicious, confidence });
    } catch (err) {
      console.error('Error checking URL:', err);
      setError('Failed to check the URL. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Check</h3>
      <p className="text-sm text-gray-500 mb-6">
        Enter a URL or wallet address to quickly check if it's been reported as malicious.
      </p>
      
      <form onSubmit={handleCheck} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or wallet address..."
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={isChecking}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </>
            ) : (
              'Check'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={`rounded-md p-4 ${result.isMalicious ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.isMalicious ? (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${result.isMalicious ? 'text-red-800' : 'text-green-800'}`}>
                {result.isMalicious ? 'Malicious Detected' : 'No Threats Found'}
              </h3>
              <div className={`mt-2 text-sm ${result.isMalicious ? 'text-red-700' : 'text-green-700'}`}>
                <p>
                  {result.isMalicious
                    ? `This ${url.startsWith('0x') ? 'wallet address' : 'URL'} has been reported as malicious with ${result.confidence} confidence.`
                    : `This ${url.startsWith('0x') ? 'wallet address' : 'URL'} has not been reported as malicious.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How it works</h4>
        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
          <li>Checks against our database of community-verified reports</li>
          <li>Uses blockchain-based consensus for validation</li>
          <li>Results are updated in real-time as new reports are validated</li>
        </ul>
      </div>
    </div>
  );
}