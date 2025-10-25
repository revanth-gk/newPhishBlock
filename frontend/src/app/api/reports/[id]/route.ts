import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would fetch the report from the database
    // For now, we'll return mock data
    const mockReport = {
      id: parseInt(id),
      reporter_address: '0x1234567890123456789012345678901234567890',
      report_type: 'URL',
      target: 'https://fake-site.com',
      ipfs_hash: 'QmHash1234567890',
      status: 'VALIDATED',
      votes_for: 5,
      votes_against: 1,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return NextResponse.json({ report: mockReport });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would update the report in the database
    // For now, we'll return mock data
    const mockReport = {
      id: parseInt(id),
      reporter_address: body.reporter_address,
      report_type: body.report_type,
      target: body.target,
      ipfs_hash: body.ipfs_hash,
      status: body.status || 'PENDING',
      votes_for: body.votes_for || 0,
      votes_against: body.votes_against || 0,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return NextResponse.json({ report: mockReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}