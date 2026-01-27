/**
 * FIXED VERSION - FORCED REFRESH
 * This route handles fetching real-time stock prices.
 */
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE = 'https://finnhub.io/api/v1/quote';

const cache = new Map();
const CACHE_DURATION = 60 * 1000;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get('symbols');
    
    if (!symbolsParam) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
    }

    const sortedSymbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).sort();
    const cacheKey = sortedSymbols.join(',');
    
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      return NextResponse.json({ success: true, response: cachedData.data, source: 'cache' });
    }

    await connectDB();

    const customStocks = await Stock.find({ 
      symbol: { $in: sortedSymbols },
      isCustom: true 
    });

    const customPricesMap = {};
    customStocks.forEach(s => {
      customPricesMap[s.symbol] = s.price;
    });

    const priceRequests = sortedSymbols.map(async (symbol) => {
      if (customPricesMap[symbol] !== undefined) {
        return {
          symbol,
          price: customPricesMap[symbol],
          status: 'success',
          source: 'database'
        };
      }

      try {
        if (!FINNHUB_API_KEY) {
          return { symbol, price: 0, status: 'error', message: 'Finnhub key missing' };
        }
        const response = await fetch(`${FINNHUB_BASE}?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        if (!response.ok) {
           return { symbol, price: 0, status: 'error', message: `Finnhub error ${response.status}` };
        }
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
    
    cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
    });

    return NextResponse.json({ success: true, response: results });

  } catch (error) {
    console.error("Price API Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prices' }, { status: 500 });
  }
}
