'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
    Send, 
    User, 
    Mail, 
    Type, 
    AlignLeft, 
    Search, 
    X, 
    CheckCircle2, 
    AlertCircle,
    Info,
    ArrowRight,
    Loader2
} from 'lucide-react';
import AdminPanelLayout from '@/components/AdminPanelLayout';

export default function AdminMailPage() {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [sending, setSending] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                if (data.success) setUsers(data.users);
            })
            .finally(() => setLoadingUsers(false));
    }, []);

    const filteredUsers = useMemo(() => {
        if (!recipient || recipient.includes('@')) return [];
        return users.filter(user => 
            user.name?.toLowerCase().includes(recipient.toLowerCase()) || 
            user.email?.toLowerCase().includes(recipient.toLowerCase())
        ).slice(0, 5);
    }, [users, recipient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatus(null);

        try {
            const res = await fetch('/api/admin/mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: recipient, subject, message })
            });
            const data = await res.json();
            
            if (data.success) {
                setStatus({ 
                    type: 'success', 
                    message: data.simulated ? 'Email sent (Simulated - Check console)' : 'Email sent successfully to ' + recipient 
                });
                setRecipient('');
                setSubject('');
                setMessage('');
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to send email' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred' });
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminPanelLayout>
            <div className="max-w-4xl mx-auto pb-20">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Mail size={12} /> Communication Hub
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight anta-regular">Compose Message</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Send professional updates, alerts, or personal notes to your users.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                        {/* Sidebar Info */}
                        <div className="lg:col-span-2 bg-gray-50/50 dark:bg-black/20 p-10 border-r border-gray-100 dark:border-zinc-800">
                            <h3 className="text-xl font-bold mb-6">Quick Tips</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Search, title: 'Smart Search', desc: 'Type a user name to see email suggestions automatically.' },
                                    { icon: AlignLeft, title: 'Formatting', desc: 'Use clear line breaks for better readability in the recipient inbox.' },
                                    { icon: Info, title: 'Security', desc: 'Attachments are currently not supported for security reasons.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="p-2.5 h-fit bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 text-blue-500">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-tight mb-1">{item.title}</p>
                                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-600/20">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Connected Users</p>
                                <p className="text-3xl font-bold mb-4">{users.length}</p>
                                <div className="flex -space-x-3 overflow-hidden">
                                    {users.slice(0, 5).map((user, i) => (
                                        <div key={i} className="flex h-8 w-8 rounded-full ring-2 ring-blue-600 bg-white/20 backdrop-blur-sm items-center justify-center text-[10px] font-bold">
                                            {user.name?.[0]}
                                        </div>
                                    ))}
                                    {users.length > 5 && (
                                        <div className="flex h-8 w-8 rounded-full ring-2 ring-blue-600 bg-white/40 items-center justify-center text-[10px] font-bold">
                                            +{users.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Compose Form */}
                        <div className="lg:col-span-3 p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Status Toggle */}
                                {status && (
                                    <div className={`p-4 rounded-2xl flex items-start gap-3 animate-slide-up ${
                                        status.type === 'success' 
                                        ? 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20' 
                                        : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20'
                                    }`}>
                                        {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                                        <p className="text-xs font-bold">{status.message}</p>
                                        <button onClick={() => setStatus(null)} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
                                    </div>
                                )}

                                <div className="space-y-2 relative">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Recipient Email</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                                        <input 
                                            required
                                            type="text"
                                            value={recipient}
                                            onChange={(e) => { setRecipient(e.target.value); setShowSuggestions(true); }}
                                            onFocus={() => setShowSuggestions(true)}
                                            className="w-full bg-gray-50/50 dark:bg-black/50 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal" 
                                            placeholder="User name or email address..." 
                                        />
                                    </div>
                                    
                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && filteredUsers.length > 0 && (
                                        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            {filteredUsers.map((u) => (
                                                <button
                                                    key={u._id}
                                                    type="button"
                                                    onClick={() => { setRecipient(u.email); setShowSuggestions(false); }}
                                                    className="w-full text-left px-5 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-between group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">{u.name}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">{u.email}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Subject Line</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                                        <input 
                                            required
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full bg-gray-50/50 dark:bg-black/50 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:font-normal" 
                                            placeholder="e.g. Account Verification Update" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Message Body</label>
                                    <textarea 
                                        required
                                        rows="10"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-gray-50/50 dark:bg-black/50 border border-gray-100 dark:border-zinc-800 rounded-[28px] p-6 font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm leading-relaxed" 
                                        placeholder="Write your message here..." 
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={sending}
                                        className="w-full bg-blue-600 text-white py-5 rounded-[28px] font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} /> Dispatching...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={24} /> Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}
