'use client';
import { useParams } from 'next/navigation';
import { useForex } from '@/context/ForexContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, PieChart, Info, Users, TrendingUp } from 'lucide-react';
import { generateForexData } from '@/components/utils/forexGenerator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForexSentimentPage() {
  const { symbol } = useParams();
  const displaySymbol = symbol?.replace('-', '/').toUpperCase();
  const { getForexBySymbol, forex, loadForex } = useForex();
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState([]);

  useEffect(() => {
    if (forex.length === 0) {
        loadForex();
        return;
    }
    const foundPair = getForexBySymbol(displaySymbol);
    if (foundPair) {
      setPair(foundPair);
      const data = generateForexData(foundPair);
      setSentimentData(data.sentiment);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [displaySymbol, forex, getForexBySymbol, loadForex]);

  if (loading || (forex.length === 0 && !pair)) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
  }

  if (!pair) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/forex" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Forex
           </Link>
           <span>/</span>
           <Link href={`/forex/${symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{pair.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">Market Cap</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {[
                    { name: 'About', href: `/forex/${symbol}` },
                    { name: 'Financials', href: `/forex/${symbol}/financials` },
                    { name: 'Option chain', href: `/forex/${symbol}/option-chain` },
                    { name: 'Market Cap', href: `/forex/${symbol}/market-cap` },
                    { name: 'P/E ratio', href: `/forex/${symbol}/pe-ratio` },
                    { name: 'News', href: `/forex/${symbol}/news` }
                ].map((item, i) => {
                    const isActive = item.name === 'Market Cap';
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={item.href} className={className}>
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold anta-regular mb-2">{pair.name} ({pair.symbol}) Market Cap</h1>
                    <div className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                        {sentimentData[sentimentData.length-1]?.value}% Bullish
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                        The market capitalization (represented here by market sentiment and liquidity) for {pair.name} indicates the current investor confidence and trading depth in the global currency markets. Sentiment analysis helps traders understand the prevailing bias and potential trend continuations.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-12">
                    {/* Chart Section */}
                    <div className="bg-white dark:bg-zinc-900/30 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="text-blue-500" /> Historical Buy Sentiment
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sentimentData}>
                                    <defs>
                                        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} stroke="#888" />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSentiment)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sentiment Meter Card */}
                    <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <div className="text-gray-500 dark:text-gray-400 text-sm mb-2 font-bold uppercase tracking-wider">Current Sentiment</div>
                            <div className="text-6xl font-bold text-blue-500">{sentimentData[sentimentData.length-1]?.value}%</div>
                            <div className="text-lg font-semibold mt-2">Bullish</div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-500" style={{ width: `${sentimentData[sentimentData.length-1]?.value}%` }}></div>
                                <div className="h-full bg-red-500" style={{ width: `${100 - sentimentData[sentimentData.length-1]?.value}%` }}></div>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-blue-500">BUY {sentimentData[sentimentData.length-1]?.value}%</span>
                                <span className="text-red-500">SELL {Math.round(100 - sentimentData[sentimentData.length-1]?.value)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Explanation Card */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <PieChart size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">What does Market Sentiment tell you?</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                    Market sentiment in Forex is a gauge of how the majority of traders are positioning themselves. It provides insights into the "crowd psychology" of the market.
                                </p>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                    <li><strong>Extremely Bullish (75%+):</strong> May indicate a potential reversal as fewer buyers are left.</li>
                                    <li><strong>Neutral (45% - 55%):</strong> Range-bound market with no clear directional bias.</li>
                                    <li><strong>Extremely Bearish (25%-):</strong> Potential "oversold" signal where contrarian traders look for buy opportunities.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-3 space-y-6">
                {/* Pair Summary Widget */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                    <h3 className="font-bold text-lg mb-1">{pair.name}</h3>
                    <div className="text-2xl font-bold mb-1">{pair.price}</div>
                    <div className={`text-sm font-medium ${!pair.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                        {!pair.isNegative && !pair.change?.toString().startsWith('+') ? '+' : ''}{pair.change}% today
                    </div>
                </div>

                {/* Trending Pairs Widget */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" /> Trending Pairs
                    </h3>
                    <div className="space-y-4">
                        {forex.filter(p=>p.symbol !== pair.symbol).slice(0, 5).map((p, i) => (
                            <Link key={i} href={`/forex/${p.symbol.replace('/', '-')}/market-cap`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-[10px] text-white flex items-center justify-center font-bold">
                                        {p.symbol.substring(0, 7)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{p.symbol}</span>
                                        <span className={`text-[10px] font-semibold ${!p.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                            {!p.isNegative && !p.change?.toString().startsWith('+') ? '+' : ''}{p.change}%
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: Forex market data is highly volatile and sentiment should be used alongside technical analysis.
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
