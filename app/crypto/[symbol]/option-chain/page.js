'use client';
import { useParams } from 'next/navigation';
import { useCrypto } from '@/context/CryptoContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { DollarSign, BarChart2 } from 'lucide-react';

export default function CryptoOptionChainPage() {
  const { symbol } = useParams();
  const { getCryptoBySymbol, cryptos, loadCryptos } = useCrypto();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Mock Option Data for Crypto
  const isPositive = !stock.isNegative;
  const currentPrice = stock.price;
  const options = [];
  for(let i=-2; i<=2; i++) {
        const strike = Math.floor(currentPrice * (1 + (i*0.05)));
        options.push({
            strike: strike,
            call: { price: (strike * 0.05).toFixed(2), vol: Math.floor(Math.random() * 500) },
            put: { price: (strike * 0.04).toFixed(2), vol: Math.floor(Math.random() * 500) }
        });
  }


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
           <span className="text-black dark:text-white font-semibold">Option Chain</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
                
                <h1 className="text-3xl font-bold anta-regular mb-4">{stock.name} ({stock.symbol}) Options Chain</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl">
                    Explore the latest options chain data for {stock.name} ({stock.symbol}). 
                    Below are the generated real-time option strikes, calls, and puts.
                    <br />
                    <span className="text-xs mt-2 block text-gray-500">Options are risky and may not be suitable for all investors. <Link href="#" className="text-blue-500 hover:underline">See risk</Link></span>
                </p>

                {/* Option Chain Table */}
                <div className="mb-12 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3" colSpan="3">Calls</th>
                                    <th className="px-4 py-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">Strike</th>
                                    <th className="px-4 py-3" colSpan="3">Puts</th>
                                </tr>
                                <tr className="text-xs uppercase tracking-wider border-t border-gray-200 dark:border-zinc-800">
                                    <th className="px-2 py-2">Bid</th>
                                    <th className="px-2 py-2">Ask</th>
                                    <th className="px-2 py-2">Vol</th>
                                    <th className="px-4 py-2 bg-gray-100 dark:bg-zinc-800"></th>
                                    <th className="px-2 py-2">Bid</th>
                                    <th className="px-2 py-2">Ask</th>
                                    <th className="px-2 py-2">Vol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {options.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-2 py-3 text-green-600 dark:text-green-400">{row.call.price}</td>
                                        <td className="px-2 py-3 text-green-600 dark:text-green-400">{(parseFloat(row.call.price) + 0.05).toFixed(2)}</td>
                                        <td className="px-2 py-3 text-gray-500">{row.call.vol}</td>
                                        <td className="px-4 py-3 font-bold bg-gray-50 dark:bg-zinc-800/50">{row.strike}</td>
                                        <td className="px-2 py-3 text-red-600 dark:text-red-400">{row.put.price}</td>
                                        <td className="px-2 py-3 text-red-600 dark:text-red-400">{(parseFloat(row.put.price) + 0.05).toFixed(2)}</td>
                                        <td className="px-2 py-3 text-gray-500">{row.put.vol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Functionality Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Order Flow Rebates */}
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900/50">
                        <div>
                             <div className="flex gap-4 mb-6 justify-center">
                                 <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                                     <DollarSign size={24} className="text-blue-500"/>
                                 </div>
                                 <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center -ml-8 bg-white dark:bg-black">
                                     <DollarSign size={24} className="text-blue-500"/>
                                 </div>
                             </div>
                             <h3 className="text-lg font-bold mb-2">Order Flow Rebates</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                 We share 50% of our options order flow revenue with you on every trade, reducing your trading costs.
                             </p>
                        </div>
                        <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold w-fit hover:opacity-80 transition-opacity">
                            Learn more
                        </button>
                    </div>

                    {/* Options Resource Center */}
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900/50">
                        <div>
                             <div className="flex gap-2 mb-6 justify-center h-16 items-center">
                                 <BarChart2 size={40} className="text-blue-500 opacity-50"/>
                                 <BarChart2 size={40} className="text-blue-500"/>
                                 <BarChart2 size={40} className="text-blue-500 opacity-50"/>
                             </div>
                             <h3 className="text-lg font-bold mb-2">Options Resource Center</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                 Explore our comprehensive library of guides to Options trading strategies.
                             </p>
                        </div>
                        <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold w-fit hover:opacity-80 transition-opacity">
                            Explore Resources
                        </button>
                    </div>
                </div>

                {/* How to Buy Section (Reused) */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 anta-regular">How to buy {stock.name} options</h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Sign up for a brokerage account', desc: `It's easy to get started. You can sign up for an account directly on our website or by downloading the app.` },
                            { title: 'Add funds to your account', desc: 'There are multiple ways to fund your account, from linking a bank account to making a deposit with a debit card or wire transfer.' },
                            { title: `Choose your option strategy`, desc: `Navigate to the Explore page. Then, type ${stock.symbol} into the search bar.` },
                            { title: 'Manage your investments in one place', desc: `You can find your newly purchased ${stock.symbol} options in your portfolio.` }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </span>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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

                {/* Buy Options Widget */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 leading-tight">Buy {stock.name} ({stock.symbol}) Call and Put Options</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Explore the options chain and buy {stock.name} ({stock.symbol}) calls and puts. 
                        There are no commissions or pre-contract fees to trade options on our platform.
                    </p>
                    <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-bold text-sm hover:opacity-80 transition-opacity">
                        Trade {stock.symbol} Options
                    </button>
                    <div className="mt-2 text-center">
                         <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">Option Prices</span>
                    </div>
                </div>

                {/* Explore other options chain */}
                <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Explore other assets</h3>
                     <div className="space-y-4">
                        {cryptos.slice(0, 6).map((s, i) => (
                            <Link key={i} href={`/crypto/${s.symbol}/option-chain`} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/10 text-[10px] text-blue-600 flex items-center justify-center font-bold">
                                        {s.symbol.substring(0, 4)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold group-hover:text-blue-500 transition-colors truncate max-w-[120px]">{s.name}</span>
                                        <span className="text-xs text-gray-500">{s.symbol}</span>
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
                    Disclaimer: Any investment guidelines, which may be available on the platform, is intended to be used for informational purposes only.
                </div>
            </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}

