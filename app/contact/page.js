"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send, 
    MessageSquare, 
    CheckCircle2, 
    AlertCircle,
    Globe,
    Clock,
    ShieldCheck,
    Target
} from "lucide-react";
import Link from "next/link";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Failed to connect to the server.");
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Section 1: Contact Hero */}
            <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-8"
                        >
                            <ShieldCheck size={14} /> Available 24/7 Global Support
                        </motion.div>
                        <motion.h1 
                            {...fadeInUp}
                            className="text-5xl lg:text-7xl font-black anta-regular tracking-tight mb-6 leading-tight uppercase"
                        >
                            Get in <span className="text-blue-600">Touch</span>
                        </motion.h1>
                        <motion.p 
                            {...fadeInUp}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
                        >
                            Have a question about our platform or need technical assistance? Our team of experts is here to help you navigate the future of finance.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Section 2: Contact Content */}
            <section className="pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        
                        {/* Info Column */}
                        <div className="lg:col-span-2 space-y-10">
                            <motion.div {...fadeInUp} className="group">
                                <h3 className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">Direct Communication</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Email Us</p>
                                            <p className="font-black dark:text-white">support@vaultinvest.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase">Call Center</p>
                                            <p className="font-black dark:text-white">+1 (888) 123-4567</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                                <h3 className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-2">Global Presence</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                        <Globe className="text-blue-600 mb-4" size={24} />
                                        <h4 className="font-black text-sm uppercase mb-2">New York Office</h4>
                                        <p className="text-xs text-zinc-500 leading-relaxed">Financial District, Manhattan, NY 10004</p>
                                    </div>
                                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                        <Clock className="text-blue-600 mb-4" size={24} />
                                        <h4 className="font-black text-sm uppercase mb-2">Business Hours</h4>
                                        <p className="text-xs text-zinc-500 leading-relaxed">Mon - Fri: 08:00 - 20:00 EST<br/>Sat - Sun: Global Support</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-3">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>

                                <AnimatePresence mode="wait">
                                    {status === "success" ? (
                                        <motion.div 
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-20"
                                        >
                                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                                                <CheckCircle2 size={48} />
                                            </div>
                                            <h2 className="text-3xl font-black mb-4 uppercase">Message Sent!</h2>
                                            <p className="text-zinc-500 max-w-xs mx-auto mb-10">We've received your inquiry and our experts will contact you within 24 hours.</p>
                                            <button 
                                                onClick={() => setStatus("idle")}
                                                className="px-10 py-4 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-full font-black uppercase text-xs tracking-widest transition-all hover:scale-105"
                                            >
                                                Send Another Message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form 
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:text-white"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                                                    <input 
                                                        required
                                                        type="email" 
                                                        placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Subject</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="Inquiry about Options Trading"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:text-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Your message</label>
                                                <textarea 
                                                    required
                                                    rows={6}
                                                    placeholder="How can we help you?"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all dark:text-white resize-none"
                                                />
                                            </div>

                                            {status === "error" && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                                                >
                                                    <AlertCircle size={18} /> {errorMessage}
                                                </motion.div>
                                            )}

                                            <button 
                                                disabled={status === "loading"}
                                                type="submit"
                                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {status === "loading" ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>Send Secure Message <Send size={18} /></>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Cards */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-10 bg-zinc-900 text-white rounded-[40px] group transition-all duration-500 hover:scale-[1.02]">
                            <MessageSquare className="mx-auto mb-6 text-blue-500" size={40} />
                            <h3 className="text-xl font-black mb-4 uppercase">Live Chat</h3>
                            <p className="text-zinc-400 text-sm mb-8">Average response time: 2 minutes.</p>
                            <Link href="#" className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300">Open Assistant</Link>
                        </div>
                        <div className="p-10 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[40px] transition-all duration-500 hover:scale-[1.02]">
                            <Target className="mx-auto mb-6 text-blue-600" size={40} />
                            <h3 className="text-xl font-black mb-4 uppercase">Knowledge Base</h3>
                            <p className="text-zinc-500 text-sm mb-8">Comprehensive guides for every feature.</p>
                            <Link href="/resources" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Explore Guides</Link>
                        </div>
                        <div className="p-10 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[40px] transition-all duration-500 hover:scale-[1.02]">
                            <ShieldCheck className="mx-auto mb-6 text-blue-600" size={40} />
                            <h3 className="text-xl font-black mb-4 uppercase">Data Security</h3>
                            <p className="text-zinc-500 text-sm mb-8">Learn how we protect your information.</p>
                            <Link href="/company" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Security Report</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ContactPage;
