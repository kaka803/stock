import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_FCS_API_KEY;
const BASE_URL = 'https://fcsapi.com/api-v3/forex/latest';

const POPULAR_PAIRS = [
  // Majors
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
  
  // Majors Crosses (Minors)
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "EUR/CHF", "GBP/CHF", "AUD/JPY", "EUR/AUD",
  "NZD/JPY", "GBP/CAD", "EUR/CAD", "AUD/CAD", "GBP/AUD", "AUD/NZD", "NZD/CAD",
  "GBP/NZD", "EUR/NZD", "CAD/JPY", "CHF/JPY", "AUD/CHF", "CAD/CHF", "NZD/CHF",

  // Euro Crosses
  "EUR/DKK", "EUR/HKD", "EUR/NOK", "EUR/PLN", "EUR/SEK", "EUR/SGD", "EUR/TRY", 
  "EUR/ZAR", "EUR/HUF", "EUR/CZK", "EUR/MXN", "EUR/ILS", "EUR/CNH", "EUR/RUB",

  // GBP Crosses
  "GBP/DKK", "GBP/HKD", "GBP/NOK", "GBP/PLN", "GBP/SEK", "GBP/SGD", "GBP/TRY", 
  "GBP/ZAR", "GBP/HUF", "GBP/CZK", "GBP/MXN", "GBP/ILS", "GBP/CNH",

  // USD Crosses (Exotics)
  "USD/HKD", "USD/SGD", "USD/ZAR", "USD/TRY", "USD/MXN", "USD/NOK", "USD/SEK",
  "USD/DKK", "USD/PLN", "USD/HUF", "USD/CZK", "USD/ILS", "USD/CNH", "USD/RUB",
  "USD/BRL", "USD/INR", "USD/KRW", "USD/TWD", "USD/THB", "USD/IDR", "USD/PHP",
  "USD/MYR", "USD/SAR", "USD/AED", "USD/KWD", "USD/QAR", "USD/OMr", "USD/BHD",
  "USD/EGP", "USD/NGN", "USD/KES", "USD/GHS", "USD/MAD",

  // Additional 
  "AUD/SGD", "AUD/HKD", "AUD/PLN", "AUD/NOK", "AUD/SEK", "AUD/DKK", 
  "NZD/SGD", "NZD/HKD", "CAD/SGD", "CAD/HKD", "CHF/SGD"
];

// Simple In-Memory Cache for Server Instance
const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedSymbols = searchParams.get('symbol')?.split(',').map(s => s.trim().toUpperCase()) || [];

    // Limit to first 100 unique symbols to stay within 1 credit limit
    let symbolsToFetch = [...new Set(requestedSymbols.length > 0 ? requestedSymbols : POPULAR_PAIRS)].slice(0, 100);
    
    // Check Cache for the exact symbol string requested
    const cacheKey = symbolsToFetch.sort().join(',');
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      return NextResponse.json({ status: true, response: cachedData.data, source: 'cache' });
    }

    if (!API_KEY) {
        console.error("FCS API Key is missing");
        return NextResponse.json({ status: false, msg: "API Key missing" }, { status: 500 });
    }

    // Function to fetch a batch of symbols
    const fetchBatch = async (symbols) => {
        try {
            const symbolsString = symbols.join(',');
            const params = new URLSearchParams({
                symbol: symbolsString,
                access_key: API_KEY
            });
            const url = `${BASE_URL}?${params.toString()}`;
            
            const response = await fetch(url);
            
            // If not OK, read as text to avoid JSON parse crash
            if (!response.ok) {
                const text = await response.text();
                return { status: false, msg: `API returned ${response.status}`, details: text };
            }

            return await response.json();
        } catch (err) {
            console.error("fetchBatch error:", err);
            return { status: false, msg: err.message };
        }
    };

    // Split symbols into batches of 100
    const batches = [];
    for (let i = 0; i < symbolsToFetch.length; i += 100) {
        batches.push(symbolsToFetch.slice(i, i + 100));
    }

    const allResponses = await Promise.all(batches.map(batch => fetchBatch(batch)));
    
    let allPairs = [];
    let errorMessage = null;

    allResponses.forEach(data => {
        if (data.status === true && Array.isArray(data.response)) {
            allPairs = [...allPairs, ...data.response];
        } else if (!errorMessage) {
            errorMessage = data.message || data.msg || "API Error in batch";
            console.error("Forex API Batch Error:", data);
        }
    });

    if (allPairs.length > 0) {
        const mappedResult = allPairs.map(item => ({
            name: item.n || item.s,
            symbol: item.s,
            price: item.c,
            change: item.cp,
            changeValue: item.ch,
            isNegative: parseFloat(item.ch) < 0,
            high: item.h,
            low: item.l,
            open: item.o,
            time: item.t
        }));

        // Store in Cache
        cache.set(cacheKey, {
            data: mappedResult,
            timestamp: Date.now()
        });

        return NextResponse.json({ status: true, response: mappedResult });
    }

    return NextResponse.json({ 
        status: false, 
        msg: errorMessage || "Failed to fetch from FCS API" 
    }, { status: 400 });

  } catch (error) {
    console.error("Forex API Global Error:", error);
    return NextResponse.json({ status: false, msg: error.message }, { status: 500 });
  }
}
