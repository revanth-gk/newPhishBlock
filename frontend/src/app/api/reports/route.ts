import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { rateLimit, sanitizeInput, validateReportType, validateEthereumAddress, validateURL, validateIPFSHash } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`reports-get-${ip}`, 20)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    let reports;
    if (status) {
      // Sanitize status parameter
      const sanitizedStatus = sanitizeInput(status);
      reports = await DatabaseService.getReportsByStatus(sanitizedStatus);
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
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`reports-post-${ip}`, 5)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.reporter_address || !body.report_type || !body.target || !body.ipfs_hash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const reporterAddress = sanitizeInput(body.reporter_address);
    const reportType = sanitizeInput(body.report_type);
    const target = sanitizeInput(body.target);
    const ipfsHash = sanitizeInput(body.ipfs_hash);
    
    // Validate inputs
    if (!validateEthereumAddress(reporterAddress)) {
      return NextResponse.json(
        { error: 'Invalid reporter address' },
        { status: 400 }
      );
    }
    
    if (!validateReportType(reportType)) {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }
    
    if (reportType === 'URL' && !validateURL(target)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    if (reportType === 'WALLET' && !validateEthereumAddress(target)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }
    
    if (!validateIPFSHash(ipfsHash)) {
      return NextResponse.json(
        { error: 'Invalid IPFS hash format' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would validate the request
    // and check authentication/authorization
    
    // For now, we'll just return a mock response
    const mockReport = {
      id: Date.now(),
      reporter_address: reporterAddress,
      report_type: reportType,
      target: target,
      ipfs_hash: ipfsHash,
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