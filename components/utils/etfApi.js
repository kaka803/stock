let cachedEtfs = null;
let lastFetchTime = 0;
let fetchPromise = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function fetchTopEtfs() {
  if (cachedEtfs && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedEtfs;
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const response = await fetch('/api/etfs');
      const data = await response.json();

      if (data.status !== false && Array.isArray(data)) {
        cachedEtfs = data;
        lastFetchTime = Date.now();
        return data;
      } else {
        console.warn("Failed to fetch ETFs from internal API:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching ETFs from internal API:", error);
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}
