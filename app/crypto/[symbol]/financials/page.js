'use client';
import { useParams } from 'next/navigation';
import { useCrypto } from '@/context/CryptoContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CryptoFinancialsPage() {
  const { symbol } = useParams();
  const { getCryptoBySymbol, cryptos, loadCryptos } = useCrypto();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Income');

  useEffect(() => {
    if (cryptos.length === 0) {
        loadCryptos();
        return;
    }
    const foundCrypto = getCryptoBySymbol(symbol?.toUpperCase());
    if (foundCrypto) {
      setCrypto(foundCrypto);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [symbol, cryptos, getCryptoBySymbol, loadCryptos]);

  if (loading || (cryptos.length === 0 && !stock)) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renaming for easier copy-paste consistency, though 'crypto' is used
  const stock = crypto; 

  if (!stock) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-white">
            Crypto not found. <Link href="/crypto" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  // Mock Financial Data for Crypto (Simulated)
  const isPositive = !stock.isNegative;
  const baseRev = stock.price * 100000; // Fake revenue based on price
  const financials = [
    { year: '2020', revenue: (baseRev * 0.5 / 1e9).toFixed(2), netIncome: (baseRev * 0.1 / 1e9).toFixed(2) },
    { year: '2021', revenue: (baseRev * 0.8 / 1e9).toFixed(2), netIncome: (baseRev * 0.3 / 1e9).toFixed(2) },
    { year: '2022', revenue: (baseRev * 1.2 / 1e9).toFixed(2), netIncome: (baseRev * 0.5 / 1e9).toFixed(2) },
    { year: '2023', revenue: (baseRev * 0.9 / 1e9).toFixed(2), netIncome: (baseRev * 0.4 / 1e9).toFixed(2) },
    { year: 'TTM', revenue: (baseRev * 1.1 / 1e9).toFixed(2), netIncome: (baseRev * 0.45 / 1e9).toFixed(2) },
  ];

  const renderTable = () => {
      let rows = [];
      const years = financials.map(f => f.year);
      
      if (activeTab === 'Income') {
          rows = [
              { name: 'Total Revenue', values: financials.map(f => `$${f.revenue}B`) },
              { name: 'Cost of Revenue', values: financials.map(f => `$${(f.revenue * 0.2).toFixed(2)}B`) },
              { name: 'Gross Profit', values: financials.map(f => `$${(f.revenue * 0.8).toFixed(2)}B`) },
              { name: 'Operating Expenses', values: financials.map(f => `$${(f.revenue * 0.3).toFixed(2)}B`) },
              { name: 'Net Income', values: financials.map(f => `$${f.netIncome}B`) },
          ];
      } else if (activeTab === 'Balance Sheet') {
           rows = [
              { name: 'Total Assets', values: financials.map(f => `$${(f.revenue * 2.5).toFixed(2)}B`) },
              { name: 'Total Liabilities', values: financials.map(f => `$${(f.revenue * 0.8).toFixed(2)}B`) },
              { name: 'Total Equity', values: financials.map(f => `$${(f.revenue * 1.7).toFixed(2)}B`) },
              { name: 'Cash & Equivalents', values: financials.map(f => `$${(f.revenue * 0.5).toFixed(2)}B`) },
              { name: 'Long Term Debt', values: financials.map(f => `$${(f.revenue * 0.4).toFixed(2)}B`) },
          ];
      } else {
          rows = [
              { name: 'Operating Cash Flow', values: financials.map(f => `$${(f.netIncome * 1.2).toFixed(2)}B`) },
              { name: 'Investing Cash Flow', values: financials.map(f => `-$${(f.revenue * 0.15).toFixed(2)}B`) },
              { name: 'Financing Cash Flow', values: financials.map(f => `-$${(f.revenue * 0.05).toFixed(2)}B`) },
              { name: 'Free Cash Flow', values: financials.map(f => `$${(f.netIncome * 0.95).toFixed(2)}B`) },
          ];
      }

      return (
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500">
                      <tr>
                          <th className="px-6 py-4 rounded-l-xl">Breakdown</th>
                          {years.map(y => <th key={y} className="px-6 py-4">{y}</th>)}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="px-6 py-4 font-medium">{row.name}</td>
                              {row.values.map((val, j) => (
                                  <td key={j} className="px-6 py-4 text-gray-600 dark:text-gray-400">{val}</td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      
      <div className="h-24"></div> 

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/crypto" className="hover:text-black dark:hover:text-white transition-colors">Crypto</Link>
           <span>/</span>
           <Link href={`/crypto/${stock.symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{stock.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">Financials</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold anta-regular mb-6">{stock.name} ({stock.symbol}) Financials</h1>
                    
                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800 pb-1">
                        {['Income', 'Balance Sheet', 'Cash Flow'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 text-sm font-medium transition-colors relative ${
                                    activeTab === tab 
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Viz - Only for Income for now */}
                {activeTab === 'Income' && (
                    <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/30">
                        <h3 className="text-lg font-bold mb-6">Revenue & Net Income (Billions USD)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financials}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="netIncome" name="Net Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="mb-12">
                     <h3 className="text-lg font-bold mb-4">{activeTab} Statement</h3>
                     {renderTable()}
                </div>

            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
                
                {/* Stock Summary Widget */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-blue-600/10 text-xl flex items-center justify-center font-bold overflow-hidden">
                                <img src={stock.image} alt={stock.name} className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                            </div>
                        </div>
                    </div>
                    <div>
                         <h3 className="font-bold text-lg mb-1">{stock.name}</h3>
                         <div className="text-2xl font-bold mb-1">${parseFloat(stock.price).toLocaleString()}</div>
                         <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{stock.change}% ({stock.changeValue}) <span className="text-gray-400">today</span>
                         </div>
                    </div>
                </div>

                 {/* Key Ratios Widget */}
                 <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Key Financial Ratios</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">Profit Margin</span>
                            <span className="font-mono font-medium text-green-500">26.1%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">Return on Equity</span>
                            <span className="font-mono font-medium text-green-500">147.2%</span>
                        </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="text-sm text-gray-500">Debt / Equity</span>
                            <span className="font-mono font-medium">1.76</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">Current Ratio</span>
                            <span className="font-mono font-medium">0.94</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: Financial data is delayed.
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
