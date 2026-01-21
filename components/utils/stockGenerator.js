
// Utility to generate deterministic but realistic stock data

// Simple seedable random number generator
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Generate a hash code from a string (symbol)
function getHashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export const generateStockData = (stock) => {
    if (!stock) return null;

    const seed = getHashCode(stock.symbol);
    const price = parseFloat(stock.price);
    
    // --- 1. Option Chain Generator ---
    // Generate strikes mostly around the current price
    const generateOptions = () => {
        const strikes = [];
        const centerStrike = Math.round(price);
        const numStrikes = 10;
        
        for (let i = -5; i < 5; i++) {
            const strikePrice = centerStrike + (i * (price > 100 ? 5 : 1)); // Bigger steps for expensive stocks
            // Deterministic randoms based on seed index
            const volCall = Math.floor(seededRandom(seed + i) * 10000);
            const openIntCall = Math.floor(seededRandom(seed + i + 100) * 50000);
            const callPrice = Math.max(0.01, (price - strikePrice + seededRandom(seed + i + 200) * 5)).toFixed(2);
            
            strikes.push({
                strike: strikePrice.toFixed(2),
                call: { price: callPrice, vol: volCall, oi: openIntCall },
                put: { price: (Math.max(0.01, strikePrice - price + seededRandom(seed + i + 300) * 5)).toFixed(2), vol: Math.floor(seededRandom(seed + i + 400) * 10000), oi: Math.floor(seededRandom(seed + i + 500) * 50000) }
            });
        }
        return strikes;
    };


    // --- 2. Financials Generator ---
    // Base revenue on a rough market cap approximation (Price * 100M shares arbitrary multiplier for scale if market cap missing)
    // Here we just fabricate realistic looking billions
    const generateFinancials = () => {
        const baseRev = (price * (seededRandom(seed) * 5 + 1)); // Arbitrary base billions
        const years = ['2020', '2021', '2022', '2023', 'TTM'];
        
        return years.map((year, i) => {
            const growthFactor = 1 + (seededRandom(seed + i) * 0.2 - 0.05); // -5% to +15% growth
            const rev = (baseRev * (1 + i * 0.1) * growthFactor).toFixed(1);
            const netIncome = (rev * (0.15 + seededRandom(seed + i + 50) * 0.1)).toFixed(1); // 15-25% margin
            return {
                year,
                revenue: parseFloat(rev),
                netIncome: parseFloat(netIncome),
                costOfRevenue: (rev * 0.6).toFixed(1),
                grossProfit: (rev * 0.4).toFixed(1),
                opExpenses: (rev * 0.15).toFixed(1)
            };
        });
    };

    // --- 3. Market Cap History ---
    const generateMarketCapHistory = () => {
        // Parse current market cap if available (e.g. "3.42T"), else mock based on price
        const currentCapVal = stock.marketCap ? parseFloat(stock.marketCap.replace(/[^0-9.]/g, '')) : (price * 0.5); // Fallback calc
        const history = [];
        for (let i = 4; i >= 0; i--) {
            const year = (new Date().getFullYear() - i).toString();
            // volatile history
            const val = currentCapVal * (1 - (i * 0.1) + (seededRandom(seed + i * 10) * 0.2));
            history.push({ year, value: parseFloat(val.toFixed(2)) });
        }
        return history;
    };

    // --- 4. News ---
    const newsTemplates = [
        "Market rallies as {symbol} reports strong earnings beat",
        "{name} announces new strategic partnership to expand market share",
        "Analysts upgrade {symbol} citing improved growth outlook",
        "Why {name} stock is moving higher today",
        "{symbol} faces headwinds amidst sector rotation",
        "Institutional investors increase stake in {name}",
        "Breaking: {name} unveils breakthrough product innovation",
        "Where will {symbol} stock be in 5 years?",
        "{name} declares quarterly dividend",
        "Tech sector volatility impacts {symbol} trading volume"
    ];

    const generateNews = () => {
        // Pick 4 random news items deterministically
        const newsItems = [];
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(seededRandom(seed + i * 1000) * newsTemplates.length);
            const title = newsTemplates[index]
                .replace("{symbol}", stock.symbol)
                .replace("{name}", stock.name);
            
            const hoursAgo = Math.floor(seededRandom(seed + i * 50) * 24) + 1;
            
            newsItems.push({
                title,
                source: ["Bloomberg", "Reuters", "CNBC", "MarketWatch", "Financial Times"][Math.floor(seededRandom(seed + i) * 5)],
                time: `${hoursAgo} hours ago`,
                summary: `Investors are reacting to the latest developments surrounding ${stock.name}. The stock has seen significant activity as market participants digest the implications.`,
                image: `https://images.unsplash.com/photo-${[
                    "1611974765270-ca1258634369", 
                    "1590283603385-17ffb3a7f29f", 
                    "1642543492481-44e81e3914a7", 
                    "1559526324-4b87b5e36e44"
                ][i % 4]}?auto=format&fit=crop&q=80&w=300&h=200`,
                category: ["Market News", "Analysis", "Press Release"][Math.floor(seededRandom(seed + i * 20) * 3)]
            });
        }
        return newsItems;
    };

    // --- 5. PE Ratio ---
    const peRatio = (15 + seededRandom(seed) * 40).toFixed(2); // 15 - 55
    const industryPe = (20 + seededRandom(seed + 1) * 10).toFixed(2);

    return {
        options: generateOptions(),
        financials: generateFinancials(),
        marketCapHistory: generateMarketCapHistory(),
        news: generateNews(),
        pe: { current: peRatio, industry: industryPe }
    };
};
