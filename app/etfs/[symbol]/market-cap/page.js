'use client';
import { useParams } from 'next/navigation';
import { useEtf } from '@/context/EtfContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateEtfMarketCap = (price) => {
    const years = ['2019', '2020', '2021', '2022', '2023'];
    return years.map((year, i) => ({
        year,
        marketCap: (price * 10 * (1 + (i * 0.15))).toFixed(1)
    }));
};

export default function EtfMarketCapPage() {
  const { symbol } = useParams();
  const { getEtfBySymbol, etfs, loadEtfs } = useEtf();
  const [etf, setEtf] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const marketCapData = generateEtfMarketCap(parseFloat(etf.price));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <Navbar />
      <div className="h-24"></div> 
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/etfs" className="hover:text-black dark:hover:text-white transition-colors">ETFs</Link>
           <span>/</span>
           <Link href={`/etfs/${etf.symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{etf.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">Market Cap</span>
        </div>
        <h1 className="text-3xl font-bold anta-regular mb-12">{etf.name} Market Capitalization</h1>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm mb-12">
            <h3 className="text-xl font-bold mb-8">Historical Market Cap (Billions USD)</h3>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketCapData}>
                        <defs>
                            <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Area type="monotone" dataKey="marketCap" name="Market Cap" stroke="#6366f1" fillOpacity={1} fill="url(#colorCap)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
