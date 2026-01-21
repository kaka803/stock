
export const generateMockMarketCap = (sym) => {
  if (!sym) return 0;
  // Simple hash to make it consistent per symbol
  let hash = 0;
  for (let i = 0; i < sym.length; i++) {
    hash = sym.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate a number between 1B and 1T (mostly)
  const rand = Math.abs(Math.sin(hash)) * 1000; 
  
  if (sym === 'BTC') return 1200000000000; // 1.2T
  if (sym === 'ETH') return 350000000000;  // 350B
  if (sym === 'SOL') return 70000000000;   // 70B
  
  return rand * 1000000000;
};

export const formatMarketCap = (val) => {
    if (!val) return 'N/A';
    // If it's already a formatted string, return it
    if (typeof val === 'string' && (val.includes('$') || val.includes('B') || val.includes('T'))) {
        return val;
    }
    
    const num = Number(val);
    if (isNaN(num)) return 'N/A';

    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
};
