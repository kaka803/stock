// ================= CONFIG =================
// API Call is now handled by /app/api/stocks/route.js

// ================= CACHE =================
let cachedStocks = null;
let lastFetchTime = 0;
let fetchPromise = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function fetchTop100Stocks() {
  if (cachedStocks && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedStocks;
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      // Fetch from our internal API route
      const response = await fetch('/api/stocks');
      const data = await response.json();

      if (Array.isArray(data)) {
        cachedStocks = data;
        lastFetchTime = Date.now();
        return data;
      } else {
        console.warn("Failed to fetch stocks from internal API:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching stocks from internal API:", error);
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}
