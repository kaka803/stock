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
  "EUR/AUD", "EUR/CAD", "EUR/NZD", "GBP/AUD", "GBP/CAD", "GBP/NZD",

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

  // Additional AUD/NZD/CAD/CHF Crosses
  "AUD/SGD", "AUD/HKD", "AUD/PLN", "AUD/NOK", "AUD/SEK", "AUD/DKK", 
  "NZD/SGD", "NZD/HKD", "CAD/SGD", "CAD/HKD", "CHF/SGD", "CHF/HKD",
  "CHF/SEK", "CHF/NOK", "CHF/DKK", "CHF/PLN",

  // Metals & Crypto (Often traded on Forex platforms)
  "XAU/USD", "XAG/USD", "XPT/USD", "XPD/USD", "BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD",
  "XRP/USD", "ADA/USD", "DOT/USD", "LTC/USD", "AVA/USD", "UNI/USD", "LINK/USD",

  // More Exotics & Others
  "TRY/JPY", "MXN/JPY", "ZAR/JPY", "SGD/JPY", "HKD/JPY", "NOK/JPY", "SEK/JPY",
  "DKK/JPY", "PLN/JPY", "HUF/JPY", "CZK/JPY", "ILS/JPY", "RUB/JPY",
  "BRL/JPY", "INR/JPY", "THB/JPY", "IDR/JPY", "SAR/JPY", "AED/JPY",
  "SGD/HKD", "SGD/ZAR", "SGD/TRY", "SGD/MXN", "SGD/NOK", "SGD/SEK",
  "HKD/SGD", "HKD/ZAR", "HKD/TRY", "HKD/MXN", "HKD/NOK", "HKD/SEK",
  "ZAR/SGD", "ZAR/HKD", "ZAR/TRY", "ZAR/MXN", "ZAR/NOK", "ZAR/SEK",
  "TRY/SGD", "TRY/HKD", "TRY/ZAR", "TRY/MXN", "TRY/NOK", "TRY/SEK",
  "MXN/SGD", "MXN/HKD", "MXN/ZAR", "MXN/TRY", "MXN/NOK", "MXN/SEK",
  "NOK/SGD", "NOK/HKD", "NOK/ZAR", "NOK/TRY", "NOK/MXN", "NOK/SEK",
  "SEK/SGD", "SEK/HKD", "SEK/ZAR", "SEK/TRY", "SEK/MXN", "SEK/NOK"
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedSymbols = searchParams.get('symbol')?.split(',').map(s => s.trim().toUpperCase()) || [];

    // Limit to first 150 unique symbols to avoid excessive URL length or API limits
    let symbolsToFetch = [...new Set(requestedSymbols.length > 0 ? requestedSymbols : POPULAR_PAIRS)].slice(0, 150);

    if (!API_KEY) {
      console.error("FCS API Key is missing");
      return NextResponse.json({ status: false, msg: "API Key missing" }, { status: 500 });
    }

    // Function to fetch a batch of symbols
    const fetchBatch = async (symbols) => {
        const symbolsString = symbols.join(',');
        const params = new URLSearchParams({
            symbol: symbolsString,
            access_key: API_KEY
        });
        const url = `${BASE_URL}?${params.toString()}`;
        
        console.log("Forex API Fetching Batch:", symbolsString.substring(0, 50) + "...");
        const response = await fetch(url);
        return response.json();
    };

    // Split symbols into batches of 50
    const batches = [];
    for (let i = 0; i < symbolsToFetch.length; i += 50) {
        batches.push(symbolsToFetch.slice(i, i + 50));
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
