"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GLOSSARY_TERMS = [
  { term: "Asset Allocation", definition: "The implementation of an investment strategy that attempts to balance risk versus reward by adjusting the percentage of each asset in an investment portfolio according to the investor's risk tolerance, goals and investment time frame.", category: "Strategy" },
  { term: "Bear Market", definition: "A market condition in which securities prices fall 20% or more from recent highs.", category: "Market" },
  { term: "Blue Chip Stocks", definition: "Shares of very large and well-recognized companies with a long history of sound financial performance.", category: "Stocks" },
  { term: "Bond", definition: "A fixed income instrument that represents a loan made by an investor to a borrower (typically corporate or governmental).", category: "Bonds" },
  { term: "Bull Market", definition: "A market condition in which prices are rising or are expected to rise.", category: "Market" },
  { term: "Capital Gain", definition: "An increase in the value of a capital asset (investment or real estate) that gives it a higher worth than the purchase price.", category: "Tax/Income" },
  { term: "Compound Interest", definition: "Interest calculated on the initial principal, which also includes all of the accumulated interest of previous periods.", category: "General" },
  { term: "Dividend", definition: "The distribution of some of a company's earnings to a class of its shareholders, as determined by the company's board of directors.", category: "Stocks" },
  { term: "Diversification", definition: "A risk management strategy that mixes a wide variety of investments within a portfolio.", category: "Strategy" },
  { term: "ETF (Exchange-Traded Fund)", definition: "A type of pooled investment security that operates much like a mutual fund but trades on stock exchanges.", category: "Funds" },
  { term: "EPS (Earnings Per Share)", definition: "The portion of a company's profit allocated to each outstanding share of common stock.", category: "Analysis" },
  { term: "Forex", definition: "The marketplace where various national currencies are traded.", category: "Forex" },
  { term: "Hedge Fund", definition: "Alternative investments using pooled funds that employ different strategies to earn active return, or alpha, for their investors.", category: "Funds" },
  { term: "Index Fund", definition: "A type of mutual fund or unit investment trust with a portfolio constructed to match or track the components of a financial market index.", category: "Funds" },
  { term: "IPO (Initial Public Offering)", definition: "The process of offering shares of a private corporation to the public in a new stock issuance.", category: "Stocks" },
  { term: "Liquidity", definition: "The efficiency or ease with which an asset or security can be converted into ready cash without affecting its market price.", category: "General" },
  { term: "Market Capitalization", definition: "The total value of a company's shares of stock. It is calculated by multiplying the price of a stock by its total number of outstanding shares.", category: "Analysis" },
  { term: "Mutual Fund", definition: "A type of financial vehicle made up of a pool of money collected from many investors to invest in securities like stocks, bonds, money market instruments, and other assets.", category: "Funds" },
  { term: "P/E Ratio (Price-to-Earnings)", definition: "The ratio for valuing a company that measures its current share price relative to its per-share earnings.", category: "Analysis" },
  { term: "Portfolio", definition: "A collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents, including closed-end funds and exchange traded funds (ETFs).", category: "Strategy" },
  { term: "Recession", definition: "A significant decline in economic activity spread across the economy, lasting more than a few months.", category: "Economy" },
  { term: "ROI (Return on Investment)", definition: "A performance measure used to evaluate the efficiency or profitability of an investment.", category: "Analysis" },
  { term: "Short Selling", definition: "An investment or trading strategy that speculates on the decline in a stock or other security's price.", category: "Strategy" },
  { term: "Stock", definition: "A security that represents the ownership of a fraction of a corporation.", category: "Stocks" },
  { term: "Volatility", definition: "A statistical measure of the dispersion of returns for a given security or market index.", category: "Analysis" },
  { term: "Yield", definition: "The income returned on an investment, such as the interest received from holding a security.", category: "Analysis" }
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                          item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesLetter = selectedLetter === "All" || item.term.startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  }).sort((a, b) => a.term.localeCompare(b.term));

  const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <main className="grow pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-500" />
              Investment Glossary
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Master the language of finance. Browse our comprehensive dictionary of investing terms and definitions to become a smarter investor.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-10 flex flex-col items-center gap-6">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input 
                placeholder="Search term or definition..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 rounded-xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800"
              />
            </div>

            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1 justify-center min-w-max">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedLetter === letter 
                        ? "bg-blue-600 text-white shadow-md scale-105" 
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item, index) => (
                  <motion.div
                    key={item.term}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors group hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                            {item.term}
                          </h3>
                          <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium text-xs border border-zinc-200 dark:border-zinc-700/50">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                          {item.definition}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="text-center py-20 text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800"
                  >
                   <div className="mx-auto w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                     <Search className="h-6 w-6 text-zinc-400" />
                   </div>
                   <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No terms found</h3>
                   <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your search or filters.</p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
