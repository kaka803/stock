'use client';
import { useParams } from 'next/navigation';
import { useEtf } from '@/context/EtfContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function EtfNewsPage() {
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

  const news = [
    { title: `${etf.name} shows steady growth in recent quarter`, date: '2 hours ago', source: 'Market Insight' },
    { title: `Top 5 Reasons to hold ${etf.symbol} in your portfolio`, date: '5 hours ago', source: 'Finance Daily' },
    { title: `Market analysts update outlook for ${etfs[0]?.symbol || 'ETFs'}`, date: '1 day ago', source: 'Global Markets' },
    { title: `Investors flock to ${etf.symbol} amid market volatility`, date: '2 days ago', source: 'Investor Weekly' }
  ];

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
           <span className="text-black dark:text-white font-semibold">News</span>
        </div>
        <h1 className="text-3xl font-bold anta-regular mb-12">{etf.name} Latest News</h1>
        <div className="space-y-6">
            {news.map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition-colors">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
