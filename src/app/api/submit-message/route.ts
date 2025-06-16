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
    const { content, userAddress, transaction, senderAuth } = body;

    // Debug logging
    console.log('API Request received:', {
      content: content?.substring(0, 50),
      userAddress: userAddress?.substring(0, 10) + '...',
      hasTransaction: !!transaction,
      hasSenderAuth: !!senderAuth,
    });

    // 1. Basic validation - if no transaction, we're building it; if transaction exists, we're submitting it
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

    // 4. Check if this is a transaction build request or submission request
    if (!transaction || !senderAuth) {
      // Build transaction for client to sign
      console.log('Building transaction server-side for client signing');
      
      const builtTransaction = await aptos.transaction.build.simple({
        sender: userAddress,
        withFeePayer: true, // Critical for gas station
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_message`,
          functionArguments: [CONTRACT_ADDRESS, content],
        },
      });
      
      console.log('Built transaction for client signing:', {
        hasTransaction: !!builtTransaction,
        transactionKeys: Object.keys(builtTransaction)
      });

      // Return transaction for client to sign
      return NextResponse.json({
        success: true,
        transaction: builtTransaction,
        message: 'Transaction built successfully. Please sign and resubmit.'
      });
    }

    // 5. Submit signed transaction to gas station
    console.log('Submitting signed transaction to gas station:', {
      sender: userAddress,
      contentLength: content.length
    });

    const response = await gasStationClient.simpleSignAndSubmitTransaction(
      transaction,
      senderAuth
    );

    // 7. Handle gas station response
    if (response.error !== undefined || response.data === undefined) {
      console.error('Gas station error:', response.error);
      return NextResponse.json(
        { error: `Gas station error: ${response.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // 8. Wait for transaction confirmation
    try {
      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: response.data.transactionHash,
        options: { 
          checkSuccess: true,
          timeoutSecs: 30
        },
      });

      console.log('Transaction executed successfully:', {
        hash: executedTransaction.hash,
        sender: userAddress,
        gasUsed: executedTransaction.gas_used
      });

      return NextResponse.json({
        success: true,
        transactionHash: response.data.transactionHash,
        message: 'Message posted successfully with sponsored gas!'
      });

    } catch (confirmationError) {
      // Transaction was submitted but confirmation failed
      console.warn('Transaction submitted but confirmation failed:', confirmationError);
      return NextResponse.json({
        success: true,
        transactionHash: response.data.transactionHash,
        message: 'Message submitted successfully (confirmation pending)',
        warning: 'Transaction confirmation timed out but may still succeed'
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Network error. Please check your connection and try again.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('gas')) {
        return NextResponse.json(
          { error: 'Gas station service unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

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

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit messages.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit messages.' },
    { status: 405 }
  );
}