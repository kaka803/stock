'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEtf } from '@/context/EtfContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Clock, Info, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

// Mock data for the chart
const generateMockData = (basePrice) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < 50; i++) {
    price = price * (1 + (Math.random() * 0.04 - 0.02)); 
    data.push({ value: price });
  }
  return data;
};

export default function EtfDetailPage() {
  const { symbol } = useParams();
  const { getEtfBySymbol, etfs, loadEtfs } = useEtf();
  const { user } = useAuth();
  const router = useRouter();
  const [etf, setEtf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    if (etfs.length === 0) {
        loadEtfs();
        return; 
    }
    
    const foundEtf = getEtfBySymbol(symbol?.toUpperCase()); 
    if (foundEtf) {
      setEtf(foundEtf);
      setChartData(generateMockData(parseFloat(foundEtf.price)));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [symbol, etfs, getEtfBySymbol, loadEtfs]);

  if (loading || (etfs.length === 0 && !etf)) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!etf) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white">
            ETF not found. <Link href="/etfs" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  const isPositive = !etf.isNegative;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      
      <div className="h-24"></div> 

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/etfs" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> ETFs
           </Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">{etf.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {['About', 'Financials', 'Market Cap', 'News'].map((item, i) => {
                    let href = `/etfs/${symbol}`;
                    if (item === 'Financials') href = `/etfs/${symbol}/financials`;
                    if (item === 'Market Cap') href = `/etfs/${symbol}/market-cap`;
                    if (item === 'News') href = `/etfs/${symbol}/news`;

                    const isActive = (item === 'About' && router.pathname === `/etfs/${symbol}`) || i === 0; // Simple check for now
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={href} className={className}>
                            {item}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Subpage Navigation (Horizontal Scroll) */}
            <div className="lg:hidden col-span-1 border-b border-gray-100 dark:border-zinc-800 mb-6 overflow-x-auto custom-scrollbar">
                <div className="flex whitespace-nowrap px-2 gap-4">
                    {['About', 'Financials', 'Market Cap', 'News'].map((item, i) => {
                        let href = `/etfs/${symbol}`;
                        if (item === 'Financials') href = `/etfs/${symbol}/financials`;
                        if (item === 'Market Cap') href = `/etfs/${symbol}/market-cap`;
                        if (item === 'News') href = `/etfs/${symbol}/news`;

                        const isActive = i === 0;
                        const className = `py-3 px-2 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`;
                        
                        return (
                            <Link key={i} href={href} className={className}>
                                {item}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Center Content */}
            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-indigo-900 text-xl text-white flex items-center justify-center font-bold">
                        {etf.symbol.substring(0, 4)}
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold anta-regular">{etf.name} ({etf.symbol})</h1>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-semibold">${etf.price}</span>
                            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive && !etf.change?.toString().startsWith('+') ? '+' : ''}{etf.change} ({etf.changeValue})
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
                                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
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
                     
                     {/* Timeframes */}
                     <div className="flex gap-4 mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-4">
                        {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((t, i) => (
                            <button key={t} className={`hover:text-black dark:hover:text-white ${i===0 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {t}
                            </button>
                        ))}
                     </div>
                </div>

                {/* About Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">About {etf.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {etf.name} is an Exchange Traded Fund. 
                        It provides investors with exposure to a basket of assets, such as stocks or bonds, 
                        offering diversification and professional management in a single investment.
                        Track {etf.symbol} for consistent market exposure.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">Frequently Asked Questions (FAQ)</h2>
                    <div className="space-y-4">
                         {[
                            {
                                question: `How do I buy ${etf.symbol} ETF?`,
                                answer: `To buy ${etf.name}, sign up for an account, add funds, search for ${etf.symbol}, and enter the amount you want to invest.`
                            },
                            {
                                question: "What are the benefits of ETFs?",
                                answer: "ETFs offer diversification, lower costs compared to many mutual funds, and flexibility as they can be traded throughout the day like stocks."
                            },
                            {
                                question: "Is there a minimum investment?",
                                answer: "You can start investing with as little as $1 through fractional shares."
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

            {/* Right Column - Buy Widget */}
            <div className="col-span-1 lg:col-span-3">
                <div className="sticky top-24 space-y-8">
                    {/* Buy Widget */}
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="text-xl font-bold mb-2">Buy {etf.symbol}</h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Invest in {etf.name} with ease.
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
                                    const qty = (parseFloat(investmentAmount) / parseFloat(etf.price));
                                    router.push(`/checkout?symbol=${etf.symbol}&type=etf&qty=${qty}&price=${etf.price}&total=${investmentAmount}`);
                                }
                            }}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity mb-4"
                        >
                            {user ? 'Buy Now' : 'Sign up to buy'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
