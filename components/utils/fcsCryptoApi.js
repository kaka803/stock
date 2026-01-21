// ================= CONFIG =================
// API Call is now handled by /app/api/crypto/route.js

// ================= CACHE =================
let cachedCryptos = null;
let lastFetchTime = 0;
let fetchPromise = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

// ================= FETCH TOP COINS =================
// ================= FETCH TOP COINS =================
export async function fetchTopCryptos() {
  if (cachedCryptos && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedCryptos;
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      // Fetch from our internal API route
      const res = await fetch('/api/crypto');
      const data = await res.json();

      if (data.status === true && Array.isArray(data.response)) {
        cachedCryptos = data.response;
        lastFetchTime = Date.now();
        return data.response;
      } else {
        console.warn("Failed to fetch cryptos from internal API:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching cryptos from internal API:", error);
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

// ================= FETCH SINGLE COIN =================
export async function fetchCryptoDetail(symbol) {
  if (!symbol) return null;

  try {
    // Fetch from our internal API route with symbol param
    const res = await fetch(`/api/crypto?symbol=${symbol}`);
    const data = await res.json();

    if (!data.status || !Array.isArray(data.response)) return null;

    const item = data.response[0];

    return {
      name: item.name || item.symbol,
      symbol: item.symbol,
      price: Number(item.price),
      change: Number(item.change),
      changeValue: Number(item.changeValue),
      isNegative: item.isNegative,
      high: Number(item.high),
      low: Number(item.low),
      open: Number(item.open || item.price), // Fallback to current price if open not provided
      volume: Number(item.volume),
      description: `${item.name || item.symbol} is a popular cryptocurrency traded against USD.`
    };

  } catch (error) {
    console.error("❌ Detail Fetch Error:", error);
    return null;
  }
}
