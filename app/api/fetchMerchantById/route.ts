import { NextRequest, NextResponse } from 'next/server';
import { fetchMerchantById, getRecommendedMerchants, sendConnectionRequest } from '@/lib/fetchMerchantById';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const merchantId = searchParams.get('merchantId');
    const limit = searchParams.get('limit');

    switch (action) {
      case 'fetchMerchantById':
        if (!merchantId) {
          return NextResponse.json({ error: 'merchantId is required' }, { status: 400 });
        }
        const merchant = await fetchMerchantById(merchantId);
        return NextResponse.json(merchant);
      case 'getRecommendedMerchants':
        const merchants = await getRecommendedMerchants(limit ? parseInt(limit) : 5);
        return NextResponse.json(merchants);
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
    const { action, merchantId, userId, userData } = body;
    switch (action) {
      case 'sendConnectionRequest':
        if (!merchantId || !userId || !userData) {
          return NextResponse.json({ error: 'merchantId, userId, and userData are required' }, { status: 400 });
        }
        const result = await sendConnectionRequest(merchantId, userId, userData);
        return NextResponse.json({ success: result });
      default:
        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 