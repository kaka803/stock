"use client";

import Link from "next/link";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-wide anta-regular">Logo</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/" className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                        Home
                    </Link>
                    {/* Product Dropdown */}
                    <div className="group relative">
                        <button className="flex items-center gap-1 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
                            Product
                            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        <div className="invisible absolute top-full -left-4 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            <div className="w-80 rounded-xl bg-zinc-900 p-2 shadow-xl ring-1 ring-white/10">
                                <div className="flex flex-col">
                                    {[
                                        { name: "Stocks", desc: "Buy and sell shares of companies", href: "/stocks" },
                                        { name: "ETFs", desc: "Diversify with Exchange Traded Funds", href: "/etfs" },
                                        { name: "Crypto", desc: "Trade digital currencies", href: "/crypto" },
                                        { name: "Forex", desc: "Trade currency pairs", href: "/forex" },
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex flex-col gap-0.5 rounded-lg p-3 transition-colors hover:bg-white/10"
                                        >
                                            <span className="text-sm font-semibold text-white">{item.name}</span>
                                            <span className="text-xs text-zinc-400">{item.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tools & Resources Dropdown */}
                    <div className="group relative">
                        <button className="flex items-center gap-1 text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">
                            Tools & Resources
                            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        <div className="invisible absolute top-full -left-4 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            <div className="w-80 rounded-xl bg-zinc-900 p-2 shadow-xl ring-1 ring-white/10">
                                <div className="flex flex-col">
                                    {[
                                        { name: "Loyalty Program", desc: "Earn points and redeem rewards", href: "/resources" },
                                        { name: "Profit Calculator", desc: "Calculate your potential returns", href: "/tools/profit-calculator" },
                                        { name: "Market News", desc: "Latest financial updates", href: "/tools/market-news" },
                                        { name: "Glossary", desc: "Learn trading terms", href: "/tools/glossary" },
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex flex-col gap-0.5 rounded-lg p-3 transition-colors hover:bg-white/10"
                                        >
                                            <span className="text-sm font-semibold text-white">{item.name}</span>
                                            <span className="text-xs text-zinc-400">{item.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/company" className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                        Company
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="hidden items-center gap-4 md:flex">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full p-2 text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle theme"
                    >
                         {mounted ? (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />) : <Moon size={20} className="opacity-0" />}
                    </button>
                    
                    {user ? (
                        <div className="group relative">
                            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:bg-white/10">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white uppercase">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                                <span className="text-sm font-medium text-white">{user.name}</span>
                                <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="invisible absolute top-full right-0 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                <div className="w-48 rounded-xl bg-zinc-900 p-1 shadow-xl ring-1 ring-white/10">
                                    <Link href="/dashboard" className="block rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white">
                                        Dashboard
                                    </Link>
                                    <Link href="/profile" className="block rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full rounded-lg px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 hover:text-red-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-full border border-white px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="text-white md:hidden"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) {
                            setIsMobileProductsOpen(false);
                            setIsMobileUserOpen(false); // Reset menus when closing/opening
                        }
                    }}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 ease-in-out md:hidden ${
                    isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
                }`}
            >
                <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col space-y-2 p-6 pb-20">
                        {/* Main Links */}
                        <Link
                            href="/"
                            className="flex items-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-lg font-semibold text-white">Home</span>
                        </Link>

                        {/* Products Accordion */}
                        <div className="flex flex-col p-2 space-y-2">
                            <button 
                                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left"
                            >
                                <span className="text-lg font-semibold text-white">Products</span>
                                <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isMobileProductsOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <div className={`grid transition-all duration-300 ease-in-out ${isMobileProductsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col gap-2 p-2 pl-4">
                                        {[
                                            { name: "Stocks", href: "/stocks", icon: "📈" },
                                            { name: "ETFs", href: "/etfs", icon: "📊" },
                                            { name: "Crypto", href: "/crypto", icon: "₿" },
                                            { name: "Forex", href: "/forex", icon: "💱" },
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-base font-medium text-zinc-300">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tools Accordion */}
                        <div className="flex flex-col p-2 space-y-2">
                             <button 
                                onClick={() => setIsMobileUserOpen(!isMobileUserOpen)} // Repurposing state for generic mobile accordion if needed, but let's use a clear name
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-left"
                            >
                                <span className="text-lg font-semibold text-white">Tools & Resources</span>
                                <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isMobileUserOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <div className={`grid transition-all duration-300 ease-in-out ${isMobileUserOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col gap-2 p-2 pl-4">
                                        {[
                                            { name: "Loyalty Program", href: "/resources", icon: "🎁" },
                                            { name: "Profit Calculator", href: "/tools/profit-calculator", icon: "🧮" },
                                            { name: "Market News", href: "/tools/market-news", icon: "📰" },
                                            { name: "Glossary", href: "/tools/glossary", icon: "📚" },
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="text-base font-medium text-zinc-300">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/company"
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Company</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Contact</span>
                        </Link>

                        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <span className="font-semibold">Display Theme</span>
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all active:scale-95"
                                >
                                    {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
                                    <span className="text-sm font-medium capitalize">{theme}</span>
                                </button>
                            </div>

                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white uppercase shadow-lg shadow-blue-500/20">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="User" className="h-12 w-12 rounded-2xl object-cover" />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/dashboard"
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/5 transition-all text-sm font-semibold"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-semibold"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full p-4 rounded-2xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href="/login"
                                        className="flex h-14 items-center justify-center rounded-2xl bg-white font-bold text-black"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex h-14 items-center justify-center rounded-2xl border-2 border-white font-bold text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
