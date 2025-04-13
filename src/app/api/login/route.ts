import { NextRequest, NextResponse } from 'next/server';

// Mock server-side API for login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Missing required field: address' },
        { status: 400 }
      );
    }
    
    // Simulate server processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, generate a mock identity
    const mockDID = `did:substrate:${address}`;
    const mockSBTs = [
      {
        id: `sbt:${Math.random().toString(36).substring(2, 15)}`,
        name: 'Digital Identity Verification',
        issuer: 'TrustID Foundation',
        issuedAt: new Date().toISOString(),
        description: 'A verifiable credential stored as a Soul-Bound Token',
      }
    ];
    
    return NextResponse.json({
      success: true,
      identity: {
        did: {
          id: mockDID,
          controller: address,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        },
        sbts: mockSBTs
      }
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 