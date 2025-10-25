'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
// Web3Storage is deprecated, using a mock implementation instead

interface ReportFormData {
  reportType: 'URL' | 'WALLET';
  target: string;
  description: string;
  evidence: string;
}

export function ReportForm() {
  const [formData, setFormData] = useState<ReportFormData>({
    reportType: 'URL',
    target: '',
    description: '',
    evidence: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { address } = useAccount();

  // Validation functions
  const validateURL = (url: string): boolean => {
    try {
      // Check if it starts with http or https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }
      
      // Basic URL validation
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateWalletAddress = (address: string): boolean => {
    // Check if it's a valid Ethereum address format
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    return walletRegex.test(address);
  };

  const validateIPFSHash = (hash: string): boolean => {
    // Basic IPFS hash validation (CIDv0)
    const ipfsRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    return ipfsRegex.test(hash);
  };

  const uploadToIPFS = async (data: any) => {
    // In a real implementation, you would use a real Web3.Storage token
    // For now, we'll simulate the upload
    console.log('Uploading to IPFS:', data);
    return 'QmHash123'; // Simulated IPFS hash
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setSubmitError('Please connect your wallet');
      return;
    }

    // Client-side validation
    if (formData.reportType === 'URL' && !validateURL(formData.target)) {
      setSubmitError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    if (formData.reportType === 'WALLET' && !validateWalletAddress(formData.target)) {
      setSubmitError('Please enter a valid Ethereum wallet address');
      return;
    }

    if (formData.description.trim().length < 10) {
      setSubmitError('Description must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Upload detailed report to IPFS
      const reportData = {
        reportType: formData.reportType,
        target: formData.target,
        description: formData.description,
        evidence: formData.evidence,
        reporter: address,
        timestamp: Date.now(),
      };
      
      const ipfsHash = await uploadToIPFS(reportData);
      
      // Validate IPFS hash
      if (!validateIPFSHash(ipfsHash)) {
        throw new Error('Invalid IPFS hash generated');
      }
      
      console.log('Report submitted with IPFS hash:', ipfsHash);
      
      // In a real implementation, you would call the smart contract here
      // For now, we'll just simulate the submission
      console.log('Submitting report to smart contract with args:', [
        formData.reportType,
        formData.target,
        ipfsHash,
      ]);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        reportType: 'URL',
        target: '',
        description: '',
        evidence: '',
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      {submitSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Report submitted successfully! It will be reviewed by the community validators.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            name="reportType"
            value={formData.reportType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="URL">Phishing URL</option>
            <option value="WALLET">Scam Wallet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.reportType === 'URL' ? 'Malicious URL' : 'Scam Wallet Address'}
          </label>
          <input
            type="text"
            name="target"
            value={formData.target}
            onChange={handleChange}
            placeholder={formData.reportType === 'URL' ? 'https://...' : '0x...'}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          {formData.reportType === 'URL' && formData.target && !validateURL(formData.target) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid URL starting with http:// or https://</p>
          )}
          {formData.reportType === 'WALLET' && formData.target && !validateWalletAddress(formData.target) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid Ethereum wallet address (0x...)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the phishing attempt or scam..."
            required
          />
          {formData.description && formData.description.trim().length < 10 && (
            <p className="mt-1 text-sm text-red-600">Description must be at least 10 characters long</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Evidence (optional)
          </label>
          <textarea
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any additional evidence or proof (screenshots, transaction IDs, etc.)..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}