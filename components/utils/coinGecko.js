
export async function fetchTopCoins(perPage = 50, page = 1) {
  try {
    // Fetch from our local API route to avoid CORS errors
    const response = await fetch(`/api/crypto?per_page=${perPage}&page=${page}`);
    
    if (!response.ok) {
        console.error("API Error:", response.statusText);
        return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from local API:", error);
    return null;
  }
}
