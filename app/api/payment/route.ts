import { NextRequest, NextResponse } from 'next/server';
import {
  getUserInfo,
  getCurrentCredit,
  updateUserCreditAmount,
  uploadTransactionInfo
} from '@/lib/payment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'getUserInfo':
        if (!userId) {
          return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }
        const user = await getUserInfo(userId);
        return NextResponse.json(user);
      case 'getCurrentCredit':
        if (!userId) {
          return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }
        const credit = await getCurrentCredit(userId);
        return NextResponse.json({ credit });
      default:
        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, newAmount, orderInfo } = body;
    switch (action) {
      case 'updateUserCreditAmount':
        if (!userId || typeof newAmount !== 'number') {
          return NextResponse.json({ error: 'userId and newAmount are required' }, { status: 400 });
        }
        await updateUserCreditAmount(userId, newAmount);
        return NextResponse.json({ success: true });
      case 'uploadTransactionInfo':
        if (!userId || !orderInfo) {
          return NextResponse.json({ error: 'userId and orderInfo are required' }, { status: 400 });
        }
        const result = await uploadTransactionInfo(userId, orderInfo);
        return NextResponse.json(result);
      default:
        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 