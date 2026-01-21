'use client';
import { useEffect, useState, useMemo } from 'react';
import { 
    Users, 
    UserCheck, 
    UserPlus, 
    Search, 
    Mail, 
    Phone, 
    ShieldCheck, 
    ShieldAlert,
    RefreshCw,
    Download,
    MoreVertical,
    ChevronRight,
    Calendar,
    Clock
} from 'lucide-react';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchUsers = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const stats = useMemo(() => {
        const total = users.length;
        const verified = users.filter(u => u.isVerified).length;
        const pending = total - verified;
        return { total, verified, pending };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.phone?.includes(searchQuery);
            
            const matchesStatus = 
                filterStatus === 'all' || 
                (filterStatus === 'verified' && user.isVerified) || 
                (filterStatus === 'pending' && !user.isVerified);
            
            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, filterStatus]);

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    return (
        <AdminPanelLayout>
            <div className="space-y-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight anta-regular">User Management</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Review accounts and verification status.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchUsers(true)} 
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            {refreshing ? 'Syncing...' : 'Refresh List'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Accounts', value: stats.total, icon: Users, color: 'blue' },
                        { label: 'Verified Users', value: stats.verified, icon: ShieldCheck, color: 'green' },
                        { label: 'Pending Verification', value: stats.pending, icon: ShieldAlert, color: 'orange' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden relative group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-500/5 rounded-bl-full transition-all group-hover:scale-110`} />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`p-4 rounded-2xl bg-${s.color}-50 dark:bg-${s.color}-900/15 text-${s.color}-600 dark:text-${s.color}-400`}>
                                    <s.icon size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-2xl font-bold">{s.value}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters Area */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find users by name, email or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[22px] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-6 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[22px] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        >
                            <option value="all">All Accounts</option>
                            <option value="verified">Verified Only</option>
                            <option value="pending">Pending Only</option>
                        </select>
                        <button className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[22px] text-gray-400 hover:text-black dark:hover:text-white transition-all">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-zinc-800/20">
                                <tr className="border-b border-gray-100 dark:border-zinc-800 whitespace-nowrap">
                                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Identity</th>
                                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Communication</th>
                                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Join Date</th>
                                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Verfication</th>
                                    <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-8 py-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full" />
                                                    <div className="space-y-2">
                                                        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-48" />
                                                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded w-32" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user) => (
                                    <tr key={user._id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-all duration-300 whitespace-nowrap">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-4 ring-white dark:ring-zinc-900">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                                                        <Clock size={10} /> 
                                                        ID: {user._id.substring(user._id.length - 8).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    <Mail size={12} className="text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                                user.isVerified 
                                                ? 'bg-green-50/50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20' 
                                                : 'bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`} />
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-full mb-6 relative">
                                                    <Users size={48} className="text-gray-200 dark:text-zinc-700" />
                                                    <Search size={24} className="absolute bottom-2 right-2 text-blue-500" />
                                                </div>
                                                <h3 className="text-xl font-bold tracking-tight mb-2">No accounts found</h3>
                                                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mb-8">
                                                    We couldn't find any users matching your criteria. Try adjusting your search term.
                                                </p>
                                                <button 
                                                    onClick={() => {setSearchQuery(''); setFilterStatus('all');}}
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                                >
                                                    View All Accounts
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
        </AdminPanelLayout>
    );
}
