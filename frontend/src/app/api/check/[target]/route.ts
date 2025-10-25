import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ target: string }> }
) {
  try {
    const { target } = await params;
    
    if (!target) {
      return NextResponse.json(
        { message: 'Target parameter is required' },
        { status: 400 }
      );
    }

    const reports = await DatabaseService.checkTarget(target);
    
    return NextResponse.json({
      isMalicious: reports.length > 0,
      reports: reports,
      confidence: reports.length > 0 ? 'high' : 'none',
    });
  } catch (error) {
    console.error('Error checking target:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}