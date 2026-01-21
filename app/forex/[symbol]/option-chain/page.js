'use client';
import { useParams } from 'next/navigation';
import { useForex } from '@/context/ForexContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Layers, TrendingUp } from 'lucide-react';
import { generateForexData } from '@/components/utils/forexGenerator';

export default function ForexOptionsPage() {
  const { symbol } = useParams();
  const displaySymbol = symbol?.replace('-', '/').toUpperCase();
  const { getForexBySymbol, forex, loadForex } = useForex();
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (forex.length === 0) {
        loadForex();
        return;
    }
    const foundPair = getForexBySymbol(displaySymbol);
    if (foundPair) {
      setPair(foundPair);
      const data = generateForexData(foundPair);
      setOptions(data.options);
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
           <span className="text-black dark:text-white font-semibold">Option chain</span>
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
                    const isActive = item.name === 'Option chain';
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
                    <h1 className="text-3xl font-bold anta-regular mb-2">{pair.name} ({pair.symbol}) Option Chain</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">Current derivative prices and open interest for {pair.symbol}. FX options provide traders with the right, but not the obligation, to exchange one currency for another at a specified exchange rate on or before a specified date.</p>
                </div>

                <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-900 text-left text-[10px] uppercase font-bold tracking-wider text-gray-500">
                                    <th className="p-4 border-b border-gray-200 dark:border-zinc-800">Calls Price</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-zinc-800">Calls OI</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-zinc-800 text-center bg-blue-50/50 dark:bg-blue-900/10">Strike</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-zinc-800">Puts Price</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-zinc-800">Puts OI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {options.map((opt, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="p-4 text-green-500 font-medium">{opt.call.price}</td>
                                        <td className="p-4 text-xs text-gray-500">{opt.call.oi.toLocaleString()}</td>
                                        <td className="p-4 text-center font-bold bg-blue-50/20 dark:bg-blue-900/5">{opt.strike}</td>
                                        <td className="p-4 text-red-500 font-medium">{opt.put.price}</td>
                                        <td className="p-4 text-xs text-gray-500">{opt.put.oi.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Layers size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3">Understanding FX Options</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                FX options are used by corporations to hedge against currency risk and by speculators looking to profit from exchange rate fluctuations. 
                                Unlike spot forex, options have a defined expiration date and strike price, offering a different profile of risk and reward.
                            </p>
                        </div>
                    </div>
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

                {/* Explore Other Options Widget */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-500" /> Other Option Chains
                    </h3>
                    <div className="space-y-4">
                        {forex.filter(p=>p.symbol !== pair.symbol).slice(0, 5).map((p, i) => (
                            <Link key={i} href={`/forex/${p.symbol.replace('/', '-')}/option-chain`} className="flex items-center justify-between group">
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
                    Disclaimer: FX options are complex derivatives. Please ensure you understand the risks before trading.
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
