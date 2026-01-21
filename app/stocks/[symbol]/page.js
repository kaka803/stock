'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStock } from '@/context/StockContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Clock, Info, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

// Mock data for the chart to simulate the "green line" look
const generateMockData = (basePrice) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < 50; i++) {
    price = price * (1 + (Math.random() * 0.04 - 0.02)); // Random fluctuation
    data.push({ value: price });
  }
  return data;
};

export default function StockDetailPage() {
  const { symbol } = useParams();
  const { getStockBySymbol, stocks, loadStocks } = useStock();
  const { user } = useAuth();
  const router = useRouter();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    // Should fetch if context is empty
    if (stocks.length === 0) {
        loadStocks();
        return; // Wait for next render with data
    }
    
    // If we have stocks in context, try to find it
    const foundStock = getStockBySymbol(symbol?.toUpperCase()); // Ensure symbol is string
    if (foundStock) {
      setStock(foundStock);
      setChartData(generateMockData(parseFloat(foundStock.price)));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [symbol, stocks, getStockBySymbol, loadStocks]);

  if (loading || (stocks.length === 0 && !stock)) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stock) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-white">
            Stock not found. <Link href="/stocks" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  const isPositive = !stock.isNegative;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      
      <div className="h-24"></div> {/* Spacer */}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/stocks" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Stocks
           </Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">{stock.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {['About', 'Financials', 'Option chain', 'Market Cap', 'P/E ratio', 'News'].map((item, i) => {
                    let href = null;
                    if (item === 'Financials') href = `/stocks/${symbol}/financials`;
                    if (item === 'Option chain') href = `/stocks/${symbol}/option-chain`;
                    if (item === 'Market Cap') href = `/stocks/${symbol}/market-cap`;
                    if (item === 'P/E ratio') href = `/stocks/${symbol}/pe-ratio`;
                    if (item === 'News') href = `/stocks/${symbol}/news`;

                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${i===0 ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    if (href) {
                        return (
                            <Link key={i} href={href} className={className}>
                                {item}
                            </Link>
                        )
                    }
                    return (
                        <button key={i} className={className}>
                            {item}
                        </button>
                    )
                })}
            </div>

            {/* Mobile Subpage Navigation (Horizontal Scroll) */}
            <div className="lg:hidden col-span-1 border-b border-gray-100 dark:border-zinc-800 mb-6 overflow-x-auto custom-scrollbar">
                <div className="flex whitespace-nowrap px-2 gap-4">
                    {['About', 'Financials', 'Option chain', 'Market Cap', 'P/E ratio', 'News'].map((item, i) => {
                        let href = null;
                        if (item === 'Financials') href = `/stocks/${symbol}/financials`;
                        if (item === 'Option chain') href = `/stocks/${symbol}/option-chain`;
                        if (item === 'Market Cap') href = `/stocks/${symbol}/market-cap`;
                        if (item === 'P/E ratio') href = `/stocks/${symbol}/pe-ratio`;
                        if (item === 'News') href = `/stocks/${symbol}/news`;

                        const isActive = i === 0;
                        const className = `py-3 px-2 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`;
                        
                        if (href) {
                            return (
                                <Link key={i} href={href} className={className}>
                                    {item}
                                </Link>
                            )
                        }
                        return (
                            <button key={i} className={className}>
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Center Content */}
            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-blue-900 text-xl text-white flex items-center justify-center font-bold">
                        {stock.symbol.substring(0, 4)}
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold anta-regular">{stock.name} ({stock.symbol})</h1>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-semibold">${stock.price}</span>
                            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                {isPositive && !stock.change?.toString().startsWith('+') ? '+' : ''}{stock.change} ({stock.changeValue})
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
                    <h2 className="text-xl font-bold mb-4">About {stock.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {stock.name} is a publicly traded company. 
                        As a leader in its industry, it focuses on innovation and growth. 
                        Investors track {stock.symbol} for its market performance and potential dividends. 
                        (Note: Detail API data is limited, this is a placeholder description).
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12">
                    {[
                        { label: 'Market Cap', value: '$2.5T' },
                        { label: 'Revenue (TTM)', value: '$380B' },
                        { label: 'P/E Ratio', value: '32.5' },
                        { label: 'Dividend Yield', value: '0.5%' },
                    ].map((stat, i) => (
                        <div key={i} className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Info size={14}/> {stat.label}
                            </span>
                            <span className="font-semibold">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* How to Buy Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">How to buy {stock.name} stock</h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Sign up for a brokerage account', desc: `It's easy to get started. You can sign up for an account directly on our website or by downloading the app.` },
                            { title: 'Add funds to your account', desc: 'There are multiple ways to fund your account, from linking a bank account to making a deposit with a debit card or wire transfer.' },
                            { title: `Choose how much you'd like to invest in ${stock.symbol}`, desc: `Navigate to the Explore page. Then, type ${stock.symbol} into the search bar. When you see ${stock.name} appear in the results, tap it to open up the purchase screen.` },
                            { title: 'Manage your investments in one place', desc: `You can find your newly purchased ${stock.symbol} stock in your portfolio alongside the rest of your stocks, ETFs, crypto, treasuries, and alternative assets.` }
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
                    <h2 className="text-2xl font-bold mb-6 anta-regular">Frequently Asked Questions (FAQ)</h2>
                    <div className="space-y-4">
                         {[
                            {
                                question: "How do I buy stocks?",
                                answer: `To buy ${stock.name} stock, sign up for a brokerage account, add funds, search for ${stock.symbol}, and enter the amount you want to invest.`
                            },
                            {
                                question: "What is the minimum investment?",
                                answer: "You can invest as little as $1 with fractional shares, making it accessible for everyone to start investing."
                            },
                            {
                                question: "Are there fees for trading?",
                                answer: "We offer commission-free trading, so you keep more of your returns. Regulatory fees may apply."
                            },
                            {
                                question: `Is ${stock.name} a good investment?`,
                                answer: "All investments carry risk. We recommend doing your own research or consulting with a financial advisor before making investment decisions."
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

            {/* Right Column - Buy Widget & Popular Stocks */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-3">
                <div className="sticky top-24 space-y-8">
                    {/* Buy Widget */}
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="text-xl font-bold mb-2">Buy {stock.symbol}</h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Invest in {stock.name} with zero commission.
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
                                    const qty = (parseFloat(investmentAmount) / parseFloat(stock.price));
                                    router.push(`/checkout?symbol=${stock.symbol}&type=stock&qty=${qty}&price=${stock.price}&total=${investmentAmount}&isCustom=${stock.isCustom}`);
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

                    {/* Popular Stocks Sidebar */}
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-black">
                        <h3 className="text-lg font-bold mb-4">Popular Stocks</h3>
                        <div className="space-y-4">
                            {stocks.filter(s => s.symbol !== stock.symbol).slice(0, 10).map((s, i) => (
                                <Link key={i} href={`/stocks/${s.symbol}`} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-900 text-[10px] text-white flex items-center justify-center font-bold">
                                            {s.symbol.substring(0, 4)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{s.symbol}</span>
                                            <span className="text-xs text-gray-500 truncate max-w-[80px]">{s.name.substring(0, 10)}...</span>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-semibold ${!s.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                        {!s.isNegative && !s.change?.toString().startsWith('+') ? '+' : ''}{s.change}
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
