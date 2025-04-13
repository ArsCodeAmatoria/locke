import { NextRequest, NextResponse } from 'next/server';

// Mock server-side API for ZK proof verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proof, publicSignals } = body;
    
    if (!proof || !publicSignals) {
      return NextResponse.json(
        { error: 'Missing required fields: proof, publicSignals' },
        { status: 400 }
      );
    }
    
    // Simulate server processing time for verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, randomly succeed or fail (90% success rate)
    const isSuccess = Math.random() < 0.9;
    
    return NextResponse.json({
      success: true,
      verified: isSuccess,
      timestamp: new Date().toISOString(),
      // Additional verification details that would be present in a real system
      details: isSuccess 
        ? {
            verifier: 'Substrate ZKP Verifier',
            challenge: publicSignals[0].substring(0, 8) + '...',
            expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
          }
        : {
            error: 'Proof verification failed',
            reason: 'Invalid proof structure',
          }
    });
    
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 