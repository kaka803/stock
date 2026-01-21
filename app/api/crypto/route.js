import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_FCS_API_KEY;
const BASE_URL_V4 = "https://api-v4.fcsapi.com/crypto";

// Top 100+ Crypto Symbols paired with USD
const POPULAR_CRYPTO_SYMBOLS = [
  "BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "USDC", "ADA", "AVAX", "DOGE",
  "DOT", "TRX", "LINK", "MATIC", "WBTC", "DAI", "LTC", "BCH", "SHIB", "ATOM",
  "XLM", "OKB", "LEO", "XMR", "ETC", "HBAR", "FIL", "ICP", "VET", "LDO",
  "APT", "QNT", "CRO", "ARB", "NEAR", "MKR", "STX", "GRT", "AAVE", "ALGO",
  "AXS", "SAND", "EGLD", "EOS", "THETA", "MANA", "IMX", "FTM", "SNX", "NEO",
  "RNDR", "XTZ", "KAVA", "FLOW", "CHZ", "GALA", "BSV", "KLAY", "ZEC", "IOTA",
  "PAXG", "USDP", "TUSD", "BTT", "GNO", "MINA", "CRV", "CAKE", "BGB", "TWT",
  "DASH", "FXS", "LUNC", "XEC", "GMX", "ZIL", "KCS", "XDC", "COMP", "1INCH",
  "HOT", "CSPR", "HT", "BTG", "RVN", "TFUEL", "GLM", "QTUM", "CVX", "NEXO",
  "KSM", "ENJ", "BAT", "DCR", "CELO", "FLOKI", "SC", "DGB", "ENS", "ZRX",
  "PEPE", "WIF", "BONK", "SUI", "SEI", "TIA", "ORDI", "SATS", "RUNE", "INJ",
  "TAO", "KAS", "ZBU", "FDUSD", "PYTH", "BLUR", "MEME", "JUP", "MANTA", "ALT",
  "DYM", "STRK", "PIXEL", "PORTAL", "AEVO", "ETHFI", "ENA", "W", "TNSR", "OMNI",
  "REZ", "BB", "NOT", "IO", "ZK", "ZRO", "BLAST", "DOGS", "CORE", "AKT",
  "CFX", "PENDLE", "FET", "AGIX", "OCEAN", "JASMY", "FLR", "ONDO", "SUPER"
];

const CRYPTO_METADATA = {
    "BTC": { name: "Bitcoin" },
    "ETH": { name: "Ethereum" },
    "USDT": { name: "Tether" },
    "BNB": { name: "Binance Coin" },
    "SOL": { name: "Solana" },
    "XRP": { name: "XRP" },
    "USDC": { name: "USD Coin" },
    "ADA": { name: "Cardano" },
    "AVAX": { name: "Avalanche" },
    "DOGE": { name: "Dogecoin" },
    "DOT": { name: "Polkadot" },
    "TRX": { name: "TRON" },
    "LINK": { name: "Chainlink" },
    "MATIC": { name: "Polygon" },
    "WBTC": { name: "Wrapped Bitcoin" },
    "DAI": { name: "Dai" },
    "LTC": { name: "Litecoin" },
    "BCH": { name: "Bitcoin Cash" },
    "SHIB": { name: "Shiba Inu" },
    "ATOM": { name: "Cosmos" },
    "XLM": { name: "Stellar" },
    "XMR": { name: "Monero" },
    "ETC": { name: "Ethereum Classic" },
    "FIL": { name: "Filecoin" },
    "ICP": { name: "Internet Computer" },
    "HBAR": { name: "Hedera" },
    "VET": { name: "VeChain" },
    "APT": { name: "Aptos" },
    "ARB": { name: "Arbitrum" },
    "NEAR": { name: "NEAR Protocol" },
    "MKR": { name: "Maker" },
    "STX": { name: "Stacks" },
    "GRT": { name: "The Graph" },
    "AAVE": { name: "Aave" },
    "ALGO": { name: "Algorand" },
    "AXS": { name: "Axie Infinity" },
    "SAND": { name: "The Sandbox" },
    "MANA": { name: "Decentraland" },
    "FTM": { name: "Fantom" },
    "EGLD": { name: "MultiversX" },
    "THETA": { name: "Theta Network" },
    "FTT": { name: "FTX Token" },
    "EOS": { name: "EOS" },
    "KAVA": { name: "Kava" },
    "CHZ": { name: "Chiliz" },
    "GALA": { name: "Gala" },
    "NEO": { name: "NEO" },
    "FLOW": { name: "Flow" },
    "ZEC": { name: "Zcash" },
    "IOTA": { name: "IOTA" },
    "PEPE": { name: "Pepe" },
    "BONK": { name: "Bonk" },
    "WIF": { name: "dogwifhat" },
    "SUI": { name: "Sui" },
    "TIA": { name: "Celestia" },
    "SEI": { name: "Sei" },
    "ORDI": { name: "ORDI" },
    "INJ": { name: "Injective" },
    "RUNE": { name: "THORChain" },
    "TAO": { name: "Bittensor" },
    "KAS": { name: "Kaspa" },
    "FET": { name: "Fetch.ai" },
    "JASMY": { name: "JasmyCoin" },
    "ONDO": { name: "Ondo" },
    "FLR": { name: "Flare" },
    "RENDER": { name: "Render" },
    "PENDLE": { name: "Pendle" },
};

// Helper to get icon URL dynamically
const getIconUrl = (symbol) => {
    // Using a reliable CDN that hosts icons for almost all crypto symbols
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`;
};

const BINANCE_BASE = "https://api.binance.com/api/v3/ticker/24hr";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  try {
    const response = await fetch(BINANCE_BASE);
    if (!response.ok) throw new Error("Binance API returned an error");
    const data = await response.json();

    let filteredData;
    if (symbol) {
        const requested = symbol.toUpperCase().split(',').map(s => s.trim());
        filteredData = data.filter(item => {
            const sym = item.symbol;
            return requested.some(r => sym === `${r}USDT` || sym === r);
        });
    } else {
        filteredData = data.filter(item => {
            const sym = item.symbol;
            return sym.endsWith('USDT') && POPULAR_CRYPTO_SYMBOLS.some(p => sym === `${p}USDT`);
        });
    }

    const mapped = filteredData.map(item => {
        const symbol = item.symbol.replace('USDT', '');
        const meta = CRYPTO_METADATA[symbol] || {};
        return {
            name: meta.name || symbol,
            symbol: symbol,
            image: getIconUrl(symbol), // Dynamically get icon for EVERY coin
            price: Number(item.lastPrice),
            change: Number(item.priceChangePercent),
            changeValue: Number(item.priceChange),
            isNegative: Number(item.priceChange) < 0,
            volume: Number(item.volume),
            high: Number(item.highPrice),
            low: Number(item.lowPrice),
            isBinance: true
        };
    });

    const uniqueHelper = new Set();
    const result = mapped.filter(item => {
        if (uniqueHelper.has(item.symbol)) return false;
        uniqueHelper.add(item.symbol);
        return true;
    });

    return NextResponse.json({ status: true, response: result });

  } catch (error) {
    console.error("Crypto Migration Error:", error);
    return NextResponse.json({ status: false, msg: error.message }, { status: 500 });
  }
}
