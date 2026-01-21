'use client'
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Edit2, Check, X, Shield, Camera, Loader2, ArrowRight } from "lucide-react";

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        currentPassword: "",
        newPassword: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                currentPassword: "",
                newPassword: ""
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to update profile");

            setUser(data.user);
            setIsEditing(false);
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
            <Navbar />
            
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative overflow-hidden">
                                {user.name?.charAt(0).toUpperCase()}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={24} />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-black"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold text-black dark:text-white mb-2 anta-regular"
                            >
                                {user.name}
                            </motion.h1>
                            <p className="text-gray-500 dark:text-zinc-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} /> {user.email}
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    {user.role}
                                </span>
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                                isEditing 
                                ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" 
                                : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            }`}
                        >
                            {isEditing ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">Security Status</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-600">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-medium dark:text-zinc-300">Verified</span>
                                        </div>
                                        <Check size={18} className="text-green-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                                                <Lock size={18} />
                                            </div>
                                            <span className="text-sm font-medium dark:text-zinc-300">2FA Active</span>
                                        </div>
                                        <div className="w-8 h-4 bg-blue-500 rounded-full flex items-center px-1">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm text-center">
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4 italic">"Invest in your future, start today."</p>
                                <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors">
                                    Go to Dashboard <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="md:col-span-2">
                            <AnimatePresence mode="wait">
                                {message.text && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium ${
                                            message.type === "success" 
                                            ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                        }`}
                                    >
                                        {message.type === "success" ? <Check size={18} /> : <X size={18} />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 dark:text-zinc-500 px-1 uppercase tracking-wider">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input 
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 text-black dark:text-white font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 dark:text-zinc-500 px-1 uppercase tracking-wider">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input 
                                                    type="tel"
                                                    disabled={!isEditing}
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 text-black dark:text-white font-medium"
                                                    placeholder="+1 234 567 890"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-6 pt-6 border-t border-gray-100 dark:border-zinc-800"
                                        >
                                            <h3 className="text-lg font-bold text-black dark:text-white">Change Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-500 dark:text-zinc-500 px-1 uppercase tracking-wider">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input 
                                                            type="password"
                                                            value={formData.currentPassword}
                                                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black dark:text-white font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-500 dark:text-zinc-500 px-1 uppercase tracking-wider">New Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input 
                                                            type="password"
                                                            value={formData.newPassword}
                                                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black dark:text-white font-medium"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {isEditing && (
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Save Changes</>}
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
