'use client';
import { useEffect, useState, useMemo } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Eye, 
    X, 
    Search, 
    Filter, 
    Download, 
    RefreshCw,
    TrendingUp,
    AlertCircle,
    User,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Calendar,
    Wallet
} from 'lucide-react';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchWithdrawals = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        try {
            const res = await fetch('/api/admin/withdrawals');
            const data = await res.json();
            if (data.success) {
                setWithdrawals(data.withdrawals);
            }
        } catch (error) {
            console.error("Failed to fetch withdrawals", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const stats = useMemo(() => {
        const total = withdrawals.length;
        const pending = withdrawals.filter(w => w.status === 'pending').length;
        const verified = withdrawals.filter(w => w.status === 'verified').length;
        const totalVolume = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
        return { total, pending, verified, totalVolume };
    }, [withdrawals]);

    const filteredWithdrawals = useMemo(() => {
        return withdrawals.filter(w => {
            const matchesSearch = 
                w.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.paymentDetail?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [withdrawals, searchQuery, statusFilter]);

    const handleStatusUpdate = async (withdrawalId, newStatus) => {
        const remarks = newStatus === 'rejected' ? prompt("Enter rejection reason:") : "";
        if (newStatus === 'rejected' && remarks === null) return;
        
        if (!confirm(`Are you sure you want to mark this withdrawal as ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/withdrawals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ withdrawalId, status: newStatus, remarks })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Withdrawal marked as ${newStatus}`);
                fetchWithdrawals(true);
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    return (
        <AdminPanelLayout>
            <div className="space-y-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight anta-regular">Withdrawal Requests</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and process user withdrawal orders (Binance).</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchWithdrawals(true)} 
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Requests', value: stats.total, icon: TrendingUp, color: 'blue' },
                        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'yellow' },
                        { label: 'Processed Success', value: stats.verified, icon: CheckCircle, color: 'green' },
                        { label: 'Total Withdrawn', value: `$${stats.totalVolume.toLocaleString()}`, icon: ArrowUpRight, color: 'purple' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2.5 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-900/20 text-${s.color}-600 dark:text-${s.color}-400`}>
                                    <s.icon size={20} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Symbol, User, or Binance ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-zinc-800/30">
                                <tr className="border-b border-gray-100 dark:border-zinc-800 whitespace-nowrap">
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Request ID</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">User Details</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Asset & Qty</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Binance Detail</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-right">Payment Amount (USDT)</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="7" className="px-6 py-8">
                                                <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredWithdrawals.map((w) => (
                                    <tr key={w._id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-all duration-200 whitespace-nowrap">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-500 font-mono text-[10px]">
                                                    #{w._id.substring(w._id.length - 6).toUpperCase()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {getInitials(w.user?.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{w.user?.name || 'Deleted User'}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">{w.user?.email || 'No email available'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-extrabold">{w.symbol}</span>
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                        {w.assetType}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {w.quantity.toFixed(4)} Units
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Wallet size={14} className="text-zinc-400" />
                                                <span className="text-sm font-semibold">{w.paymentDetail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <div className="flex flex-col items-end">
                                                <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                                                    ${w.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                                <div className="text-[10px] font-bold uppercase text-zinc-400">USDT to Pay</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                                                w.status === 'verified' 
                                                ? 'bg-green-50/50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20' 
                                                : w.status === 'rejected' 
                                                ? 'bg-red-50/50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20' 
                                                : 'bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    w.status === 'verified' ? 'bg-green-500' : 
                                                    w.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                                                } animate-pulse`} />
                                                {w.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {w.status === 'pending' ? (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(w._id, 'verified')}
                                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95"
                                                        title="Approve Withdrawal"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(w._id, 'rejected')}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95"
                                                        title="Reject Withdrawal"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-gray-300 dark:text-zinc-800 flex justify-end">
                                                    <ChevronRight size={18} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filteredWithdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-full mb-4">
                                                    <Search size={40} className="opacity-20" />
                                                </div>
                                                <p className="text-lg font-bold">No matching requests found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}
