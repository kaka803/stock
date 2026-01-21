'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useForex } from "@/context/ForexContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ForexPage() {
  const { forex, loading, searchQuery, setSearchQuery, currentPage, setCurrentPage, loadForex } = useForex();
  const { user } = useAuth();
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    loadForex();
  }, []);
  
  // Filter forex based on search query
  const filteredForex = forex.filter(pair => 
    pair.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pair.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredForex.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedForex = filteredForex.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
                <h1 className="text-5xl font-bold mb-6 anta-regular tracking-tight">Trade Forex</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    Trade the world's most popular currency pairs with low spreads and high liquidity.
                    Get real-time insights and advanced trading tools.
                </p>
                <div className="flex items-center gap-6">
                    {user ? (
                         <button 
                            onClick={() => router.push('/dashboard')}
                            className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={() => router.push('/signup')}
                                className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                            >
                                Sign Up
                            </button>
                            <Link href="#" className="text-blue-500 font-semibold hover:underline">
                                Learn more
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="relative w-full max-w-lg">
                <div className="rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                     <Image 
                        src="/trading.png" 
                        alt="Forex Trading" 
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
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Market Overview</p>
                        <h2 className="text-4xl font-bold anta-regular">Active Currency Pairs</h2>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search pairs (e.g. EUR/USD)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-full bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                    <div className="col-span-6">Symbol</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Change (%)</div>
                    <div className="col-span-2"></div>
                </div>

                {/* Forex List */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="col-span-12 flex justify-center py-12">
                            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                        </div>
                    ) : displayedForex.length > 0 ? (
                        displayedForex.map((pair, i) => (
                        <Link href={`/forex/${pair.symbol.replace('/', '-')}`} key={i} className="group grid grid-cols-12 items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-900 text-[10px] text-white flex items-center justify-center font-bold">
                                    {pair.symbol.substring(0, 7)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{pair.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">{pair.symbol}</div>
                                </div>
                            </div>
                            <div className="col-span-2 font-medium">
                                {pair.price}
                            </div>
                            <div className={`col-span-2 text-sm font-medium ${pair.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                                <div className="flex flex-col">
                                    <span>{pair.isNegative ? '↓' : '↑'} {pair.change}%</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{pair.changeValue}</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className="text-blue-500 font-semibold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Trade
                                </span>
                            </div>
                        </Link>
                    ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">No currency pairs found matching "{searchQuery}".</div>
                    )}
                </div>

                {/* Pagination Controls */}
                {!loading && filteredForex.length > ITEMS_PER_PAGE && (
                    <div className="mt-16 flex items-center justify-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft size={20}/>
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white font-semibold">Page {currentPage}</span>
                            <span className="text-gray-400">of {totalPages}</span>
                        </div>

                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowRight size={20}/>
                        </button>
                    </div>
                )}
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
