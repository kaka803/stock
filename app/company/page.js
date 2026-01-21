"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
    ShieldCheck, 
    Shield,
    Zap, 
    Globe, 
    Users, 
    Target, 
    Cpu, 
    Lock, 
    ArrowRight,
    Search,
    BarChart3,
    Trophy
} from "lucide-react";
import Link from "next/link";

const CompanyPage = () => {
    const { user } = useAuth();
    
    // Animation Variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        initial: {},
        whileInView: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Section 1: Interactive Hero */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] anima-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Globe size={14} /> Our Vision For 2026
                        </motion.div>
                        <motion.h1 
                            {...fadeInUp}
                            className="text-5xl lg:text-8xl font-black anta-regular tracking-tight mb-8 leading-[1.1]"
                        >
                            Redefining the <span className="text-blue-600">Future</span> of Finance.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10"
                        >
                            We are more than just a trading platform. We are building the infrastructure for a global, decentralized financial ecosystem that empowers every individual.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                                        Go to Dashboard <ArrowRight size={18} />
                                    </Link>
                                    <Link href="/stocks" className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full font-bold transition-all border border-zinc-200 dark:border-zinc-800">
                                        Explore Markets
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                                        Join the Mission <ArrowRight size={18} />
                                    </Link>
                                    <Link href="#story" className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full font-bold transition-all border border-zinc-200 dark:border-zinc-800">
                                        Explore Our Story
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 2: Our Journey (Timeline) */}
            <section id="story" className="py-24 bg-zinc-50 dark:bg-zinc-900/30 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col items-center text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black anta-regular tracking-tight mb-4 uppercase">Our Journey</h2>
                        <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 lg:ml-1/2 lg:pl-0 lg:border-l-0">
                        {/* Center Line for Desktop */}
                        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"></div>

                        {[
                            { year: "2020", title: "The Inception", desc: "Started with a vision to make stock trading accessible to everyone, everywhere.", icon: <Zap /> },
                            { year: "2022", title: "Global Expansion", desc: "Launched in 15+ countries and hit our first million users worldwide.", icon: <Globe /> },
                            { year: "2024", title: "AI Revolution", desc: "Integrated advanced predictive algorithms and automated analysis tools.", icon: <Cpu /> },
                            { year: "2026", title: "The Next Frontier", desc: "Leading the market with decentralized assets and instant settlements.", icon: <Target /> }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`relative mb-16 lg:mb-24 flex flex-col lg:flex-row items-center ${idx % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
                            >
                                {/* Dot */}
                                <div className="absolute left-[-9px] lg:left-1/2 lg:-translate-x-1/2 top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-black"></div>

                                <div className="w-full lg:w-[45%] pl-8 lg:pl-0">
                                    <div className={`p-8 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-xl ${idx % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                                        <span className="text-4xl font-black text-blue-600/20 mb-2 block">{item.year}</span>
                                        <h3 className="text-2xl font-black mb-4 uppercase">{item.title}</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Core Values (Bento Grid) */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black anta-regular tracking-tight mb-4 uppercase">Core Values</h2>
                        <p className="text-zinc-500">The principles that drive every decision we make.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div 
                            {...fadeInUp}
                            className="md:col-span-2 p-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-[40px] text-white overflow-hidden relative group"
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="text-4xl font-black mb-6 uppercase leading-tight">Security-First <br/>Architecture</h3>
                                    <p className="text-blue-100 text-lg max-w-md">Every transaction is protected by multi-layer encryption and real-time fraud monitoring systems.</p>
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Lock size={300} strokeWidth={1} />
                            </div>
                        </motion.div>

                        <motion.div 
                            {...fadeInUp}
                            transition={{ delay: 0.2 }}
                            className="p-10 bg-zinc-100 dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 group"
                        >
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-6 uppercase">Instant Speed</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Zero-latency execution for high-frequency trading across all asset classes.</p>
                        </motion.div>

                        <motion.div 
                            {...fadeInUp}
                            transition={{ delay: 0.3 }}
                            className="p-10 bg-zinc-900 text-white rounded-[40px] relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-6 uppercase">Global Access</h3>
                                <p className="text-zinc-400">Breaking down geographical barriers to finance, providing equal opportunities to all.</p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>

                        <motion.div 
                            {...fadeInUp}
                            transition={{ delay: 0.4 }}
                            className="md:col-span-2 p-10 bg-zinc-100 dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-10"
                        >
                            <div className="flex-1">
                                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-6 uppercase">User-Centric Growth</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">Our features are built based on direct community feedback, ensuring we solve real-world problems.</p>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white dark:bg-zinc-800 rounded-[24px] text-center shadow-lg">
                                    <span className="text-3xl font-black text-blue-600">5M+</span>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mt-2">Active Users</p>
                                </div>
                                <div className="p-6 bg-white dark:bg-zinc-800 rounded-[24px] text-center shadow-lg">
                                    <span className="text-3xl font-black text-blue-600">120+</span>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 mt-2">Countries</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 4: Technology & Security */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-6xl font-black anta-regular tracking-tight mb-8 leading-tight uppercase">Cutting Edge <br/>Infrastructure</h2>
                            <p className="text-zinc-400 text-lg mb-10">
                                We leverage the latest in cloud computing, encryption protocols, and machine learning to provide a trading experience that is both powerful and secure.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: <Lock />, title: "Military Grade Encryption", desc: "AES-256 bit encryption for all personal and financial data." },
                                    { icon: <Cpu />, title: "Quantum-Resistant Layer", desc: "Preparing for the future with quantum-secure transaction signing." },
                                    { icon: <BarChart3 />, title: "Real-time Analytics", desc: "Millisecond data refreshing for accurate market snapshots." }
                                ].map((feature, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default"
                                    >
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                                            <p className="text-sm text-zinc-500">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-[48px] border border-white/10 p-4 relative animate-pulse">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-dashed border-blue-500/30 rounded-full animate-spin-slow"></div>
                                    <div className="absolute w-40 h-40 border-2 border-dashed border-purple-500/20 rounded-full"></div>
                                    <Shield size={120} className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.5)]" />
                                </div>
                            </div>
                            
                            {/* Floating Stats */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-10 -right-5 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">System Status</p>
                                        <p className="font-black text-sm uppercase">100% Operational</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -bottom-5 -left-5 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Avg Response</p>
                                        <p className="font-black text-sm">45ms Global</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Final Call to Action */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-linear-to-br from-zinc-900 to-black rounded-[48px] p-12 lg:p-20 text-center relative overflow-hidden text-white"
                    >
                        {/* Interactive Background */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_70%)]"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/40">
                                <Trophy size={40} className="text-white" />
                            </div>
                            <h2 className="text-4xl lg:text-7xl font-black anta-regular tracking-tight mb-8 uppercase leading-tight">Ready to join the <br/>Top 1%?</h2>
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-12">
                                Start your investment journey with a company that prioritizes your success and security above all else.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                {user ? (
                                    <>
                                        <Link href="/dashboard" className="w-full sm:w-auto px-12 py-5 bg-white text-black hover:bg-zinc-100 rounded-full font-black text-lg transition-all shadow-xl">
                                            View Portfolio
                                        </Link>
                                        <Link href="/stocks" className="w-full sm:w-auto px-12 py-5 bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full font-black text-lg transition-all">
                                            Start Investing
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/signup" className="w-full sm:w-auto px-12 py-5 bg-white text-black hover:bg-zinc-100 rounded-full font-black text-lg transition-all shadow-xl">
                                            Create Account
                                        </Link>
                                        <Link href="/login" className="w-full sm:w-auto px-12 py-5 bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-full font-black text-lg transition-all">
                                            Login Now
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CompanyPage;
