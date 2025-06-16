import { NextRequest, NextResponse } from 'next/server';
import { 
  gasStationClient, 
  aptos, 
  checkRateLimit, 
  validateMessageContent
} from '@/services/gasStation';
import { CONTRACT_ADDRESS, MODULE_NAME } from '@/utils/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, userAddress } = body;

    console.log('API Request received:', {
      content: content?.substring(0, 50),
      userAddress: userAddress?.substring(0, 10) + '...'
    });

    // 1. Basic validation
    if (!content || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: content, userAddress' },
        { status: 400 }
      );
    }

    // 2. Rate limiting check
    const rateLimitResult = checkRateLimit(userAddress);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime;
      const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
      
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Try again in ${waitTime} seconds.`,
          retryAfter: waitTime 
        },
        { status: 429 }
      );
    }

    // 3. Content validation
    const contentValidation = validateMessageContent(content);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      );
    }

    // 4. Build the transaction (following README pattern exactly)
    const transaction = await aptos.transaction.build.simple({
      sender: userAddress,
      withFeePayer: true, // Critical for gas station
      data: {
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_message`,
        functionArguments: [CONTRACT_ADDRESS, content],
      },
    });

    console.log('Built transaction for gas station submission');

    // 5. Return transaction for client-side signing
    // We can't sign server-side without the private key, so we return the transaction
    // for the client to sign and then submit back to us
    return NextResponse.json({
      success: true,
      transaction: transaction,
      message: 'Transaction built successfully. Please sign and submit.'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit messages.' },
    { status: 405 }
  );
}