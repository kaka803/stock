'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCrypto } from '@/context/CryptoContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Info, ArrowRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { generateMockMarketCap, formatMarketCap } from '@/components/utils/cryptoHelpers';

// Mock data for chart - similar to stocks
const generateMockData = (basePrice) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < 50; i++) {
    price = price * (1 + (Math.random() * 0.04 - 0.02)); 
    data.push({ value: price });
  }
  return data;
};

export default function CryptoDetailPage() {
  const { symbol } = useParams();
  const { getCryptoBySymbol, cryptos, loadCryptos } = useCrypto();
  const { user } = useAuth();
  const router = useRouter();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    // Should fetch if context is empty
    if (cryptos.length === 0) {
        loadCryptos();
        return; // Wait for next render with data
    }
    
    // If we have cryptos in context, try to find it
    const foundCrypto = getCryptoBySymbol(symbol?.toUpperCase());
    if (foundCrypto) {
      setCrypto(foundCrypto);
      setChartData(generateMockData(parseFloat(foundCrypto.price)));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [symbol, cryptos, getCryptoBySymbol, loadCryptos]);

  if (loading || (cryptos.length === 0 && !loading && !crypto)) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!crypto) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white">
            Crypto not found. <Link href="/crypto" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  const isPositive = !crypto.isNegative;

  const displayMarketCap = crypto.marketCap 
    ? formatMarketCap(crypto.marketCap) 
    : formatMarketCap(generateMockMarketCap(crypto.symbol));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      
      <div className="h-24"></div> 

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/crypto" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Crypto
           </Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">{crypto.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {['Overview', 'Financials', 'Market Cap', 'News', 'Option chain', 'PE ratio'].map((item, i) => {
                    let href = `/crypto/${symbol}`;
                    if (item !== 'Overview') href += `/${item.toLowerCase().replace(' ', '-')}`;
                    
                    const isActive = i === 0; // Currently on Overview
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={href} className={className}>
                            {item}
                        </Link>
                    )
                })}
            </div>

            {/* Mobile Subpage Navigation (Horizontal Scroll) */}
            <div className="lg:hidden col-span-1 border-b border-gray-100 dark:border-zinc-800 mb-6 overflow-x-auto custom-scrollbar">
                <div className="flex whitespace-nowrap px-2 gap-4">
                    {['Overview', 'Financials', 'Market Cap', 'News', 'Option chain', 'PE ratio'].map((item, i) => {
                        let href = `/crypto/${symbol}`;
                        if (item !== 'Overview') href += `/${item.toLowerCase().replace(' ', '-')}`;
                        
                        const isActive = i === 0;
                        const className = `py-3 px-2 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`;
                        
                        return (
                            <Link key={i} href={href} className={className}>
                                {item}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-blue-600/10 text-xl flex items-center justify-center font-bold overflow-hidden">
                        {/* Try to use image if available, else text */}
                        <img src={crypto.image} alt={crypto.name} className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                        
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold anta-regular">{crypto.name} ({crypto.symbol})</h1>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-semibold">${parseFloat(crypto.price).toLocaleString()}</span>
                            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive && !crypto.change?.toString().startsWith('+') ? '+' : ''}{crypto.change}% ({crypto.changeValue})
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




                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12">
                    {[
                        { label: 'Market Cap', value: displayMarketCap },
                        { label: 'Volume (24h)', value: crypto.volume || 'N/A' },
                        { label: 'High (24h)', value: crypto.high || 'N/A' },
                        { label: 'Low (24h)', value: crypto.low || 'N/A' },
                    ].map((stat, i) => (
    // ...

                        <div key={i} className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Info size={14}/> {stat.label}
                            </span>
                            <span className="font-semibold">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* About Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">About {crypto.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {crypto.description || `${crypto.name} is a cryptocurrency trading on the open market. Values fluctuate based on supply and demand. It is one of the top assets by market capitalization.`}
                    </p>
                </div>
                
                {/* How to Buy Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">How to buy {crypto.name}</h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Create an account', desc: `Sign up on our platform to start trading ${crypto.name}.` },
                            { title: 'Link your bank', desc: 'Securely connect your bank account or use a credit card to deposit funds.' },
                            { title: `Buy ${crypto.symbol}`, desc: `Search for ${crypto.symbol} and place your order instantly.` },
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
                                question: `What is ${crypto.name}?`,
                                answer: `${crypto.name} is a digital asset designed to work as a medium of exchange.`
                            },
                            {
                                question: "Is it safe to invest?",
                                answer: "Cryptocurrency investments are volatile. Always do your own research."
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

            {/* Right Column - Buy Widget & Popular Cryptos */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-3">
                 <div className="sticky top-24 space-y-8">
                    {/* Buy Widget */}
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="text-xl font-bold mb-2">Buy {crypto.symbol}</h3>
                        <div className="space-y-4 mb-6">
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
                                    const qty = (parseFloat(investmentAmount) / parseFloat(crypto.price));
                                    router.push(`/checkout?symbol=${crypto.symbol}&type=crypto&qty=${qty}&price=${crypto.price}&total=${investmentAmount}`);
                                }
                            }}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity mb-4"
                        >
                            {user ? 'Buy Now' : 'Sign up to buy'}
                        </button>
                    </div>

                    {/* Popular Cryptos Sidebar */}
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-black">
                        <h3 className="text-lg font-bold mb-4">Popular Assets</h3>
                        <div className="space-y-4">
                            {cryptos.filter(c => c.symbol !== crypto.symbol).slice(0, 10).map((c, i) => (
                                <Link key={i} href={`/crypto/${c.symbol}`} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/10 text-[10px] text-blue-600 flex items-center justify-center font-bold overflow-hidden border border-gray-100 dark:border-zinc-800">
                                            {c.image ? 
                                                <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> :
                                                c.symbol.substring(0, 2)
                                            }
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{c.symbol}</span>
                                            <span className="text-xs text-gray-500 truncate max-w-[80px]">{c.name.substring(0, 10)}...</span>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-semibold ${!c.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                        {!c.isNegative && !c.change?.toString().startsWith('+') ? '+' : ''}{c.change}%
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
