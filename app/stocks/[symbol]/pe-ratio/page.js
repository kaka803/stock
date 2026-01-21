'use client';
import { useParams } from 'next/navigation';
import { useStock } from '@/context/StockContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { generateStockData } from '@/components/utils/stockGenerator';

export default function PeRatioPage() {
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
  const peData = generatedData?.pe || { current: '25.00', industry: '22.00' };
  
  const peComparisonData = [
    { name: 'This Stock', value: parseFloat(peData.current) },
    { name: 'Industry Avg', value: parseFloat(peData.industry) },
    { name: 'S&P 500', value: 24.5 },
  ];

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
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/stocks" className="hover:text-black dark:hover:text-white transition-colors">Stocks</Link>
           <span>/</span>
           <Link href={`/stocks/${stock.symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{stock.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">P/E Ratio</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <h1 className="text-3xl font-bold anta-regular mb-2">{stock.name} ({stock.symbol}) P/E Ratio</h1>
                <div className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                    {peData.current} 
                    <span className="text-lg text-gray-500 font-normal ml-2">(Trailing 12M)</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                    The Price-to-Earnings (P/E) ratio measures a company's current share price relative to its per-share earnings. It is widely used by investors to determine the relative value of a company's shares in an apples-to-apples comparison.
                </p>

                {/* Comparison Chart Section */}
                <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/30">
                    <h3 className="text-xl font-bold mb-6">P/E Ratio Comparison</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peComparisonData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                    {peComparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#3f3f46'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        {stock.symbol}'s P/E ratio compared to Industry Average and S&P 500.
                    </p>
                </div>

                {/* Educational Card */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-8 mb-12 border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-xl text-gray-700 dark:text-gray-300">
                            <Info size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3">Understanding P/E Ratio</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                A high P/E ratio could mean that a company's stock is over-valued, or else that investors are expecting high growth rates in the future.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-zinc-800">
                                    <h4 className="font-bold text-green-600 mb-1">High P/E</h4>
                                    <p className="text-sm text-gray-500">Often seen in growth stocks or tech companies where future earnings are expected to grow significantly.</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-zinc-800">
                                    <h4 className="font-bold text-blue-600 mb-1">Low P/E</h4>
                                    <p className="text-sm text-gray-500">Could indicate a "value" stock or a company in a mature industry with slower growth.</p>
                                </div>
                            </div>
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

                 {/* Other Ratios Widget */}
                 <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Other Valuation Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">P/S Ratio</span>
                            <span className="font-mono font-medium">6.42</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">P/B Ratio</span>
                            <span className="font-mono font-medium">12.8</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">PEG Ratio</span>
                            <span className="font-mono font-medium">1.2</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">Div Yield</span>
                            <span className="font-mono font-medium">0.52%</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: Financial metrics are for educational purposes.
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
