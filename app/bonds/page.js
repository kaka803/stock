'use client'


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTreasuryYield } from "@/components/utils/alphaVantage";

export default function BondsPage() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBonds() {
      setLoading(true);
      const data = await fetchTreasuryYield('daily', '10year');
      
      if (data && data.data) {
        // Treasury Yield API returns a list of values by date. We take the latest.
        const latestInfo = data.data[0];
        const previousInfo = data.data[1];
        
        const latestYield = parseFloat(latestInfo.value);
        const previousYield = parseFloat(previousInfo.value);
        const change = (latestYield - previousYield).toFixed(2);
        const changePercent = ((change / previousYield) * 100).toFixed(2);

        const formedBond = {
            name: "US Treasury Yield 10 Year",
            symbol: "US10Y",
            price: latestYield + "%", // It's a yield, not exactly price, but fits the column
            change: changePercent + "%",
            changeValue: change > 0 ? "+" + change : change,
            isNegative: change < 0
        };

        setBonds([formedBond]);
      }
      setLoading(false);
    }
    loadBonds();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
                <h1 className="text-5xl font-bold mb-6 anta-regular tracking-tight">Invest in Bonds</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    Secure your future with stable, fixed-income government and corporate bonds.
                </p>
                <div className="flex items-center gap-6">
                    <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                        Sign Up
                    </button>
                    <Link href="#" className="text-blue-500 font-semibold hover:underline">
                        Learn more
                    </Link>
                </div>
            </div>
            <div className="relative w-full max-w-lg">
                <div className="rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                     <Image 
                        src="/trading.png" 
                        alt="Bond Investing" 
                        width={600} 
                        height={400} 
                        className="object-cover w-full h-auto"
                     />
                </div>
            </div>
        </div>
      </section>

      {/* Index Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12 mb-20">
         <div className="flex gap-12">
            {/* Main Content */}
            <div className="flex-1">
                <div className="mb-12">
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Market Overview</p>
                     <h2 className="text-4xl font-bold anta-regular">Government Bonds</h2>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Yield</div>
                    <div className="col-span-2">Change</div>
                    <div className="col-span-2"></div>
                </div>

                {/* Bond List */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="col-span-12 flex justify-center py-12">
                            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                        </div>
                    ) : bonds.length > 0 ? (
                        bonds.map((bond, i) => (
                        <div key={i} className="group grid grid-cols-12 items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-teal-600 text-[10px] text-white flex items-center justify-center font-bold">
                                    {bond.symbol}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{bond.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">{bond.symbol}</div>
                                </div>
                            </div>
                            <div className="col-span-2 font-medium">
                                {bond.price}
                            </div>
                            <div className={`col-span-2 text-sm font-medium ${bond.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                <div className="flex flex-col">
                                    <span>{bond.isNegative ? '↓' : '↑'} {bond.change}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{bond.changeValue} pts</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <button className="text-blue-500 font-semibold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Invest
                                </button>
                            </div>
                        </div>
                    ))
                    ) : (
                         <div className="text-center py-10 text-gray-500">No data available or API limit reached.</div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"><ArrowLeft size={16}/></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">1</button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"><ArrowRight size={16}/></button>
                </div>
            </div>

            {/* Alphabet Sidebar */}
            <div className="hidden lg:flex flex-col gap-1 w-12 pt-20 text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sticky top-24 h-fit">
                {letters.map((letter) => (
                    <Link key={letter} href={`#${letter}`} className="hover:text-blue-600 dark:hover:text-blue-400 py-0.5 transition-colors">
                        {letter}
                    </Link>
                ))}
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}

