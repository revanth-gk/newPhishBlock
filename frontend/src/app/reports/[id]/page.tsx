'use client';

import { ReportDetails } from '@/components/ReportDetails';

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const reportId = parseInt(params.id, 10);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <ReportDetails reportId={reportId} />
    </div>
  );
}