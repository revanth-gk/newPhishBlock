import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { rateLimit, sanitizeInput } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`user-reports-get-${ip}`, 20)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Get user address from query parameters
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address');
    
    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }
    
    // Sanitize user address
    const sanitizedAddress = sanitizeInput(userAddress);
    
    // Fetch reports for the user
    const reports = await DatabaseService.getReportsByUser(sanitizedAddress);
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user reports' },
      { status: 500 }
    );
  }
}