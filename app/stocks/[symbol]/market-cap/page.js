'use client';
import { useParams } from 'next/navigation';
import { useStock } from '@/context/StockContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { generateStockData } from '@/components/utils/stockGenerator';

// ... (keep imports)

export default function MarketCapPage() {
  const { symbol } = useParams();
  const { getStockBySymbol, stocks } = useStock();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundStock = getStockBySymbol(symbol?.toUpperCase());
    if (foundStock) {
      setStock(foundStock);
      setLoading(false);
    } else if (stocks.length > 0) {
      setLoading(false);
    }
  }, [symbol, stocks, getStockBySymbol]);

  const generatedData = stock ? generateStockData(stock) : null;
  const historyData = generatedData?.marketCapHistory || [];
  const currentCap = stock?.marketCap || (historyData[0]?.value ? `$${historyData[0].value}B` : 'N/A');

  if (loading || (stocks.length === 0 && !stock)) {
      // ... (keep loading state)
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
  }
  if (!stock) {
      // ... (keep 404 state)
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
        
        {/* Breadcrumb ... (keep) */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/stocks" className="hover:text-black dark:hover:text-white transition-colors">Stocks</Link>
           <span>/</span>
           <Link href={`/stocks/${stock.symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{stock.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">Market Cap</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <h1 className="text-3xl font-bold anta-regular mb-2">{stock.name} ({stock.symbol}) Market Cap</h1>
                <div className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                    {currentCap}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                    {stock.name} has a market capitalization of {currentCap}. Market capitalization refers to the total dollar market value of a company's outstanding shares of stock. Commonly referred to as "market cap," it is calculated by multiplying the total number of a company's outstanding shares by the current market price of one share.
                </p>

                {/* Chart Section */}
                <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/30">
                    <h3 className="text-xl font-bold mb-6">Market Cap History (Estimated Billions)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* What is Market Cap Card */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <PieChart size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3">What does Market Cap tell you?</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Market capitalization is one of the most important metrics for determining the size of a company. It helps investors understand the relative size of one company versus another.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                <li><strong>Large-cap ($100B+):</strong> Stable, established companies.</li>
                                <li><strong>Mid-cap ($2B - $10B):</strong> Growth potential with moderate risk.</li>
                                <li><strong>Small-cap ($300M - $2B):</strong> Higher growth potential but higher risk.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
                
                {/* Stock Summary Widget */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-900 text-[10px] text-white flex items-center justify-center font-bold">
                                {stock.symbol.substring(0, 4)}
                            </div>
                        </div>
                    </div>
                    <div>
                         <h3 className="font-bold text-lg mb-1">{stock.name}</h3>
                         <div className="text-2xl font-bold mb-1">${stock.price}</div>
                         <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{stock.change} ({stock.changeValue}) <span className="text-gray-400">today</span>
                         </div>
                    </div>
                </div>

                 {/* Top Companies Widget */}
                 <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Top Companies by Market Cap</h3>
                     <div className="space-y-4">
                        {stocks.slice(0, 5).map((s, i) => (
                            <Link key={i} href={`/stocks/${s.symbol}/market-cap`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="font-mono text-gray-400 w-4">{i + 1}</div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold group-hover:text-blue-500 transition-colors truncate max-w-[120px]">{s.name}</span>
                                        <span className="text-xs text-gray-500">{s.marketCap || 'N/A'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                
                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: Market data is provided for informational purposes only.
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
