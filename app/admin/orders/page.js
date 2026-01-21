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
    Ticket
} from 'lucide-react';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedProof, setSelectedProof] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchOrders = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const verified = orders.filter(o => o.status === 'verified').length;
        const totalVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { total, pending, verified, totalVolume };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders(true);
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
                        <h2 className="text-3xl font-extrabold tracking-tight anta-regular">Orders Management</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and verify asset purchase transactions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchOrders(true)} 
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
                        { label: 'Total Orders', value: stats.total, icon: TrendingUp, color: 'blue' },
                        { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'yellow' },
                        { label: 'Verified Success', value: stats.verified, icon: CheckCircle, color: 'green' },
                        { label: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: ArrowUpRight, color: 'purple' },
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
                            placeholder="Search by Symbol, User Name, or Email..."
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
                        <button className="p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-zinc-800/30">
                                <tr className="border-b border-gray-100 dark:border-zinc-800 whitespace-nowrap">
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Transaction</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">User Details</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Asset & Volume</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-right">Total amount</th>
                                    <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center">Payment Proof</th>
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
                                ) : filteredOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-all duration-200 whitespace-nowrap">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-500 font-mono text-[10px]">
                                                    #{order._id.substring(order._id.length - 6).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    {getInitials(order.user?.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{order.user?.name || 'Deleted User'}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">{order.user?.email || 'No email available'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-extrabold">{order.symbol}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${order.type === 'crypto' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                                        {order.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {order.quantity.toLocaleString()} units @ ${order.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <div className="flex flex-col items-end">
                                                {order.appliedCardInfo ? (
                                                    <>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                                                            <Ticket size={10} />
                                                            {order.appliedCardInfo.name} ({order.appliedCardInfo.value}%)
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 line-through">
                                                            ${order.originalTotal?.toLocaleString()}
                                                        </div>
                                                        <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                            ${order.totalAmount?.toLocaleString()}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-sm font-bold text-black dark:text-white">
                                                        ${order.totalAmount?.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {order.paymentProof ? (
                                                <button 
                                                    onClick={() => setSelectedProof(order.paymentProof)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group/btn shadow-sm"
                                                >
                                                    <Eye size={14} /> 
                                                    View Proof
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 text-gray-300 dark:text-zinc-700 italic">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[11px] font-medium">None</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                                                order.status === 'verified' 
                                                ? 'bg-green-50/50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20 shadow-sm shadow-green-500/10' 
                                                : order.status === 'rejected' 
                                                ? 'bg-red-50/50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 shadow-sm shadow-red-500/10' 
                                                : 'bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20 shadow-sm shadow-amber-500/10'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    order.status === 'verified' ? 'bg-green-500' : 
                                                    order.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                                                } animate-pulse`} />
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {order.status === 'pending' ? (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'verified')}
                                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95"
                                                        title="Approve Order"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(order._id, 'rejected')}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95"
                                                        title="Reject Order"
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
                                {!loading && filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-full mb-4">
                                                    <Search size={40} className="opacity-20" />
                                                </div>
                                                <p className="text-lg font-bold">No matching orders found</p>
                                                <p className="text-sm font-medium">Try adjusting your filters or search query.</p>
                                                <button 
                                                    onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                                                    className="mt-4 text-blue-500 font-bold hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in"
                        onClick={() => setSelectedProof(null)}
                    />
                    <div className="relative bg-white dark:bg-zinc-900 rounded-[32px] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 z-10">
                            <div>
                                <h3 className="font-bold text-xl tracking-tight">Proof of Payment</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Transaction Verification</p>
                            </div>
                            <div className="flex gap-2">
                                <a 
                                    href={selectedProof} 
                                    download="payment-proof.png"
                                    className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-colors"
                                    title="Download Image"
                                >
                                    <Download size={20} />
                                </a>
                                <button 
                                    onClick={() => setSelectedProof(null)}
                                    className="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-2xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 bg-[#f8f9fa] dark:bg-black/50 flex items-center justify-center border-b border-gray-100 dark:border-zinc-800">
                            <img 
                                src={selectedProof} 
                                alt="Payment Proof" 
                                className="max-w-full max-h-[60vh] rounded-2zl shadow-2xl ring-1 ring-black/5 object-contain" 
                            />
                        </div>
                        <div className="p-6 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 font-bold">
                                <AlertCircle size={16} />
                                Please ensure the transaction hash and amount are visible.
                            </div>
                            <button 
                                onClick={() => setSelectedProof(null)}
                                className="w-full sm:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold shadow-lg shadow-black/10 hover:opacity-90 transition-all"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminPanelLayout>
    );
}
