
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function OptionsPage() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const options = Array(10).fill({
    name: "SPY Call Option",
    symbol: "SPY240119C00470000",
    price: "5.45",
    change: "+12.5%",
    changeValue: "+$0.60",
    isNegative: false,
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
                <h1 className="text-5xl font-bold mb-6 anta-regular tracking-tight">Option Trading</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                    Leverage your portfolio with advanced options trading strategies.
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
                        alt="Option Trading" 
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
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Alphabetical Index of</p>
                     <h2 className="text-4xl font-bold anta-regular">Options</h2>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Change</div>
                    <div className="col-span-2"></div>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                    {options.map((option, i) => (
                        <div key={i} className="group grid grid-cols-12 items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-[10px] text-white flex items-center justify-center font-bold">
                                    OPT
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{option.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">{option.symbol}</div>
                                </div>
                            </div>
                            <div className="col-span-2 font-medium">
                                ${option.price}
                            </div>
                            <div className={`col-span-2 text-sm font-medium ${i % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                <div className="flex flex-col">
                                    <span>{i % 2 === 0 ? '↑' : '↓'} {option.change}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{option.changeValue}</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <button className="text-blue-500 font-semibold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Trade
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"><ArrowLeft size={16}/></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">2</button>
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
