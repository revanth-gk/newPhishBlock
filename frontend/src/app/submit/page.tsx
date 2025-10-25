'use client';

import { ReportForm } from '@/components/ReportForm';

export default function SubmitPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit New Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Help protect the Web3 community by reporting phishing URLs and scam wallet addresses
        </p>
      </div>
      <ReportForm />
    </div>
  );
}