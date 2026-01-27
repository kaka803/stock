"use client";
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calculator, ArrowRight, DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfitCalculator() {
  const [investment, setInvestment] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [result, setResult] = useState(null);

  const calculateProfit = () => {
    if (!investment || !buyPrice || !sellPrice) return;

    const invest = parseFloat(investment);
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(invest) || isNaN(buy) || isNaN(sell) || buy === 0) return;

    const shares = invest / buy;
    const totalValue = shares * sell;
    const profit = totalValue - invest;
    const percentage = ((sell - buy) / buy) * 100;

    setResult({
      profit: profit.toFixed(2),
      percentage: percentage.toFixed(2),
      totalValue: totalValue.toFixed(2),
      shares: shares.toFixed(4)
    });
  };

  const reset = () => {
    setInvestment('');
    setBuyPrice('');
    setSellPrice('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <div className="h-32"></div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator size={32} />
           </div>
           <h1 className="text-4xl font-bold mb-4 anta-regular">Profit Calculator</h1>
           <p className="text-gray-600 dark:text-gray-400">
             Visualize your potential returns before you invest.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-xl">
                 <h2 className="text-xl font-bold mb-6">Investment Details</h2>
                 
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Total Investment ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input 
                                type="number" 
                                value={investment}
                                onChange={(e) => setInvestment(e.target.value)}
                                placeholder="1000"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Buy Price ($)</label>
                            <input 
                                type="number" 
                                value={buyPrice}
                                onChange={(e) => setBuyPrice(e.target.value)}
                                placeholder="150.00"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Sell Price ($)</label>
                            <input 
                                type="number" 
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                                placeholder="175.00"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={calculateProfit}
                            className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            Calculate <ArrowRight size={18} />
                        </button>
                         <button 
                            onClick={reset}
                            className="px-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                 </div>
            </div>

            {/* Results */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col justify-center relative overflow-hidden">
                 {!result ? (
                     <div className="text-center text-gray-400">
                         <span className="block text-6xl mb-4 opacity-20">?</span>
                         <p>Enter details to see your potential returns.</p>
                     </div>
                 ) : (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 relative z-10"
                     >
                         <div>
                             <p className="text-sm font-medium text-gray-500 mb-1">Total Profit / Loss</p>
                             <div className={`text-5xl font-bold ${parseFloat(result.profit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                 {parseFloat(result.profit) >= 0 ? '+' : ''}${result.profit}
                             </div>
                             <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mt-2 ${parseFloat(result.profit) >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {parseFloat(result.profit) >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {result.percentage}%
                             </div>
                         </div>

                         <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 grid grid-cols-2 gap-6">
                             <div>
                                 <p className="text-xs font-bold uppercase text-gray-400 mb-1">Total Value</p>
                                 <p className="text-2xl font-bold">${result.totalValue}</p>
                             </div>
                              <div>
                                 <p className="text-xs font-bold uppercase text-gray-400 mb-1">Shares Owned</p>
                                 <p className="text-2xl font-bold">{result.shares}</p>
                             </div>
                         </div>
                     </motion.div>
                 )}
                 {/* Background decoration */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
