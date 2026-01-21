'use client';
import { useParams } from 'next/navigation';
import { useCrypto } from '@/context/CryptoContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, ExternalLink, TrendingUp } from 'lucide-react';

export default function CryptoNewsPage() {
  const { symbol } = useParams();
  const { getCryptoBySymbol, cryptos, loadCryptos } = useCrypto();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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

  // Rename for easier consistent usage
  const stock = crypto;

  if (loading || (cryptos.length === 0 && !stock)) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
  }
  if (!stock) {
     return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-white">
            Crypto not found. <Link href="/crypto" className="ml-2 text-blue-500 hover:underline">Go back</Link>
        </div>
    )
  }

  // Mock News Data for Crypto
  const isPositive = !stock.isNegative;
  const news = [
      {
          source: 'CoinDesk',
          time: '2 hours ago',
          title: `${stock.name} prices surge as market sentiment improves`,
          summary: `The price of ${stock.name} has seen a significant increase today following positive global economic news and increased adoption rates in emerging markets.`,
          category: 'Market News',
          image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop'
      },
      {
          source: 'CryptoSlate',
          time: '5 hours ago',
          title: `Technical analysis: ${stock.symbol} hits key resistance level`,
          summary: `Traders are watching ${stock.symbol} closely as it approaches a critical resistance point. A breakout could signal further gains.`,
          category: 'Analysis',
          image: 'https://images.unsplash.com/photo-1621504450168-bbb9e5d446f2?q=80&w=1964&auto=format&fit=crop'
      },
      {
          source: 'The Block',
          time: '1 day ago',
          title: `${stock.name} foundation announces new roadmap`,
          summary: `The roadmap outlines key upgrades for the network, focusing on scalability and security improvements for the next year.`,
          category: 'Press Release',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2032&auto=format&fit=crop'
      },
       {
          source: 'Decrypt',
          time: '1 day ago',
          title: `Institutional interest in ${stock.name} grows`,
          summary: `Hedge funds and asset managers are increasing their exposure to ${stock.name}, citing long-term value potential.`,
          category: 'Market News',
          image: 'https://images.unsplash.com/photo-1642229407357-12b234479075?q=80&w=2032&auto=format&fit=crop'
      }
  ];

  const filteredNews = filter === 'All' ? news : news.filter(n => n.category === filter);

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
           <span className="text-black dark:text-white font-semibold">News</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold anta-regular mb-2">{stock.name} ({stock.symbol}) News</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Stay updated with the latest headlines and announcements.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                    {['All', 'Market News', 'Press Release', 'Analysis'].map((cat) => (
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

                {/* News List */}
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
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {item.summary}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                    Read full story <ExternalLink size={14} className="ml-1" />
                                </div>
                            </div>

                        </div>
                    ))}
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

                 {/* Trending Stocks Widget */}
                 <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" />
                        Trending Assets
                    </h3>
                     <div className="space-y-4">
                        {cryptos.slice(0, 4).map((s, i) => (
                            <Link key={i} href={`/crypto/${s.symbol}`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                        {s.symbol.substring(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold group-hover:text-blue-500 transition-colors truncate max-w-[120px]">{s.name}</span>
                                    </div>
                                </div>
                                <div className={`text-xs font-semibold ${!s.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                    {!s.isNegative ? '+' : ''}{s.change}%
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                
                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: News aggregation is automated and may not reflect real-time events.
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}

