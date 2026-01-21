import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE = 'https://finnhub.io/api/v1/quote';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
    }

    await connectDB();
    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());

    // 1. Identify which of these are custom stocks in our DB
    const customStocks = await Stock.find({ 
      symbol: { $in: symbols },
      isCustom: true 
    });

    const customPricesMap = {};
    customStocks.forEach(s => {
      customPricesMap[s.symbol] = s.price;
    });

    // 2. Fetch prices in parallel
    // If it's a custom stock, use DB price. Otherwise, use Finnhub.
    const priceRequests = symbols.map(async (symbol) => {
      // Check if we have it in our DB as custom
      if (customPricesMap[symbol] !== undefined) {
        return {
          symbol,
          price: customPricesMap[symbol],
          status: 'success',
          source: 'database'
        };
      }

      // Otherwise, hit Finnhub
      try {
        if (!FINNHUB_API_KEY) {
          return { symbol, price: 0, status: 'error', message: 'Finnhub key missing' };
        }
        const response = await fetch(`${FINNHUB_BASE}?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        
        return {
          symbol,
          price: data.c || 0,
          status: 'success',
          source: 'finnhub'
        };
      } catch (err) {
        return { symbol, price: 0, status: 'error' };
      }
    });

    const results = await Promise.all(priceRequests);
    
    return NextResponse.json({ success: true, response: results });

  } catch (error) {
    console.error("Price API Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prices' }, { status: 500 });
  }
}
