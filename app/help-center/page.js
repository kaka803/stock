"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Book, MessageCircle, Shield, CreditCard, User } from "lucide-react";
import Link from "next/link";

export default function HelpCenter() {
    const categories = [
        { icon: User, title: "Account & Profile", desc: "Manage your account settings and profile information." },
        { icon: CreditCard, title: "Billing & Payments", desc: "Information about subscription plans and payment methods." },
        { icon: Shield, title: "Security & Privacy", desc: "Learn how we protect your data and security settings." },
        { icon: Book, title: "Getting Started", desc: "New to Logo? Start here to learn the basics." },
        { icon: MessageCircle, title: "Support", desc: "Need more help? Our support team is here for you." },
    ];

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 anta-regular">Help Center</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
                            Search our knowledge base or browse categories below to find answers to your questions.
                        </p>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                            <input 
                                type="text"
                                placeholder="Search for help..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {categories.map((cat, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                    <cat.icon className="h-6 w-6 text-blue-500 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{cat.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                    {cat.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10 text-center anta-regular">Frequently Asked Questions</h2>
                        
                        <div className="space-y-4">
                            {[
                                { q: "How do I reset my password?", a: "You can reset your password by clicking 'Forgot Password' on the login page." },
                                { q: "What markets are available?", a: "We provide real-time data and trading for Stocks, Crypto, and Forex markets." },
                                { q: "Is my personal data secure?", a: "Yes, we use industry-standard encryption to protect all user data and communications." }
                            ].map((faq, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2">{faq.q}</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-20 p-10 rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-100 text-center">
                        <h3 className="text-2xl font-bold text-white dark:text-zinc-900 mb-4">Still need help?</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 mb-8 max-w-md mx-auto">
                            Our support specialists are typically available 24/7 to help you with any issues.
                        </p>
                        <Link 
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
