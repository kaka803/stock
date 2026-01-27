"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Clock, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock Data Generator for Fallback
const generateMockNews = () => [
  {
    title: "Fed Signals Potential Rate Cuts Later This Year as Inflation Cools",
    source: "Financial Times",
    time: "2 hours ago",
    category: "Economy",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Tech Sector Rallies: AI Stocks Reach New All-Time Highs",
    source: "Wall Street Journal",
    time: "4 hours ago",
    category: "Technology",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Oil Prices Stabilize Amidst Geopolitical Tensions in the Middle East",
    source: "Bloomberg",
    time: "5 hours ago",
    category: "Commodities",
    sentiment: "neutral",
    url: "#",
    image: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=2072&auto=format&fit=crop"
  },
  {
    title: "Global Markets Mixed as Asian Stocks Slip on China Growth Concerns",
    source: "Reuters",
    time: "6 hours ago",
    category: "Global Markets",
    sentiment: "negative",
    url: "#",
    image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "New EV Regulations Could Reshape the Auto Industry Ladder",
    source: "CNBC",
    time: "8 hours ago",
    category: "Automotive",
    sentiment: "neutral",
    url: "#",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop"
  },
  {
    title: "Crypto Market Update: Bitcoin Hovering Key Support Levels",
    source: "CoinDesk",
    time: "10 hours ago",
    category: "Cryptocurrency",
    sentiment: "neutral",
    url: "#",
    image: "https://images.unsplash.com/photo-1518546305927-5a42099435d5?q=80&w=1949&auto=format&fit=crop"
  },
  {
    title: "Gold Hits Record Highs as Investors Seek Safe Havens",
    source: "MarketWatch",
    time: "12 hours ago",
    category: "Commodities",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1610375460993-4803d3f27327?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Emerging Markets: India's Growth Forecast Revised Upward",
    source: "Economic Times",
    time: "14 hours ago",
    category: "Economy",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop"
  },
  {
    title: "Retail Giants Report Mixed Earnings Ahead of Holiday Season",
    source: "Forbes",
    time: "1 day ago",
    category: "Retail",
    sentiment: "neutral",
    url: "#",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "European Central Bank Holds Rates Steady, Eyes Inflation Data",
    source: "BBC Business",
    time: "1 day ago",
    category: "Economy",
    sentiment: "neutral",
    url: "#",
    image: "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Semiconductor Shortage Eases, Boosting Tech Hardware Output",
    source: "TechCrunch",
    time: "2 days ago",
    category: "Technology",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1555664424-778a69022365?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Real Estate Market Cools Down in Major Metropolitan Areas",
    source: "Zillow Research",
    time: "2 days ago",
    category: "Real Estate",
    sentiment: "negative",
    url: "#",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
  },
  {
    title: "Green Energy Investment Surpasses Fossil Fuels for First Time",
    source: "Bloomberg Green",
    time: "2 days ago",
    category: "Energy",
    sentiment: "positive",
    url: "#",
    image: "https://images.unsplash.com/photo-1473341304170-5799d19261d0?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Startup Funding Dries Up: VC Deal Flow Hits 5-Year Low",
    source: "Crunchbase",
    time: "3 days ago",
    category: "Startups",
    sentiment: "negative",
    url: "#",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5d49702?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Airline Stocks Volatile Amidst Rising Fuel Costs",
    source: "Skift",
    time: "3 days ago",
    category: "Travel",
    sentiment: "negative",
    url: "#",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
  }
];

export default function MarketNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // In a real app, we would call an API here.
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNews(generateMockNews());
    } catch (err) {
      console.error("Failed to fetch news", err);
      setNews(generateMockNews()); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'negative': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <main className="grow pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center gap-3">
                <Newspaper className="h-8 w-8 md:h-10 md:w-10 text-blue-600 dark:text-blue-500" />
                Market News
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Real-time insights, expert analysis, and breaking news from the global financial markets.
              </p>
            </div>
            <Button 
              onClick={fetchNews} 
              disabled={loading}
              variant="outline"
              className="gap-2 h-12 px-6 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Feed
            </Button>
          </div>

          {/* Featured News (First Item) */}
          {!loading && news.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800 group cursor-pointer">
                <div className="grid md:grid-cols-12 gap-0">
                  <div className="md:col-span-7 relative h-72 md:h-[500px] overflow-hidden">
                     <div 
                        className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${news[0].image})` }}
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                     <div className="absolute bottom-6 left-6 md:hidden">
                        <Badge variant="secondary" className="mb-2 bg-blue-600 text-white border-0">{news[0].category}</Badge>
                     </div>
                  </div>
                  <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center relative bg-white dark:bg-zinc-900">
                    <div className="hidden md:flex items-center gap-3 mb-6">
                      <Badge variant="outline" className={`px-3 py-1 text-sm font-medium ${getSentimentColor(news[0].sentiment)}`}>
                        {news[0].category}
                      </Badge>
                      <span className="flex items-center text-sm text-zinc-500 gap-2">
                        <div className="w-1 h-1 rounded-full bg-zinc-400"></div>
                        <Clock className="h-3.5 w-3.5" />
                        {news[0].time}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                      {news[0].title}
                    </h2>
                    
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg leading-relaxed line-clamp-4">
                      Analyst reports suggest a significant shift in market dynamics as new economic data emerges. 
                      Investors are closely watching the latest developments to adjust their portfolios accordingly...
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                           {news[0].source.charAt(0)}
                        </div>
                        <span className="font-semibold">{news[0].source}</span>
                      </div>
                      <Button className="gap-2 rounded-full px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                        Read Story <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               // Skeleton Loading State
               Array.from({ length: 6 }).map((_, i) => (
                 <Card key={i} className="border-0 shadow-lg bg-white dark:bg-zinc-900">
                   <div className="h-56 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-t-xl" />
                   <CardContent className="p-6">
                     <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 animate-pulse" />
                     <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-2 animate-pulse" />
                     <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                   </CardContent>
                 </Card>
               ))
            ) : (
              news.slice(1).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 dark:bg-black/80 text-black dark:text-white backdrop-blur-md shadow-sm border-0 font-bold hover:bg-white">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col h-[calc(100%-14rem)]">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {item.time}
                         </span>
                         {item.sentiment === 'positive' && (
                           <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
                             <TrendingUp className="w-3 h-3 mr-1" /> Bullish
                           </Badge>
                         )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 line-clamp-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{item.source}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-4">
                          Read <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {!loading && news.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-zinc-800 shadow-sm mb-6">
                <AlertCircle className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No News Available</h3>
              <p className="text-zinc-500 max-w-sm">We couldn't fetch the latest updates at this moment. Please check back shortly.</p>
              <Button onClick={fetchNews} variant="outline" className="mt-8 rounded-full">
                Try Again
              </Button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
