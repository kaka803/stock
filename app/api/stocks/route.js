import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stock from '@/models/Stock';

const API_KEY = process.env.NEXT_PUBLIC_FCS_API_KEY;
const BASE_URL = 'https://fcsapi.com/api-v3/stock/latest';

const POPULAR_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK.B", "MNST", "LLY",
  "V", "UNH", "JNJ", "WMT", "JPM", "XOM", "MA", "PG", "AVGO", "HD",
  "CVX", "MRK", "ABBV", "PEP", "KO", "COST", "ADBE", "CSCO", "MCD", "TMO",
  "CRM", "PFE", "ACN", "NFLX", "DHR", "LIN", "ABT", "NKE", "ORCL", "AMD",
  "DIS", "TXN", "WFC", "UPS", "PM", "BMY", "NEE", "QCOM", "RTX", "HON",
  "UNP", "AMGN", "IBM", "LOW", "SPGI", "INTC", "CAT", "BA", "GS", "GE",
  "DE", "BLK", "PLD", "MDT", "LMT", "BKNG", "AMT", "SCHW", "GILD", "SYK",
  "T", "ADI", "TJX", "ADP", "C", "MDLZ", "ELV", "ISRG", "AXP", "MMC",
  "NOW", "ZTS", "VRTX", "REGN", "PGR", "LRCX", "CI", "BSX", "MO", "SLB",
  "BDX", "EOG", "FI", "MU", "NOC", "SO", "DUK", "WM", "ITW", "CSX",
  "CL", "AON", "MELI", "PANW", "SNOW", "UBER", "ABNB", "PLTR", "SQ", "COIN"
];

export async function GET(req) {
  try {
    await connectDB();
    
    // Get symbols from query params
    const { searchParams } = new URL(req.url);
    const requestedSymbols = searchParams.get('symbol')?.split(',').map(s => s.trim().toUpperCase()) || [];

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

    const chunks = [];
    const chunkSize = 150;
    for (let i = 0; i < symbolsToFetch.length; i += chunkSize) {
      chunks.push(symbolsToFetch.slice(i, i + chunkSize));
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

    return NextResponse.json([...mappedCustom, ...mappedExternal]);

  } catch (error) {
    console.error("Stocks API Error:", error);
    return NextResponse.json({ status: false, msg: error.message }, { status: 500 });
  }
}
