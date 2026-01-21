'use client';
import { useEffect, useState, useMemo } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    DollarSign, 
    Activity, 
    BarChart3, 
    X, 
    Check, 
    Info, 
    Globe, 
    PieChart,
    TrendingUp,
    Briefcase,
    Building2,
    RefreshCw,
    LayoutGrid,
    List
} from 'lucide-react';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminStocksPage() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStock, setEditingStock] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        price: '',
        description: '',
        marketCap: 'N/A',
        peRatio: 'N/A',
        dividendYield: '0.00%',
        revenue: 'N/A',
    });

    const fetchStocks = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await fetch('/api/admin/stocks');
            const data = await res.json();
            if (data.success) {
                setStocks(data.stocks);
            }
        } catch (error) {
            console.error("Failed to fetch stocks", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const stats = useMemo(() => {
        const total = stocks.length;
        const avgPrice = stocks.length > 0 ? (stocks.reduce((sum, s) => sum + parseFloat(s.price || 0), 0) / stocks.length).toFixed(2) : 0;
        const customCount = stocks.filter(s => s.isCustom).length;
        return { total, avgPrice, customCount };
    }, [stocks]);

    const filteredStocks = useMemo(() => {
        return stocks.filter(s => 
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [stocks, searchQuery]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingStock ? 'PUT' : 'POST';
        const url = editingStock ? `/api/admin/stocks/${editingStock._id}` : '/api/admin/stocks';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                fetchStocks(true);
                setIsModalOpen(false);
                setEditingStock(null);
                setFormData({
                    name: '', symbol: '', price: '', description: '',
                    marketCap: 'N/A', peRatio: 'N/A', dividendYield: '0.00%', revenue: 'N/A'
                });
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Operation failed");
        }
    };

    const handleEdit = (stock) => {
        setEditingStock(stock);
        setFormData({
            name: stock.name,
            symbol: stock.symbol,
            price: stock.price,
            description: stock.description,
            marketCap: stock.marketCap,
            peRatio: stock.peRatio,
            dividendYield: stock.dividendYield,
            revenue: stock.revenue,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this stock? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/stocks/${id}`, { method: 'DELETE' });
            if (res.ok) fetchStocks(true);
        } catch (error) {
            alert("Delete failed");
        }
    };

    return (
        <AdminPanelLayout>
            <div className="space-y-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight anta-regular">Stock Inventory</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage custom listings and view market data.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => fetchStocks(true)} 
                            disabled={refreshing}
                            className="p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                        >
                            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                        <button 
                            onClick={() => { setEditingStock(null); setIsModalOpen(true); }}
                            className="flex-1 md:flex-none justify-center bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
                        >
                            <Plus size={20} /> Add New Stock
                        </button>
                    </div>
                </div>

                {/* Stats Summary Area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Listings', value: stats.total, icon: Briefcase, color: 'blue' },
                        { label: 'Custom Stock', value: stats.customCount, icon: LayoutGrid, color: 'purple' },
                        { label: 'Average Price', value: `$${stats.avgPrice}`, icon: TrendingUp, color: 'green' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-${s.color}-50 dark:bg-${s.color}-900/20 text-${s.color}-600 dark:text-${s.color}-400`}>
                                <s.icon size={24} />
                            </div>
                            <div>
                                <div className="text-xl font-bold leading-tight">{s.value}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Layout Controls Area */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by Symbol or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-100 dark:bg-zinc-800/50 rounded-[32px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStocks.map((stock) => (
                            <div key={stock._id} className="relative bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                                {/* Geometric Background Shape for flare */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-bl-[64px] transition-all group-hover:bg-blue-500/10" />
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-gray-50 dark:ring-black">
                                        {stock.symbol.substring(0, 3)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(stock)} 
                                            className="p-2.5 bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all"
                                            title="Edit Stock"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(stock._id)} 
                                            className="p-2.5 bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all"
                                            title="Delete Stock"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold truncate tracking-tight">{stock.name}</h3>
                                    <p className="text-blue-500 font-bold text-sm tracking-wide">{stock.symbol}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-gray-50/50 dark:bg-black/50 p-4 rounded-[24px] border border-gray-100/50 dark:border-zinc-800/50">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 leading-none">Price</p>
                                        <p className="text-lg font-bold leading-none">${parseFloat(stock.price).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50/50 dark:bg-black/50 p-4 rounded-[24px] border border-gray-100/50 dark:border-zinc-800/50">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 leading-none">Change</p>
                                        <p className={`text-lg font-bold leading-none ${!stock.isNegative ? 'text-green-500' : 'text-red-500'}`}>
                                            {!stock.isNegative ? '↑' : '↓'} {stock.change || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-2 border-t border-gray-50 dark:border-zinc-800/50">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Market Cap</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{stock.marketCap}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">P/E Ratio</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{stock.peRatio}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stocks.length === 0 && (
                            <div className="col-span-full py-32 text-center bg-white dark:bg-zinc-900 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                                <Activity className="mx-auto mb-6 text-gray-200" size={64} />
                                <p className="text-xl font-bold text-gray-400">Inventory is Empty</p>
                                <p className="text-sm font-medium text-gray-500 mt-2">Start by adding your first custom stock listing.</p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-8 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                >
                                    Create Stock Listing
                                </button>
                            </div>
                        )}
                        {!loading && filteredStocks.length === 0 && stocks.length > 0 && (
                             <div className="col-span-full py-20 text-center">
                                <Search className="mx-auto mb-4 text-gray-300" size={48} />
                                <p className="text-gray-500 font-bold">No stocks match your search query.</p>
                             </div>
                        )}
                    </div>
                )}
            </div>

            {/* Premium Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                     <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/5 animate-scale-in">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-3xl font-bold tracking-tight anta-regular">{editingStock ? 'Edit Stock' : 'Create New Stock'}</h3>
                                    <p className="text-gray-500 font-medium text-sm mt-1">{editingStock ? 'Update listing parameters' : 'Define your custom asset details'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Asset Full name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal" placeholder="e.g. Quantum Dynamics" />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Stock Ticker</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input required name="symbol" value={formData.symbol} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal uppercase" placeholder="e.g. QDTX" />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Initial Listing Price ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Market Capitalization</label>
                                        <div className="relative">
                                            <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input name="marketCap" value={formData.marketCap} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. 5.2B" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Company information & background</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-[28px] p-6 font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm leading-relaxed" placeholder="Describe the company mission, services, and market position..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">P/E Ratio</label>
                                        <input name="peRatio" value={formData.peRatio} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Div. Yield</label>
                                        <input name="dividendYield" value={formData.dividendYield} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Revenue (TTM)</label>
                                        <input name="revenue" value={formData.revenue} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-[28px] font-bold text-xl hover:opacity-90 transition-all shadow-2xl shadow-black/20 dark:shadow-white/5 active:scale-[0.98]">
                                        {editingStock ? 'Update Asset Info' : 'Publish Stock Listing'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminPanelLayout>
    );
}
