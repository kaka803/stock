import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_FCS_API_KEY;
const BASE_URL = 'https://fcsapi.com/api-v3/stock/latest';

const POPULAR_ETFS = [
  "SPY", "IVV", "VOO", "QQQ", "VTI", "VEA", "VWO", "IEFA", "AGG", "BND",
  "IJR", "IWM", "IJH", "VTV", "VUG", "IWF", "IWD", "VIG", "GLD", "VIG",
  "VYM", "VXUS", "ITOT", "SCHB", "SCHX", "RSP", "VV", "SCHD", "QUAL", "IVE",
  "IVW", "IWB", "DIA", "IEMG", "EFA", "EEM", "TIP", "LQD", "BSV", "BNDX",
  "MBB", "SHV", "MINT", "BIL", "JPST", "ICF", "VNQ", "XLK", "XLV", "XLF"
];

// Metadata for common ETFs
const ETF_METADATA = {
    "SPY": "SPDR S&P 500 ETF Trust",
    "IVV": "iShares Core S&P 500 ETF",
    "VOO": "Vanguard S&P 500 ETF",
    "QQQ": "Invesco QQQ Trust",
    "VTI": "Vanguard Total Stock Market ETF",
    "VEA": "Vanguard FTSE Developed Markets ETF",
    "VWO": "Vanguard FTSE Emerging Markets ETF",
    "IEFA": "iShares Core MSCI EAFE ETF",
    "AGG": "iShares Core U.S. Aggregate Bond ETF",
    "BND": "Vanguard Total Bond Market ETF",
    "IJR": "iShares Core S&P Small-Cap ETF",
    "IWM": "iShares Russell 2000 ETF",
    "IJH": "iShares Core S&P Mid-Cap ETF",
    "VTV": "Vanguard Value ETF",
    "VUG": "Vanguard Growth ETF",
    "IWF": "iShares Russell 1000 Growth ETF",
    "IWD": "iShares Russell 1000 Value ETF",
    "VIG": "Vanguard Dividend Appreciation ETF",
    "GLD": "SPDR Gold Shares",
    "VYM": "Vanguard High Dividend Yield ETF",
    "VXUS": "Vanguard Total International Stock ETF",
    "ITOT": "iShares Core S&P Total U.S. Stock Market ETF",
    "SCHB": "Schwab U.S. Broad Market ETF",
    "SCHX": "Schwab U.S. Large-Cap ETF",
    "RSP": "Invesco S&P 500 Equal Weight ETF",
    "VV": "Vanguard Large-Cap ETF",
    "SCHD": "Schwab US Dividend Equity ETF",
    "QUAL": "iShares MSCI USA Quality Factor ETF",
    "IVE": "iShares S&P 500 Value ETF",
    "IVW": "iShares S&P 500 Growth ETF",
    "IWB": "iShares Russell 1000 ETF",
    "DIA": "SPDR Dow Jones Industrial Average ETF Trust",
    "IEMG": "iShares Core MSCI Emerging Markets ETF",
    "EFA": "iShares MSCI EAFE ETF",
    "EEM": "iShares MSCI Emerging Markets ETF",
    "TIP": "iShares TIPS Bond ETF",
    "LQD": "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    "BSV": "Vanguard Short-Term Bond ETF",
    "BNDX": "Vanguard Total International Bond ETF",
    "MBB": "iShares MBS ETF",
    "SHV": "iShares Short Treasury Bond ETF",
    "MINT": "PIMCO Enhanced Short Maturity Active ETF",
    "BIL": "SPDR Bloomberg 1-3 Month T-Bill ETF",
    "JPST": "JPMorgan Ultra-Short Income ETF",
    "ICF": "iShares Cohen & Steers REIT ETF",
    "VNQ": "Vanguard Real Estate ETF",
    "XLK": "Technology Select Sector SPDR Fund",
    "XLV": "Health Care Select Sector SPDR Fund",
    "XLF": "Financial Select Sector SPDR Fund"
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedSymbols = searchParams.get('symbol')?.split(',').map(s => s.trim().toUpperCase()) || [];

    let symbolsToFetch;
    if (requestedSymbols.length > 0) {
      symbolsToFetch = requestedSymbols;
    } else {
      symbolsToFetch = POPULAR_ETFS;
    }

    if (!API_KEY) {
      return NextResponse.json({ status: false, msg: "API Key is missing" }, { status: 500 });
    }

    const chunks = [];
    const chunkSize = 150;
    for (let i = 0; i < symbolsToFetch.length; i += chunkSize) {
      chunks.push(symbolsToFetch.slice(i, i + chunkSize));
    }

    const allEtfs = [];

    for (const chunk of chunks) {
      const symbolsString = chunk.join(',');
      const url = `${BASE_URL}?symbol=${symbolsString}&access_key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === true && Array.isArray(data.response)) {
        allEtfs.push(...data.response);
      }
    }

    const mappedEtfs = allEtfs.map(item => ({
      name: ETF_METADATA[item.s] || item.n || item.s,
      symbol: item.s,
      price: item.c,
      change: item.cp,
      changeValue: item.ch,
      isNegative: parseFloat(item.ch) < 0,
      isEtf: true
    }));

    return NextResponse.json(mappedEtfs);

  } catch (error) {
    console.error("ETFs API Error:", error);
    return NextResponse.json({ status: false, msg: error.message }, { status: 500 });
  }
}
