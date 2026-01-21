'use client';
import { useEffect, useState } from 'react';
import { 
    Users, 
    ShoppingCart, 
    Clock, 
    DollarSign,
    TrendingUp,
    RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <AdminPanelLayout>
                <div className="flex h-[400px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminPanelLayout>
        );
    }

    const cards = [
        { name: 'Total Users', value: stats?.users || 0, icon: Users, color: 'blue', detail: 'Registered members' },
        { name: 'Total Orders', value: stats?.orders || 0, icon: ShoppingCart, color: 'green', detail: 'Transactions made' },
        { name: 'Pending Orders', value: stats?.pending || 0, icon: Clock, color: 'yellow', detail: 'Awaiting verification' },
        { name: 'Market Volume', value: `$${(stats?.volume || 0).toLocaleString()}`, icon: DollarSign, color: 'purple', detail: 'Successful conversions' },
    ];
    return (
        <AdminPanelLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight anta-regular">Dashboard Overview</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time platform performance metrics.</p>
                    </div>
                    <button 
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh Stats'}
                    </button>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2.5 rounded-xl bg-linear-to-br from-${card.color}-500/10 to-${card.color}-500/5 text-${card.color}-600 dark:text-${card.color}-400`}>
                                    <card.icon size={20} />
                                </div>
                            </div>
                            <div className="text-2xl font-black">{card.value}</div>
                            <div className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">{card.name}</div>
                            <p className="text-[10px] text-gray-400 mt-2">{card.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Revenue Performance</h3>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
                                <TrendingUp size={14} /> Live Volume
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-6">Revenue growth based on verified asset purchases.</p>
                        
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.chartData || []}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="text-gray-100 dark:text-zinc-800" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* My Stocks Side Panel */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Active Stocks <span className="text-blue-500 ml-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full text-xs">{stats?.stockCount || 0}</span></h3>
                        </div>
                        <div className="space-y-4">
                            {stats?.topStocks?.map((stock, i) => (
                                <div key={i} className="group p-4 bg-gray-50/50 dark:bg-zinc-800/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">{stock.symbol.substring(0, 2)}</div>
                                            <div>
                                                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate w-24">{stock.name}</div>
                                                <div className="text-[10px] text-gray-500">{stock.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-blue-600 dark:text-blue-400">${stock.price.toLocaleString()}</div>
                                            <div className={`text-[9px] font-bold ${stock.isNegative ? 'text-red-500' : 'text-green-500'}`}>{stock.changeValue}</div>
                                        </div>
                                    </div>
                                </div>
                            )) || (
                                <p className="text-center text-gray-500 py-10 text-xs">No stocks available</p>
                            )}
                        </div>
                        <button 
                            onClick={() => window.location.href = '/admin/stocks'}
                            className="w-full mt-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-all border border-transparent dark:border-zinc-800"
                        >
                            Manage All Stocks
                        </button>
                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}
