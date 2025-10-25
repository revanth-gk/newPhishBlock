'use client';

import { ReportList } from '@/components/ReportList';

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse all community-submitted reports
        </p>
      </div>
      <ReportList />
    </div>
  );
}