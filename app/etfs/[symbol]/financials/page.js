'use client';
import { useParams } from 'next/navigation';
import { useEtf } from '@/context/EtfContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data for ETFs
const generateEtfFinancials = (price) => {
    const years = ['2020', '2021', '2022', '2023', 'TTM'];
    return years.map((year, i) => {
        const factor = 1 + (i * 0.1);
        return {
            year,
            aum: (price * 1.5 * factor).toFixed(1), // Assets Under Management
            netFlows: (price * 0.2 * factor).toFixed(1)
        };
    });
};

export default function EtfFinancialsPage() {
  const { symbol } = useParams();
  const { getEtfBySymbol, etfs, loadEtfs } = useEtf();
  const [etf, setEtf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (etfs.length === 0) {
        loadEtfs();
        return;
    }
    const foundEtf = getEtfBySymbol(symbol?.toUpperCase());
    if (foundEtf) {
      setEtf(foundEtf);
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

  const financials = generateEtfFinancials(parseFloat(etf.price));
  const isPositive = !etf.isNegative;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      
      <div className="h-24"></div> 

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/etfs" className="hover:text-black dark:hover:text-white transition-colors">ETFs</Link>
           <span>/</span>
           <Link href={`/etfs/${etf.symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{etf.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">Financials</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold anta-regular mb-6">{etf.name} ({etf.symbol}) Financials</h1>
                    
                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800 pb-1">
                        {['Overview', 'Performance'].map(tab => (
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

                {/* Main Viz */}
                <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/30">
                    <h3 className="text-lg font-bold mb-6">Assets Under Management (Billions USD)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            < BarChart data={financials}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="aum" name="AUM (Billions)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="netFlows" name="Net Flows" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Data Table */}
                <div className="mb-12">
                     <h3 className="text-lg font-bold mb-4">Financial Summary</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Metric</th>
                                    {financials.map(f => <th key={f.year} className="px-6 py-4">{f.year}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">AUM (Billions USD)</td>
                                    {financials.map((f, i) => <td key={i} className="px-6 py-4 text-gray-600 dark:text-gray-400">${f.aum}B</td>)}
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">Net Flows (Billions USD)</td>
                                    {financials.map((f, i) => <td key={i} className="px-6 py-4 text-gray-600 dark:text-gray-400">${f.netFlows}B</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                     <h3 className="font-bold text-lg mb-1">{etf.name}</h3>
                     <div className="text-2xl font-bold mb-1">${etf.price}</div>
                     <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{etf.change} ({etf.changeValue})
                     </div>
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
