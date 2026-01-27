import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';

const API_KEY = process.env.NEXT_PUBLIC_FCS_API_KEY;
const BASE_URL = 'https://fcsapi.com/api-v3/stock/latest';

const POPULAR_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "LLY", "V", "UNH",
  "JNJ", "WMT", "JPM", "XOM", "MA", "PG", "AVGO", "HD", "CVX", "MRK",
  "ABBV", "PEP", "KO", "COST", "ADBE", "CSCO", "MCD", "TMO", "CRM", "PFE"
];

// Simple In-Memory Cache for Server Instance
const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolParam = searchParams.get('symbol');
    const requestedSymbols = symbolParam?.split(',').map(s => s.trim().toUpperCase()) || [];

    // Use sorted symbols as cache key
    const cacheKey = requestedSymbols.length > 0 
        ? [...new Set(requestedSymbols)].sort().join(',') 
        : 'POPULAR_SYMBOLS';
    
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      return NextResponse.json(cachedData.data);
    }

    await connectDB();

    // 1. Fetch custom stocks from Database
    let customStocks;
    if (requestedSymbols.length > 0) {
        customStocks = await Stock.find({ 
            isCustom: true, 
            symbol: { $in: requestedSymbols } 
        });
    } else {
        customStocks = await Stock.find({ isCustom: true });
    }

    const mappedCustom = customStocks.map(stock => ({
        id: stock._id,
        name: stock.name,
        symbol: stock.symbol,
        price: stock.price.toString(),
        change: stock.change,
        changeValue: stock.changeValue,
        isNegative: stock.isNegative,
        description: stock.description,
        isCustom: true
    }));

    // 2. Determine which symbols to fetch from external API
    let symbolsToFetch;
    if (requestedSymbols.length > 0) {
        const foundCustomSymbols = mappedCustom.map(s => s.symbol);
        symbolsToFetch = requestedSymbols.filter(s => !foundCustomSymbols.includes(s));
    } else {
        symbolsToFetch = POPULAR_SYMBOLS;
    }

    if (!API_KEY || symbolsToFetch.length === 0) {
      return NextResponse.json(mappedCustom);
    }

    // Limit to first 100 unique symbols (though now we only use 10 by default)
    const symbolsToFetchLimited = [...new Set(symbolsToFetch)].slice(0, 100);

    const chunks = [];
    const chunkSize = 50; // Increased to 50 to send all 30 symbols in 1 request
    for (let i = 0; i < symbolsToFetchLimited.length; i += chunkSize) {
      chunks.push(symbolsToFetchLimited.slice(i, i + chunkSize));
    }

    const allStocks = [];

    for (const chunk of chunks) {
      const symbolsString = chunk.join(',');
      const url = `${BASE_URL}?symbol=${symbolsString}&access_key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === true && Array.isArray(data.response)) {
        allStocks.push(...data.response);
      }
    }

    // Map external stocks
    const mappedExternal = allStocks.map(item => ({
      name: item.n || item.s,
      symbol: item.s,
      price: item.c,
      change: item.cp,
      changeValue: item.ch,
      isNegative: parseFloat(item.ch) < 0,
      isCustom: false
    }));

    const finalResult = [...mappedCustom, ...mappedExternal];

    // Store in Cache
    cache.set(cacheKey, {
        data: finalResult,
        timestamp: Date.now()
    });

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error("Stocks API Error:", error);
    return NextResponse.json({ status: false, msg: error.message }, { status: 500 });
  }
}
