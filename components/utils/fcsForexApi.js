// ================= CONFIG =================
// API Call is now handled by /app/api/forex/route.js

// ================= CACHE =================
let cachedForex = null;
let lastFetchTime = 0;
let fetchPromise = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function fetchTopForex() {
  if (cachedForex && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedForex;
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      // Fetch from our internal API route
      const response = await fetch('/api/forex');
      const data = await response.json();

      if (data.status === true && Array.isArray(data.response)) {
        cachedForex = data.response;
        lastFetchTime = Date.now();
        return data.response;
      } else {
        console.warn("Failed to fetch forex from internal API:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching forex from internal API:", error);
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

let detailFetchPromises = new Map();

export async function fetchForexDetail(symbol) {
    if (!symbol) return null;
    const cleanSymbol = symbol.toUpperCase();
    
    if (detailFetchPromises.has(cleanSymbol)) {
        return detailFetchPromises.get(cleanSymbol);
    }
  
    const fetchPromise = (async () => {
        try {
          const res = await fetch(`/api/forex?symbol=${encodeURIComponent(cleanSymbol)}`);
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
            open: Number(item.open || item.price),
            description: `${item.name || item.symbol} is a major currency pair in the global forex market.`
          };
      
        } catch (error) {
          console.error("❌ Forex Detail Fetch Error:", error);
          return null;
        } finally {
          detailFetchPromises.delete(cleanSymbol);
        }
    })();

    detailFetchPromises.set(cleanSymbol, fetchPromise);
    return fetchPromise;
}
