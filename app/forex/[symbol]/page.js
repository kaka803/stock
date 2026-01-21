'use client';
import { useParams, useRouter } from 'next/navigation';
import { useForex } from '@/context/ForexContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Clock, Info, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

// Mock data for the chart to simulate the "green line" look
const generateMockData = (basePrice) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < 50; i++) {
    price = price * (1 + (Math.random() * 0.004 - 0.002)); // Random fluctuation (smaller for forex)
    data.push({ value: price });
  }
  return data;
};

export default function ForexDetailPage() {
  let { symbol } = useParams();
  // Forex symbols in URL are EUR-USD, but in API they are EUR/USD
  const displaySymbol = symbol?.replace('-', '/').toUpperCase();
  
  const { getForexBySymbol, forex, loadForex } = useForex();
  const { user } = useAuth();
  const router = useRouter();
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    if (forex.length === 0) {
        loadForex();
        return;
    }
    
    const foundPair = getForexBySymbol(displaySymbol);
    if (foundPair) {
      setPair(foundPair);
      setChartData(generateMockData(parseFloat(foundPair.price)));
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

  if (!pair) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            Currency pair not found. <Link href="/forex" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  const isPositive = !pair.isNegative;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/forex" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Forex
           </Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">{pair.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {[
                    { name: 'About', href: '#' },
                    { name: 'Financials', href: `/forex/${symbol}/financials` },
                    { name: 'Option chain', href: `/forex/${symbol}/option-chain` },
                    { name: 'Market Cap', href: `/forex/${symbol}/market-cap` },
                    { name: 'P/E ratio', href: `/forex/${symbol}/pe-ratio` },
                    { name: 'News', href: `/forex/${symbol}/news` }
                ].map((item, i) => {
                    const isActive = i === 0;
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={item.href} className={className}>
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Mobile Subpage Navigation (Horizontal Scroll) */}
            <div className="lg:hidden col-span-1 border-b border-gray-100 dark:border-zinc-800 mb-6 overflow-x-auto custom-scrollbar">
                <div className="flex whitespace-nowrap px-2 gap-4">
                    {[
                        { name: 'About', href: '#' },
                        { name: 'Financials', href: `/forex/${symbol}/financials` },
                        { name: 'Option chain', href: `/forex/${symbol}/option-chain` },
                        { name: 'Market Cap', href: `/forex/${symbol}/market-cap` },
                        { name: 'P/E ratio', href: `/forex/${symbol}/pe-ratio` },
                        { name: 'News', href: `/forex/${symbol}/news` }
                    ].map((item, i) => {
                        const isActive = i === 0;
                        const className = `py-3 px-2 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`;
                        
                        return (
                            <Link key={i} href={item.href} className={className}>
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Center Content */}
            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-indigo-900 text-xl text-white flex items-center justify-center font-bold">
                        {pair.symbol.substring(0, 7)}
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold anta-regular">{pair.name} ({pair.symbol})</h1>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-semibold">{pair.price}</span>
                            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive && !pair.change?.toString().startsWith('+') ? '+' : ''}{pair.change}% ({pair.changeValue})
                            </span>
                        </div>
                     </div>
                </div>

                {/* Chart Area */}
                <div className="h-[300px] w-full mb-12 relative group rounded-2xl border border-gray-100 dark:border-zinc-800 p-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                           <YAxis domain={['auto', 'auto']} hide />
                           <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value) => [value.toFixed(4), 'Price']}
                           />
                           <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={isPositive ? "#22c55e" : "#ef4444"} 
                                strokeWidth={2} 
                                dot={false} 
                            />
                        </LineChart>
                     </ResponsiveContainer>
                     
                     <div className="flex gap-4 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-4">
                        {['1H', '4H', '1D', '1W', '1M'].map((t, i) => (
                            <button key={t} className={`hover:text-black dark:hover:text-white ${i===2 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {t}
                            </button>
                        ))}
                     </div>
                </div>

                {/* About Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">About {pair.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        The {pair.name} currency pair represents the relative value of one currency against another. 
                        In the forex market, {pair.symbol.split('/')[0]} is the base currency and {pair.symbol.split('/')[1]} is the quote currency. 
                        Traders use this pair to speculate on the economic strength of the respective countries or regions.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12">
                    {[
                        { label: 'High', value: pair.high },
                        { label: 'Low', value: pair.low },
                        { label: 'Open', value: pair.open },
                        { label: 'Liquidity', value: 'High' },
                    ].map((stat, i) => (
                        <div key={i} className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Info size={14}/> {stat.label}
                            </span>
                            <span className="font-semibold">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* How to Trade Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">How to trade {pair.name}</h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Open a Trading Account', desc: 'Securely register and verify your identity to access the global forex market.' },
                            { title: 'Deposit Funds', desc: 'Fund your account using various payment methods to start trading currency pairs.' },
                            { title: `Analyze ${pair.symbol}`, desc: 'Use technical and fundamental analysis to determine the best entry and exit points.' },
                            { title: 'Execute your Trade', desc: 'Place a buy or sell order based on your market outlook and manage your risk.' }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </span>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                         {[
                            {
                                question: `What drives the price of ${pair.symbol}?`,
                                answer: "Currency prices are driven by economic data (GDP, inflation), interest rate decisions by central banks, and geopolitical events."
                            },
                            {
                                question: "What is a 'pip' in forex?",
                                answer: "A pip is the smallest price move that an exchange rate can make. For most pairs, it's the fourth decimal place."
                            },
                            {
                                question: "What is leverage?",
                                answer: "Leverage allows you to control a large position with a relatively small amount of capital. It increases both potential profits and risks."
                            }
                         ].map((item, i) => (
                            <div key={i} className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                                >
                                    {item.question}
                                    <ArrowRight size={16} className={`text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-90 text-blue-500' : ''}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                         ))}
                    </div>
                </div>

            </div>

            {/* Right Column - Trade Widget & Popular Pairs */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-3">
                <div className="sticky top-24 space-y-8">
                    {/* Buy Widget */}
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="text-xl font-bold mb-2">Buy {pair.symbol}</h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Invest in {pair.name} with zero commission.
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm font-medium mb-1">
                                <span>Buy in</span>
                                <span className="text-blue-500">Dollars</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 rounded-xl py-3 pl-8 pr-4 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                if (!user) {
                                    router.push('/signup');
                                } else {
                                    if (!investmentAmount || parseFloat(investmentAmount) <= 0) return;
                                    const qty = (parseFloat(investmentAmount) / parseFloat(pair.price));
                                    router.push(`/checkout?symbol=${pair.symbol}&type=forex&qty=${qty}&price=${pair.price}&total=${investmentAmount}`);
                                }
                            }}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity mb-4"
                        >
                            {user ? 'Buy Now' : 'Sign up to buy'}
                        </button>
                        
                        <div className="text-xs text-center text-gray-400 leading-tight">
                            Market orders are executed at the best available price.
                        </div>
                    </div>

                    {/* Popular Pairs Sidebar */}
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-black">
                        <h3 className="text-lg font-bold mb-4">Popular Pairs</h3>
                        <div className="space-y-4">
                            {forex.filter(p => p.symbol !== pair.symbol).slice(0, 8).map((p, i) => (
                                <Link key={i} href={`/forex/${p.symbol.replace('/', '-')}`} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-900 text-[10px] text-white flex items-center justify-center font-bold">
                                            {p.symbol.substring(0, 7)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{p.symbol}</span>
                                            <span className="text-xs text-gray-500">{p.price}</span>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-semibold ${!p.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                        {!p.isNegative ? '+' : ''}{p.change}%
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
