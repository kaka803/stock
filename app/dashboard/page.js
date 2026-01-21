"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, LayoutDashboard, LineChart, Wallet, CreditCard, ArrowRightLeft, LogOut, Sun, Moon, FileText, Menu, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "next-themes";
import Link from "next/link";
import { useStock } from "@/context/StockContext";

// No Mock Data
const performanceData = []; // Will be generated dynamically

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-500 group relative ${
            active 
            ? "bg-black text-white dark:bg-white dark:text-black shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_20px_-5px_rgba(255,255,255,0.1)]" 
            : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white"
        }`}
    >
        <div className={`transition-transform duration-500 ${active ? "scale-110" : "group-hover:scale-110"}`}>
            <Icon size={20} />
        </div>
        {label}
        {active && (
            <div className="absolute left-0 w-1 h-6 bg-black dark:bg-white rounded-r-full" />
        )}
    </button>
);

const getSimulatedCurrentPrice = (symbol, buyPrice) => {
    // Fallback if API data isn't available
    if (!buyPrice) return 150; 
    const seed = symbol.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (seed % 10) - 4; 
    return buyPrice + (buyPrice * (variation / 100));
};

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const { stocks, loadStocks } = useStock(); // Custom Hook for Global Market Data
    const router = useRouter();
    const [mount, setMount] = useState(false);
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [orders, setOrders] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Market Data State (For specific portfolio items)
    const [marketPrices, setMarketPrices] = useState({});
    const [marketLoading, setMarketLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState({
        asset: null,
        quantity: '',
        usdAmount: '',
        withdrawMode: 'qty', // 'qty' or 'usd'
        paymentDetail: ''
    });

    // Initial Load of Top 100 Stocks
    useEffect(() => {
        loadStocks();
    }, []);

    // Fetch Market Data Logic (For User Portfolio)
    const fetchPortfolioMarketData = async () => {
        if (!user || !user.portfolio || user.portfolio.length === 0) {
            setMarketLoading(false);
            return;
        }

        setMarketLoading(true);
        setFetchError(false);
        try {
            // 1. Identify Symbols from Portfolio
            const stockSymbols = user.portfolio
                .filter(asset => asset.type === 'stock')
                .map(asset => asset.symbol)
                .filter(s => s > "");
            
            const cryptoSymbols = user.portfolio
                .filter(asset => asset.type === 'crypto')
                .map(asset => asset.symbol)
                .filter(s => s > "");

            const forexSymbols = user.portfolio
                .filter(asset => asset.type === 'forex')
                .map(asset => asset.symbol)
                .filter(s => s > "");

            // 2. Prepare Fetch Requests
            const requests = [];

            if (stockSymbols.length > 0) {
                const uniqueStocks = [...new Set(stockSymbols)].join(',');
                // Use the new Finnhub-backed price endpoint for portfolio stocks
                requests.push(fetch(`/api/stocks/prices?symbols=${uniqueStocks}`).then(res => res.json()));
            } else {
                requests.push(Promise.resolve({ success: true, response: [] }));
            }

            if (cryptoSymbols.length > 0) {
                const uniqueCrypto = [...new Set(cryptoSymbols)].join(',');
                requests.push(fetch(`/api/crypto?symbol=${uniqueCrypto}`).then(res => res.json()));
            } else {
                requests.push(Promise.resolve({ status: true, response: [] }));
            }

            if (forexSymbols.length > 0) {
                const uniqueForex = [...new Set(forexSymbols)].join(',');
                requests.push(fetch(`/api/forex?symbol=${uniqueForex}`).then(res => res.json()));
            } else {
                requests.push(Promise.resolve({ status: true, response: [] }));
            }

            // 3. Execute Fetches
            const [stocksRes, cryptoRes, forexRes] = await Promise.all(requests);
            const newPrices = {};

            // 4. Process Stocks Response (Finnhub)
            if (stocksRes.success && Array.isArray(stocksRes.response)) {
                stocksRes.response.forEach(item => {
                    if (item.price > 0) {
                        newPrices[`STOCK_${item.symbol.toUpperCase()}`] = parseFloat(item.price);
                    }
                });
            }

            // 5. Process Crypto Response (Prefix with CRYPTO_)
            if (cryptoRes.status && Array.isArray(cryptoRes.response)) {
                cryptoRes.response.forEach(coin => {
                     const symbol = coin.symbol.toUpperCase();
                     const price = parseFloat(coin.price);
                     newPrices[`CRYPTO_${symbol}`] = price;
                     
                     // Handle USDT suffix
                     if (symbol.endsWith('USDT')) {
                         newPrices[`CRYPTO_${symbol.replace('USDT', '')}`] = price;
                     }
                });
            }

            // 6. Process Forex Response (Prefix with FOREX_)
            if (forexRes.status && Array.isArray(forexRes.response)) {
                forexRes.response.forEach(pair => {
                    const symbol = pair.symbol.toUpperCase();
                    const price = parseFloat(pair.price);
                    newPrices[`FOREX_${symbol}`] = price;
                    
                    // Also handle hyphen version often used in URLs
                    const hyphenSymbol = symbol.replace('/', '-');
                    newPrices[`FOREX_${hyphenSymbol}`] = price;
                });
            }
            
            setMarketPrices(newPrices);
        } catch (error) {
            console.error("Failed to fetch specific market data:", error);
            setFetchError(true);
        } finally {
            setMarketLoading(false);
        }
    };

    // Fetch portfolio prices on mount if Dashboard or User Assets is active
    useEffect(() => {
        if (activeTab === 'User Assets' || activeTab === 'Dashboard') {
            fetchPortfolioMarketData();
        }
    }, [activeTab, user]);

    
    // Portfolio Calculation
    const portfolio = user?.portfolio || [];

    // Aggregated Portfolio Implementation
    const aggregatedPortfolio = useMemo(() => {
        const map = new Map();
        portfolio.forEach(asset => {
            const key = `${asset.type}_${asset.symbol.toUpperCase()}`;
            if (map.has(key)) {
                const existing = map.get(key);
                existing.quantity += asset.quantity;
            } else {
                map.set(key, { ...asset, symbol: asset.symbol.toUpperCase() });
            }
        });
        return Array.from(map.values());
    }, [portfolio]);

    // Calculate Portfolio Values
    const { portfolioValue, totalInvested } = useMemo(() => {
        let pv = 0;
        let ti = 0;
        portfolio.forEach(asset => {
            if (!asset.symbol) return;
            const lookupKey = `${asset.type.toUpperCase()}_${asset.symbol.toUpperCase()}`;
            const realPrice = marketPrices[lookupKey];
            const currentPrice = (realPrice !== undefined && !isNaN(realPrice)) ? realPrice : asset.price;
            pv += currentPrice * asset.quantity;
            ti += asset.price * asset.quantity;
        });
        return { portfolioValue: pv, totalInvested: ti };
    }, [portfolio, marketPrices]);

    const totalPL = portfolioValue - totalInvested;
    const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    // Derived Real Data for Dashboard
    
    // 2. Simulated Performance Chart based on current P/L
    // If P/L is +10%, we generate a graph ending at +10%
    // If P/L is +10%, we generate a graph ending at +10%
    const generateChartData = (finalPercent) => {
        const data = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let current = 0;
        // Start from 0, reach finalPercent by Dec
        const steps = 12;
        const increment = finalPercent / steps;
        
        for (let i = 0; i < steps; i++) {
            // Add some randomness but trend towards target
            const noise = (Math.random() - 0.5) * 5; // +/- 2.5% noise
            current += increment + noise;
            // Ensure the last few converge to the real final value
            if (i > 8) current = finalPercent * (i/11); 
            
            data.push({
                name: months[i],
                value: Math.max(0, 100 + current) // Base 100 + percent change
            });
        }
        return data;
    };

    const realPerformanceData = generateChartData(totalPLPercent);


    useEffect(() => {
        if (user && activeTab === 'My Orders') {
            fetch('/api/orders')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setOrders(data.orders);
                })
                .catch(err => console.error(err));
        }
        
        if (user && activeTab === 'Withdraw') {
            fetch('/api/withdraw')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setWithdrawHistory(data.withdrawals);
                })
                .catch(err => console.error(err));
        }
    }, [user, activeTab]);

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        const quantityToWithdraw = withdrawForm.withdrawMode === 'qty' 
            ? parseFloat(withdrawForm.quantity) 
            : parseFloat(withdrawForm.usdAmount) / (marketPrices[`${withdrawForm.asset?.type.toUpperCase()}_${withdrawForm.asset?.symbol.toUpperCase()}`] || withdrawForm.asset?.price);

        if (!withdrawForm.asset || isNaN(quantityToWithdraw) || quantityToWithdraw <= 0 || !withdrawForm.paymentDetail) {
            alert("Please fill all fields correctly");
            return;
        }

        if (quantityToWithdraw > withdrawForm.asset.quantity) {
            alert(`Insufficient holdings! You only have ${withdrawForm.asset.quantity.toFixed(4)} ${withdrawForm.asset.symbol} available.`);
            return;
        }

        setWithdrawLoading(true);
        try {
            const currentPrice = marketPrices[`${withdrawForm.asset.type.toUpperCase()}_${withdrawForm.asset.symbol.toUpperCase()}`] || withdrawForm.asset.price;
            const res = await fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetType: withdrawForm.asset.type,
                    symbol: withdrawForm.asset.symbol,
                    quantity: quantityToWithdraw,
                    paymentDetail: withdrawForm.paymentDetail,
                    amount: currentPrice * quantityToWithdraw // Final estimated value
                })
            });

            const data = await res.json();
            if (data.success) {
                alert("Withdrawal request submitted successfully!");
                setWithdrawForm({ asset: null, quantity: '', usdAmount: '', withdrawMode: 'qty', paymentDetail: '' });
                // Refresh history
                const histRes = await fetch('/api/withdraw');
                const histData = await histRes.json();
                if (histData.success) setWithdrawHistory(histData.withdrawals);
            } else {
                alert(data.error || "Failed to submit withdrawal");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setWithdrawLoading(false);
        }
    };

    useEffect(() => {
        setMount(true);
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);


    if (loading || !mount) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300">
            
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative w-64 h-full bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-wide anta-regular">Logo</span>
                    </Link>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 md:hidden text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-2 py-4">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => { setActiveTab("Dashboard"); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={FileText} label="My Orders" active={activeTab === "My Orders"} onClick={() => { setActiveTab("My Orders"); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Wallet} label="User Assets" active={activeTab === "User Assets"} onClick={() => { setActiveTab("User Assets"); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={ArrowRightLeft} label="Withdraw" active={activeTab === "Withdraw"} onClick={() => { setActiveTab("Withdraw"); setIsSidebarOpen(false); }} />
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                     <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                
                {/* Navbar */}
                <header className="h-20 md:h-24 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-800/50 flex items-center justify-between px-4 md:px-10 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 md:hidden text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-black to-zinc-500 dark:from-white dark:to-zinc-500">
                            {activeTab}
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative hidden md:block w-72 group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search markets..." 
                                className="w-full bg-gray-100/50 dark:bg-zinc-900/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all placeholder:text-zinc-400 font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-3 bg-gray-100 dark:bg-zinc-900 rounded-2xl text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-all hover:scale-105"
                            >
                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <div className="flex items-center gap-4 pl-8 border-l border-gray-100 dark:border-zinc-800">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold leading-none mb-1">{user.name}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Active</p>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-zinc-800 to-black dark:from-zinc-200 dark:to-white flex items-center justify-center text-white dark:text-black font-extrabold shadow-xl shadow-black/20 dark:shadow-white/10 ring-2 ring-white dark:ring-black">
                                     {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="h-full w-full rounded-2xl object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                     {/* Dashboard Content */}
                     <div className="max-w-7xl mx-auto space-y-6">

                         {activeTab === "My Orders" ? (
                            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                <h3 className="font-bold text-2xl mb-8 tracking-tight">Order Logs</h3>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left min-w-[800px]">
                                        <thead>
                                            <tr className="text-zinc-400 text-[10px] uppercase font-semibold tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800/50 whitespace-nowrap">
                                                <th className="pb-5 pl-4">Asset Details</th>
                                                <th className="pb-5 px-4 text-right">Execution Price</th>
                                                <th className="pb-5 px-4 text-right">Volume</th>
                                                <th className="pb-5 px-4 text-right">Net Value</th>
                                                <th className="pb-5 px-4 text-right">Timestamp</th>
                                                <th className="pb-5 pr-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/30">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 whitespace-nowrap">
                                                    <td className="py-6 pl-4">
                                                        <div className="font-semibold text-base">{order.symbol}</div>
                                                        <div className="text-[10px] font-medium uppercase text-zinc-400 mt-1">{order.type}</div>
                                                    </td>
                                                    <td className="py-6 px-4 text-right font-medium text-zinc-600 dark:text-zinc-400">
                                                        ${order.price?.toLocaleString()}
                                                    </td>
                                                    <td className="py-6 px-4 text-right font-medium">
                                                        {order.quantity}
                                                    </td>
                                                    <td className="py-6 px-4 text-right font-bold text-black dark:text-white">
                                                        ${order.totalAmount?.toLocaleString()}
                                                    </td>
                                                    <td className="py-6 px-4 text-right text-xs text-zinc-500 font-medium">
                                                        {new Date(order.createdAt).toLocaleString(undefined, { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="py-6 pr-4 text-right">
                                                        <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full border-2 tracking-tighter shadow-sm ${
                                                            order.status === 'verified' ? 'border-green-500/20 text-green-600 bg-green-50/50' :
                                                            order.status === 'rejected' ? 'border-red-500/20 text-red-600 bg-red-50/50' :
                                                            'border-yellow-500/20 text-yellow-600 bg-yellow-50/50'
                                                        }`}>
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : activeTab === "User Assets" ? (
                            <div className="space-y-10">
                                {/* Portfolio Summary Card */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-zinc-900 dark:bg-zinc-100 rounded-[2.5rem] p-8 text-white dark:text-black shadow-2xl shadow-black/20 dark:shadow-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                            <Wallet size={80} />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-4">Capital Net Worth</p>
                                            <h2 className="text-4xl font-bold tracking-tighter mb-6">
                                                {marketLoading ? "..." : `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            </h2>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-semibold px-3 py-1.5 rounded-xl ${totalPL >= 0 ? 'bg-white/10 dark:bg-black/5 text-white dark:text-black' : 'bg-red-500/20 text-red-400 dark:text-red-600'}`}>
                                                    {totalPL >= 0 ? '▲' : '▼'} {Math.abs(totalPLPercent).toFixed(2)}%
                                                </span>
                                                <p className="text-[10px] text-zinc-500 font-semibold uppercase">All Time Cumulative</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-4">Total Investment</p>
                                        <h2 className="text-3xl font-bold text-black dark:text-white tracking-tighter mb-4">
                                            ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h2>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>

                                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                        <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-[0.15em] mb-4">Net Performance</p>
                                        <div className="flex flex-col">
                                            <h2 className={`text-3xl font-bold tracking-tighter mb-2 ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </h2>
                                            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">
                                                {marketLoading ? "Refreshing Analytics..." : "Real-time Valuation"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Assets Table */}
                                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="font-bold text-2xl tracking-tight">Investment Portfolio</h3>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left min-w-[800px]">
                                            <thead>
                                                <tr className="text-zinc-400 text-[10px] uppercase font-semibold tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800/50 whitespace-nowrap">
                                                    <th className="pb-5 pl-4">Ticker / Identity</th>
                                                    <th className="pb-5 px-4 text-right">Holdings</th>
                                                    <th className="pb-5 px-4 text-right">Entry Value</th>
                                                    <th className="pb-5 px-4 text-right">Market Price</th>
                                                    <th className="pb-5 px-4 text-right">Position Value</th>
                                                    <th className="pb-5 pr-4 text-right">Return Profile</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/30">
                                                {portfolio.map((asset, i) => {
                                                    const symbol = asset.symbol.toUpperCase();
                                                    const lookupKey = `${asset.type.toUpperCase()}_${symbol}`;
                                                    const realPrice = marketPrices[lookupKey];
                                                    const currentPrice = (realPrice !== undefined && !isNaN(realPrice)) ? realPrice : asset.price;
                                                    
                                                    const currentValue = currentPrice * asset.quantity;
                                                    const invested = asset.price * asset.quantity;
                                                    const pl = currentValue - invested;
                                                    const plPercent = (pl / invested) * 100;

                                                    return (
                                                        <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 whitespace-nowrap">
                                                            <td className="py-6 pl-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-semibold text-xs group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                                                        {symbol.slice(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-base">{symbol}</div>
                                                                        <div className="text-[10px] font-medium uppercase text-zinc-400 mt-0.5 tracking-tighter">{asset.type} Asset</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-6 px-4 text-right font-semibold text-sm">{asset.quantity?.toFixed(4)}</td>
                                                            <td className="py-6 px-4 text-right text-zinc-500 font-medium text-sm">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            <td className="py-6 px-4 text-right">
                                                                <div className="font-semibold text-sm tracking-tight text-black dark:text-white">
                                                                    {marketLoading && !realPrice ? "---" : `$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                                </div>
                                                                {!realPrice && !marketLoading && <p className="text-[8px] font-bold text-zinc-400 uppercase">Cached</p>}
                                                            </td>
                                                            <td className="py-6 px-4 text-right font-bold text-base text-black dark:text-white">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            <td className="py-6 pr-4 text-right">
                                                                <div className={`font-bold text-sm ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {pl >= 0 ? '+' : ''}${pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </div>
                                                                <div className={`text-[10px] font-semibold ${pl >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>
                                                                    {plPercent.toFixed(2)}%
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === "Withdraw" ? (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Withdraw Form */}
                                    <div className="lg:col-span-12">
                                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                            <h3 className="font-bold text-2xl mb-8 tracking-tight">Withdraw Funds</h3>
                                            
                                            <form onSubmit={handleWithdrawSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Select Asset</label>
                                                    <select 
                                                        className="w-full bg-gray-50 dark:bg-black border-2 border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                                                        onChange={(e) => {
                                                            const asset = aggregatedPortfolio.find(a => a.symbol === e.target.value);
                                                            setWithdrawForm({...withdrawForm, asset, quantity: '', usdAmount: ''});
                                                        }}
                                                        value={withdrawForm.asset?.symbol || ""}
                                                        required
                                                    >
                                                        <option value="" disabled>Choose an asset...</option>
                                                        {aggregatedPortfolio.map((asset, i) => (
                                                            <option key={i} value={asset.symbol}>
                                                                {asset.symbol} ({asset.type.toUpperCase()}) - Total: {asset.quantity.toFixed(4)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center pl-2">
                                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Amount to Withdraw</label>
                                                        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setWithdrawForm({...withdrawForm, withdrawMode: 'qty'})}
                                                                className={`px-2 py-0.5 text-[8px] font-black rounded-md transition-all ${withdrawForm.withdrawMode === 'qty' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                                                            >UNIT</button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => setWithdrawForm({...withdrawForm, withdrawMode: 'usd'})}
                                                                className={`px-2 py-0.5 text-[8px] font-black rounded-md transition-all ${withdrawForm.withdrawMode === 'usd' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                                                            >USD</button>
                                                        </div>
                                                    </div>
                                                    {withdrawForm.withdrawMode === 'qty' ? (
                                                        <div className="relative group/input">
                                                            <input 
                                                                type="number" 
                                                                step="0.0001"
                                                                placeholder="0.00"
                                                                className="w-full bg-gray-50 dark:bg-black border-2 border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 px-4 font-bold outline-none transition-all pr-24"
                                                                value={withdrawForm.quantity}
                                                                onChange={(e) => {
                                                                    let val = e.target.value;
                                                                    const maxQty = withdrawForm.asset?.quantity || 0;
                                                                    if (parseFloat(val) > maxQty) val = maxQty.toString();
                                                                    const price = marketPrices[`${withdrawForm.asset?.type.toUpperCase()}_${withdrawForm.asset?.symbol.toUpperCase()}`] || withdrawForm.asset?.price || 0;
                                                                    setWithdrawForm({...withdrawForm, quantity: val, usdAmount: val ? (parseFloat(val) * price).toFixed(2) : ''});
                                                                }}
                                                                required
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const maxQty = withdrawForm.asset?.quantity || 0;
                                                                        const price = marketPrices[`${withdrawForm.asset?.type.toUpperCase()}_${withdrawForm.asset?.symbol.toUpperCase()}`] || withdrawForm.asset?.price || 0;
                                                                        setWithdrawForm({...withdrawForm, quantity: maxQty.toString(), usdAmount: (maxQty * price).toFixed(2)});
                                                                    }}
                                                                    className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-transform px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                                                >MAX</button>
                                                                <span className="text-[10px] font-black text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-2">{withdrawForm.asset?.symbol}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative group/input">
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                className="w-full bg-gray-50 dark:bg-black border-2 border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 px-4 font-bold outline-none transition-all pr-24"
                                                                value={withdrawForm.usdAmount}
                                                                onChange={(e) => {
                                                                    let val = e.target.value;
                                                                    const price = marketPrices[`${withdrawForm.asset?.type.toUpperCase()}_${withdrawForm.asset?.symbol.toUpperCase()}`] || withdrawForm.asset?.price || 1;
                                                                    const maxUsd = (withdrawForm.asset?.quantity || 0) * price;
                                                                    if (parseFloat(val) > maxUsd) val = maxUsd.toFixed(2);
                                                                    setWithdrawForm({...withdrawForm, usdAmount: val, quantity: val ? (parseFloat(val) / price).toFixed(6) : ''});
                                                                }}
                                                                required
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const price = marketPrices[`${withdrawForm.asset?.type.toUpperCase()}_${withdrawForm.asset?.symbol.toUpperCase()}`] || withdrawForm.asset?.price || 1;
                                                                        const maxUsd = (withdrawForm.asset?.quantity || 0) * price;
                                                                        const maxQty = withdrawForm.asset?.quantity || 0;
                                                                        setWithdrawForm({...withdrawForm, usdAmount: maxUsd.toFixed(2), quantity: maxQty.toString()});
                                                                    }}
                                                                    className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-transform px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                                                >MAX</button>
                                                                <span className="text-[10px] font-black text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-2">USD</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {withdrawForm.asset && (
                                                        <p className="text-[9px] font-bold text-zinc-500 mt-1 pl-2">
                                                            {withdrawForm.withdrawMode === 'qty' 
                                                                ? `≈ $${withdrawForm.usdAmount || '0.00'} USDT` 
                                                                : `≈ ${withdrawForm.quantity || '0.000000'} ${withdrawForm.asset.symbol}`}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Binance ID / Email</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. 12345678 or user@email.com"
                                                        className="w-full bg-gray-50 dark:bg-black border-2 border-transparent focus:border-black dark:focus:border-white rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                                                        value={withdrawForm.paymentDetail}
                                                        onChange={(e) => setWithdrawForm({...withdrawForm, paymentDetail: e.target.value})}
                                                        required
                                                    />
                                                </div>

                                                <div className="md:col-span-3 pt-4">
                                                    <button 
                                                        type="submit"
                                                        disabled={withdrawLoading}
                                                        className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-sm shadow-xl shadow-black/20 dark:shadow-white/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                                    >
                                                        {withdrawLoading ? "Processing Request..." : "Submit Withdrawal Request"}
                                                    </button>
                                                    <p className="text-[10px] text-zinc-400 font-bold text-center mt-4 uppercase tracking-[0.2em]">Payments will be processed to your Binance account within 24 hours.</p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Withdraw History */}
                                    <div className="lg:col-span-12">
                                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50">
                                            <h3 className="font-bold text-2xl mb-8 tracking-tight">Withdrawal History</h3>
                                            <div className="overflow-x-auto custom-scrollbar">
                                                <table className="w-full text-left min-w-[800px]">
                                                    <thead>
                                                        <tr className="text-zinc-400 text-[10px] uppercase font-semibold tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800/50 whitespace-nowrap">
                                                            <th className="pb-5 pl-4">Asset</th>
                                                            <th className="pb-5 px-4 text-right">Quantity</th>
                                                            <th className="pb-5 px-4 text-right">Estimated Value</th>
                                                            <th className="pb-5 px-4 text-right">Payment Info</th>
                                                            <th className="pb-5 px-4 text-right">Timestamp</th>
                                                            <th className="pb-5 pr-4 text-right">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/30">
                                                        {withdrawHistory.map((w) => (
                                                            <tr key={w._id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 whitespace-nowrap">
                                                                <td className="py-6 pl-4">
                                                                    <div className="font-semibold text-base">{w.symbol}</div>
                                                                    <div className="text-[10px] font-medium uppercase text-zinc-400 mt-1">{w.assetType}</div>
                                                                </td>
                                                                <td className="py-6 px-4 text-right font-medium">
                                                                    {w.quantity.toFixed(4)}
                                                                </td>
                                                                <td className="py-6 px-4 text-right font-bold text-black dark:text-white">
                                                                    ${w.amount?.toLocaleString()}
                                                                </td>
                                                                <td className="py-6 px-4 text-right text-xs font-medium text-zinc-500">
                                                                    {w.paymentDetail}
                                                                </td>
                                                                <td className="py-6 px-4 text-right text-xs text-zinc-500 font-medium">
                                                                    {new Date(w.createdAt).toLocaleString()}
                                                                </td>
                                                                <td className="py-6 pr-4 text-right">
                                                                    <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full border-2 tracking-tighter shadow-sm ${
                                                                        w.status === 'verified' ? 'border-green-500/20 text-green-600 bg-green-50/50' :
                                                                        w.status === 'rejected' ? 'border-red-500/20 text-red-600 bg-red-50/50' :
                                                                        'border-yellow-500/20 text-yellow-600 bg-yellow-50/50'
                                                                    }`}>
                                                                        {w.status.toUpperCase()}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {withdrawHistory.length === 0 && (
                                                            <tr>
                                                                <td colSpan="6" className="py-10 text-center text-zinc-400 font-bold italic">No withdrawal history found.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Fund Card - Premium Glass */}
                                <div className="lg:col-span-4 group">
                                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50 h-full flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:shadow-black/10">
                                        <div className="relative z-10">
                                            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-6">Aggregate Value</p>
                                            <h2 className="text-5xl font-black tracking-tighter text-black dark:text-white leading-[1.1] mb-2">
                                                ${(portfolioValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </h2>
                                            <div className="flex items-center gap-2 mb-10">
                                                <div className={`h-2 w-2 rounded-full ${totalPL >= 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Exposure Active</p>
                                            </div>
                                        </div>
                                        
                                        <Link href="/funds" className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-center text-sm shadow-xl shadow-black/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 overflow-hidden group/btn">
                                            <span className="relative z-10">Top up Balance</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        </Link>

                                        {/* Background Decoration */}
                                        <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-black/[0.03] dark:text-white/[0.03] pointer-events-none select-none italic">
                                            $
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Chart - Pro Analytics */}
                                <div className="lg:col-span-8">
                                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-gray-100 dark:border-zinc-800/50 h-full flex flex-col">
                                        <div className="flex-1 min-h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={realPerformanceData}>
                                                    <defs>
                                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={totalPL >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor={totalPL >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-zinc-800/30" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#9CA3AF'}} dy={15} />
                                                    <YAxis hide axisLine={false} />
                                                    <Tooltip 
                                                        cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                return (
                                                                    <div className="bg-black dark:bg-white p-4 rounded-2xl shadow-2xl border-none">
                                                                        <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{payload[0].payload.name}</p>
                                                                        <p className="text-lg font-black text-white dark:text-black tracking-tighter">
                                                                            {payload[0].value.toFixed(2)}%
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="value" 
                                                        stroke={totalPL >= 0 ? "#10b981" : "#ef4444"} 
                                                        strokeWidth={4} 
                                                        fillOpacity={1} 
                                                        fill="url(#colorValue)" 
                                                        animationDuration={2000}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio List - Micro Cards */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end px-2">
                                    <div>
                                        <h3 className="font-extrabold text-2xl tracking-tight">Active Portfolio</h3>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Live Market Snapshots</p>
                                    </div>
                                    <Link href="/stocks" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-all">
                                        Expand Inventory <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {portfolio.length === 0 ? (
                                        <div className="col-span-full py-20 bg-gray-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-4 grayscale opacity-50">📦</div>
                                            <p className="font-bold text-zinc-400 italic">No assets currently under management.</p>
                                        </div>
                                    ) : portfolio.map((asset, i) => {
                                        const lookupKey = `${asset.type.toUpperCase()}_${asset.symbol.toUpperCase()}`;
                                        const realPrice = marketPrices[lookupKey];
                                        const currentPrice = (realPrice !== undefined && !isNaN(realPrice)) ? realPrice : asset.price;
                                        const changePercent = ((currentPrice - asset.price) / asset.price) * 100;
                                        
                                        return (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-gray-100 dark:border-zinc-800/50 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-black/50 flex items-center justify-center font-bold group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                                                        {asset.symbol.slice(0, 2)}
                                                    </div>
                                                    <div className={`text-[9px] font-bold px-3 py-1.5 rounded-full ${changePercent >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <h4 className="font-bold text-lg tracking-tight">{asset.symbol}</h4>
                                                        <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                                        <span className="text-[10px] font-semibold text-zinc-400 uppercase">{asset.type}</span>
                                                    </div>
                                                    <p className="text-2xl font-bold tracking-tighter overflow-hidden text-ellipsis">
                                                        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>

                                                <div className="pt-6 border-t border-gray-50 dark:border-zinc-800/50 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[8px] font-semibold text-zinc-400 uppercase mb-0.5 tracking-widest">Entry</p>
                                                        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-semibold text-zinc-400 uppercase mb-0.5 tracking-widest">Holdings</p>
                                                        <p className="text-sm font-bold">{asset.quantity?.toFixed(4)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
