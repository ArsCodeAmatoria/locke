import { NextRequest, NextResponse } from 'next/server';

// Mock server-side API for ZK proof generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { did, sbtIds } = body;
    
    if (!did) {
      return NextResponse.json(
        { error: 'Missing required field: did' },
        { status: 400 }
      );
    }
    
    // Simulate server processing time for proof generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock proof (in a real app, this would be done by the WASM module)
    const mockProof = Array.from({ length: 5 }, () => Math.random().toString(36).substring(2, 15)).join('');
    
    return NextResponse.json({
      success: true,
      proof: {
        proof: mockProof,
        publicSignals: [
          did,
          ...(sbtIds || [])
        ],
        challenge: Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Prove API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 