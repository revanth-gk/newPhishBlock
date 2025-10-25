import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { rateLimit, sanitizeInput } from '@/lib/security';

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

    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`check-${ip}`, 30)) {
      return NextResponse.json(
        { message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Sanitize input
    const sanitizedTarget = sanitizeInput(target);

    const reports = await DatabaseService.checkTarget(sanitizedTarget);
    
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