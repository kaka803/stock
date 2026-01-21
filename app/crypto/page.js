'use client'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";
import { useEffect } from "react";
import { useCrypto } from "@/context/CryptoContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function CryptoPage() {
  const { cryptos, loading, loadCryptos, searchQuery, setSearchQuery, currentPage, setCurrentPage } = useCrypto();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadCryptos();
  }, []);

  // Filter and Pagination Logic
  const filteredCryptos = cryptos.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCryptos.length / ITEMS_PER_PAGE);
  const paginatedCryptos = filteredCryptos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
                <h1 className="text-5xl font-bold mb-6 anta-regular tracking-tight">Invest in Crypto</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    Trade digital currencies with confidence. Join millions of users buying and selling crypto.
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
                        alt="Crypto Trading" 
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
         <div className="flex flex-col zgap-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8">
                <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Market Overview</p>
                     <h2 className="text-4xl font-bold anta-regular">Top Crypto Assets</h2>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl leading-5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                        placeholder="Search coins (e.g. BTC, Ethereum)..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full">
                {/* Responsive Table Container */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar">
                    <div className="min-w-[500px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                            <div className="col-span-6">Name</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Change (24h)</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        {/* Crypto List */}
                        <div className="space-y-2">
                            {loading ? (
                                <div className="col-span-12 flex justify-center py-12">
                                    <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                                </div>
                            ) : paginatedCryptos.length > 0 ? (
                                paginatedCryptos.map((crypto, i) => (
                                <Link href={`/crypto/${crypto.symbol}`} key={i} className="group grid grid-cols-12 items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer">
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 text-[10px] flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-700 shrink-0">
                                            {crypto.image ? 
                                                <img src={crypto.image} alt={crypto.name} className="w-full h-full object-cover" /> :
                                                <div className="font-bold text-xs">{crypto.symbol.substring(0, 2)}</div>
                                            }
                                        </div>
                                        <div className="truncate">
                                            <div className="font-semibold text-gray-900 dark:text-white truncate">{crypto.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">{crypto.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 font-medium whitespace-nowrap">
                                        ${parseFloat(crypto.price).toLocaleString()}
                                    </div>
                                    <div className={`col-span-2 text-sm font-medium whitespace-nowrap ${crypto.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                                        <div className="flex flex-col">
                                            <span>{crypto.isNegative ? '↓' : '↑'} {crypto.change}%</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button className="text-blue-500 font-semibold hover:underline text-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            Trade
                                        </button>
                                    </div>
                                </Link>
                            ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                     {searchQuery ? "No coins found matching your search." : "Failed to load data. Rate limit might be exceeded."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination Controls */}
                {!loading && filteredCryptos.length > ITEMS_PER_PAGE && (
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
