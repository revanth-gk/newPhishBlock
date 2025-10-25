import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET() {
  try {
    // Fetch all the statistics needed for the dashboard
    const validatedReports = await DatabaseService.getValidatedReportCount();
    const pendingReports = await DatabaseService.getPendingReportCount();
    const communityValidators = await DatabaseService.getValidatorCount();
    
    // Calculate blocked attempts (validated reports * some factor)
    const blockedAttempts = validatedReports * 5;
    
    const stats = {
      validatedReports,
      pendingReports,
      communityValidators,
      blockedAttempts,
    };
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}