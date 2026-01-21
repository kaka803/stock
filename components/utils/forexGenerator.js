function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function getHashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export const generateForexData = (pair) => {
    if (!pair) return null;

    const seed = getHashCode(pair.symbol);
    const price = parseFloat(pair.price);
    
    const generateOptions = () => {
        const strikes = [];
        const centerStrike = price;
        const numStrikes = 10;
        
        for (let i = -5; i < 5; i++) {
            const strikePrice = centerStrike + (i * 0.0050); 
            const volCall = Math.floor(seededRandom(seed + i) * 5000);
            const openIntCall = Math.floor(seededRandom(seed + i + 100) * 10000);
            const callPrice = Math.max(0.0001, (price - strikePrice + seededRandom(seed + i + 200) * 0.01)).toFixed(4);
            
            strikes.push({
                strike: strikePrice.toFixed(4),
                call: { price: callPrice, vol: volCall, oi: openIntCall },
                put: { price: (Math.max(0.0001, strikePrice - price + seededRandom(seed + i + 300) * 0.01)).toFixed(4), vol: Math.floor(seededRandom(seed + i + 400) * 5000), oi: Math.floor(seededRandom(seed + i + 500) * 10000) }
            });
        }
        return strikes;
    };

    const generateIndicators = () => {
        const years = ['2020', '2021', '2022', '2023', 'Projected'];
        return years.map((year, i) => {
            const gdp = (2.0 + seededRandom(seed + i) * 3.0).toFixed(1);
            const inflation = (2.0 + seededRandom(seed + i + 50) * 5.0).toFixed(1);
            const interestRate = (0.25 + seededRandom(seed + i + 100) * 5.0).toFixed(2);
            return {
                year,
                gdp: parseFloat(gdp),
                inflation: parseFloat(inflation),
                interestRate: parseFloat(interestRate)
            };
        });
    };

    const generateSentiment = () => {
        const history = [];
        for (let i = 4; i >= 0; i--) {
            const year = (new Date().getFullYear() - i).toString();
            const val = 40 + seededRandom(seed + i) * 40; // 40-80% buy sentiment
            history.push({ year, value: parseFloat(val.toFixed(1)) });
        }
        return history;
    };

    const newsTemplates = [
        "Central Bank signals hawkish stance on {symbol}",
        "Inflation data impacts {name} trading session",
        "Geopolitical tensions drive safe-haven demand for {symbol}",
        "Economic recovery in {name} zone boosts currency sentiment",
        "{symbol} breaks key resistance level as dollar weakens",
        "Trade balance data for {name} exceeds expectations",
        "Why {symbol} is the pair to watch this week",
        "Expert analysis: {name} outlook for Q4",
        "Volatility spikes in {symbol} following jobs report",
        "How global bond yields are affecting {symbol}"
    ];

    const generateNews = () => {
        const newsItems = [];
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(seededRandom(seed + i * 1000) * newsTemplates.length);
            const title = newsTemplates[index]
                .replace("{symbol}", pair.symbol)
                .replace("{name}", pair.name);
            
            const hoursAgo = Math.floor(seededRandom(seed + i * 50) * 24) + 1;
            
            newsItems.push({
                title,
                source: ["ForexLive", "DailyFX", "FXStreet", "Reuters", "Bloomberg"][Math.floor(seededRandom(seed + i) * 5)],
                time: `${hoursAgo} hours ago`,
                summary: `The ${pair.name} pair is experiencing significant movement as traders digest new economic indicators. The market sentiment remains focused on upcoming policy decisions.`,
                image: `https://images.unsplash.com/photo-${[
                    "1611974765270-ca1258634369", 
                    "1590283603385-17ffb3a7f29f", 
                    "1642543492481-44e81e3914a7", 
                    "1559526324-4b87b5e36e44"
                ][i % 4]}?auto=format&fit=crop&q=80&w=300&h=200`,
                category: ["Market News", "Analysis", "Economic Report"][Math.floor(seededRandom(seed + i * 20) * 3)]
            });
        }
        return newsItems;
    };

    return {
        options: generateOptions(),
        indicators: generateIndicators(),
        sentiment: generateSentiment(),
        news: generateNews(),
        yields: { current: (0.5 + seededRandom(seed) * 4).toFixed(2), previous: (0.5 + seededRandom(seed + 1) * 4).toFixed(2) }
    };
};
