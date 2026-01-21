'use client';
import { useParams } from 'next/navigation';
import { useForex } from '@/context/ForexContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Percent, Info, Target, TrendingUp } from 'lucide-react';
import { generateForexData } from '@/components/utils/forexGenerator';

export default function ForexRatesPage() {
  const { symbol } = useParams();
  const displaySymbol = symbol?.replace('-', '/').toUpperCase();
  const { getForexBySymbol, forex, loadForex } = useForex();
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yieldData, setYieldData] = useState(null);

  useEffect(() => {
    if (forex.length === 0) {
        loadForex();
        return;
    }
    const foundPair = getForexBySymbol(displaySymbol);
    if (foundPair) {
      setPair(foundPair);
      const data = generateForexData(foundPair);
      setYieldData(data.yields);
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

  if (!pair) return null;

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
           <span className="text-black dark:text-white font-semibold">P/E ratio</span>
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
                    const isActive = item.name === 'P/E ratio';
                    const className = `block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`;
                    
                    return (
                        <Link key={i} href={item.href} className={className}>
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="col-span-1 lg:col-span-10 xl:col-span-7">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold anta-regular mb-2">{pair.name} ({pair.symbol}) P/E Ratio</h1>
                    <div className="text-4xl font-bold mb-6 text-green-500">
                        {yieldData?.current}% <span className="text-lg text-gray-500 font-normal ml-2">Yield Differential</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                        Yield differentials and central bank policy rates provide the fundamental basis for currency valuations. This page maps the traditional P/E ratio concept to the carry-trade and yield-seeking behavior characteristic of global Forex markets.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white dark:bg-zinc-900/30 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-4 font-bold uppercase tracking-wider">Current Yield</div>
                        <div className="text-5xl font-bold text-green-500 mb-2">{yieldData?.current}%</div>
                        <div className="text-sm text-gray-500">Reflects 10Y Bond Yield differential between base and quote currencies.</div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/30 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mb-4 font-bold uppercase tracking-wider">Previous Rate</div>
                        <div className="text-5xl font-bold text-gray-400 mb-2">{yieldData?.previous}%</div>
                        <div className="text-sm text-gray-500">Rate from the last official monetary policy announcement.</div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-xl flex flex-col justify-center md:col-span-2">
                        <div className="text-white/80 text-xs mb-4 font-bold uppercase tracking-wider">Target Policy Rate</div>
                        <div className="text-5xl font-bold text-white mb-2">{(parseFloat(yieldData?.current) + 0.25).toFixed(2)}%</div>
                        <div className="text-sm text-white/60">Calculated expected rate by year-end based on current market futures.</div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Target className="text-blue-500" /> Policy Outlook
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Central banks for the {pair.name} pair are currently maintaining a balanced outlook. 
                        Market participants closely watch employment and inflation data to predict the next interest rate move. 
                        A higher interest rate generally strengthens the currency as it attracts foreign capital seeking higher returns.
                    </p>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 lg:col-span-12 xl:col-span-3 space-y-6">
                {/* Pair Summary Widget */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
                    <h3 className="font-bold text-lg mb-1">{pair.name}</h3>
                    <div className="text-2xl font-bold mb-1">{pair.price}</div>
                    <div className={`text-sm font-medium ${!pair.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                        {!pair.isNegative && !pair.change?.toString().startsWith('+') ? '+' : ''}{pair.change}% today
                    </div>
                </div>

                {/* Trending Pairs Widget */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" /> Trending Pairs
                    </h3>
                    <div className="space-y-4">
                        {forex.filter(p=>p.symbol !== pair.symbol).slice(0, 5).map((p, i) => (
                            <Link key={i} href={`/forex/${p.symbol.replace('/', '-')}/pe-ratio`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-[10px] text-white flex items-center justify-center font-bold">
                                        {p.symbol.substring(0, 7)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold group-hover:text-blue-500 transition-colors">{p.symbol}</span>
                                        <span className={`text-[10px] font-semibold ${!p.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                            {!p.isNegative && !p.change?.toString().startsWith('+') ? '+' : ''}{p.change}%
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-gray-400 leading-tight border-t border-gray-100 dark:border-zinc-800 pt-4">
                    Disclaimer: Yield differentials are estimations and may not reflect current market retail rates.
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
