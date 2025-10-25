import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let reports;
    if (status) {
      reports = await DatabaseService.getReportsByStatus(status);
    } else {
      reports = await DatabaseService.getAllReports();
    }
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real implementation, you would validate the request
    // and check authentication/authorization
    
    // For now, we'll just return a mock response
    const mockReport = {
      id: Date.now(),
      reporter_address: body.reporter_address,
      report_type: body.report_type,
      target: body.target,
      ipfs_hash: body.ipfs_hash,
      status: 'PENDING',
      votes_for: 0,
      votes_against: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return NextResponse.json({ report: mockReport });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}