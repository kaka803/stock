'use client';
import { useState, useEffect } from 'react';
import AdminPanelLayout from '@/components/AdminPanelLayout';
import { 
    UserPlus, 
    Trash2, 
    Mail, 
    Phone, 
    User as UserIcon,
    ShieldCheck,
    X,
    Plus,
    Loader2
} from 'lucide-react';

export default function SubAdminsPage() {
    const [subadmins, setSubadmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    const fetchSubAdmins = async () => {
        try {
            const res = await fetch('/api/admin/subadmins');
            const data = await res.json();
            if (data.success) {
                setSubadmins(data.subadmins);
            }
        } catch (err) {
            console.error("Failed to fetch sub-admins:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdmins();
    }, []);

    const handleAddSubAdmin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            const res = await fetch('/api/admin/subadmins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                setSubadmins([...subadmins, data.subadmin]);
                setShowModal(false);
                setFormData({ name: '', email: '', password: '', phone: '' });
            } else {
                setError(data.error || 'Failed to create sub-admin');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this sub-admin?')) return;
        
        try {
            const res = await fetch('/api/admin/subadmins', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setSubadmins(subadmins.filter(s => s._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete sub-admin:", err);
        }
    };

    return (
        <AdminPanelLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight anta-regular">Sub-admin Management</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage access for platform sub-admins.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <UserPlus size={20} />
                        Add New Sub-admin
                    </button>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-100 dark:border-zinc-800">
                        <h3 className="font-bold text-xl">Active Sub-admins</h3>
                    </div>
                    
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : subadmins.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="flex justify-center mb-4 text-gray-300">
                                <ShieldCheck size={64} />
                            </div>
                            <p className="text-gray-500 font-medium italic">No sub-admins found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 dark:border-zinc-800/50 whitespace-nowrap">
                                        <th className="px-8 py-5">Sub-admin Identity</th>
                                        <th className="px-8 py-5">Contact Details</th>
                                        <th className="px-8 py-5">Role / Permission</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/30">
                                    {subadmins.map((sa) => (
                                        <tr key={sa._id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 whitespace-nowrap">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 font-black">
                                                        {sa.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">{sa.name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Sub-admin ID: {sa._id.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                                        <Mail size={14} className="opacity-50" />
                                                        {sa.email}
                                                    </div>
                                                    {sa.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                                                            <Phone size={14} className="opacity-50" />
                                                            {sa.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <span className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit border border-green-500/10">
                                                        Full Sub-admin Access
                                                    </span>
                                                    <p className="text-[8px] text-gray-400 uppercase font-black leading-tight">Orders • Chats • Mail • Loyalty</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => handleDelete(sa._id)}
                                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                                    title="Delete sub-admin"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-2xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black anta-regular">New Sub-admin</h3>
                            <p className="text-sm text-gray-500 font-medium">Grant specialized administrative permissions.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                                <X size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleAddSubAdmin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                        placeholder="Sub-admin Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Email Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                        placeholder="email@subadmin.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                        placeholder="········"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Phone (Optional)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                        placeholder="+1 234..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <div className="flex items-center gap-2"><ShieldCheck size={20} /> Confirm Authorization</div>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminPanelLayout>
    );
}
