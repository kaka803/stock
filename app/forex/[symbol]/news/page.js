'use client';
import { useParams } from 'next/navigation';
import { useForex } from '@/context/ForexContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Newspaper, ExternalLink, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { generateForexData } from '@/components/utils/forexGenerator';

export default function ForexNewsPage() {
  const { symbol } = useParams();
  const displaySymbol = symbol?.replace('-', '/').toUpperCase();
  const { getForexBySymbol, forex, loadForex } = useForex();
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (forex.length === 0) {
        loadForex();
        return;
    }
    const foundPair = getForexBySymbol(displaySymbol);
    if (foundPair) {
      setPair(foundPair);
      const data = generateForexData(foundPair);
      setNews(data.news);
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
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-white">
            Forex pair not found. <Link href="/forex" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  const isPositive = !pair.isNegative;
  const filteredNews = filter === 'All' ? news : news.filter(n => n.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
           <Link href="/forex" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             <ArrowLeft size={16} /> Forex
           </Link>
           <span>/</span>
           <Link href={`/forex/${symbol}`} className="hover:text-black dark:hover:text-white transition-colors">{pair.name}</Link>
           <span>/</span>
           <span className="text-black dark:text-white font-semibold">News</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden lg:block col-span-2 space-y-2 sticky top-24 h-fit">
                {[
                    { name: 'About', href: `/forex/${symbol}` },
                    { name: 'Financials', href: `/forex/${symbol}/financials` },
                    { name: 'Option chain', href: `/forex/${symbol}/option-chain` },
                    { name: 'Market Cap', href: `/forex/${symbol}/market-cap` },
                    { name: 'P/E ratio', href: `/forex/${symbol}/pe-ratio` },
                    { name: 'News', href: `/forex/${symbol}/news` }
                ].map((item, i) => {
                    const isActive = item.name === 'News';
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={item.href} className={className}>
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold anta-regular mb-2">{pair.name} ({pair.symbol}) News</h1>
                    <p className="text-gray-500 dark:text-gray-400">Global currency market headlines and analysis.</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                    {['All', 'Market News', 'Economic Report', 'Analysis'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                filter === cat 
                                ? 'bg-black dark:bg-white text-white dark:text-black' 
                                : 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {filteredNews.map((item, i) => (
                        <div key={i} className="group border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 bg-white dark:bg-zinc-900/30 hover:border-blue-500/50 transition-colors flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-zinc-800">
                                <img src={item.image} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col justify-between grow">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                            {item.source}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> {item.time}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors leading-snug">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.summary}</p>
                                </div>
                                <div className="mt-4 flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read more <ExternalLink size={14} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-1 lg:col-span-12 xl:col-span-3 space-y-6">
                 <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                    <h3 className="font-bold text-lg mb-1">{pair.name}</h3>
                    <div className="text-2xl font-bold mb-1">{pair.price}</div>
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive && !pair.change?.toString().startsWith('+') ? '+' : ''}{pair.change.toString().replace('%', '')}% today
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" /> Trending Pairs
                    </h3>
                    <div className="space-y-4">
                        {forex.filter(p=>p.symbol !== pair.symbol).slice(0, 4).map((p, i) => (
                            <Link key={i} href={`/forex/${p.symbol.replace('/', '-')}`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-[10px] text-white flex items-center justify-center font-bold">
                                        {p.symbol.substring(0, 7)}
                                    </div>
                                    <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{p.symbol}</span>
                                </div>
                                <div className={`text-xs font-semibold ${!p.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                    {!p.isNegative && !p.change?.toString().startsWith('+') ? '+' : ''}{p.change.toString().replace('%', '')}%
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
