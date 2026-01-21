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

                    <Link href="/resources" className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                        Resources
                    </Link>
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

            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-t border-white/10 bg-black md:hidden">
                    <div className="flex flex-col space-y-4 p-6">
                        <Link
                            href="/"
                            className="text-base font-medium text-zinc-300 hover:text-white pb-2 border-b border-white/5"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {/* Products for Mobile */}
                        <div className="flex flex-col">
                            <button 
                                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                                className="flex items-center justify-between text-base font-medium text-zinc-300 hover:text-white pb-2"
                            >
                                <span className="flex items-center gap-2">
                                    Products
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileProductsOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <div className={`flex flex-col space-y-3 pl-4 overflow-hidden transition-all duration-300 ease-in-out ${isMobileProductsOpen ? "max-h-40 opacity-100 mt-2 mb-4" : "max-h-0 opacity-0"}`}>
                                {[
                                    { name: "Stocks", href: "/stocks" },
                                    { name: "Crypto", href: "/crypto" },
                                    { name: "Forex", href: "/forex" },
                                ].map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Other Links for Mobile */}
                        <Link
                            href="/resources"
                            className="text-base font-medium text-zinc-300 hover:text-white border-t border-white/5 pt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Resources
                        </Link>
                        <Link
                            href="/company"
                            className="text-base font-medium text-zinc-300 hover:text-white border-t border-white/5 pt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Company
                        </Link>
                        <Link
                            href="/contact"
                            className="text-base font-medium text-zinc-300 hover:text-white border-t border-white/5 pt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </Link>
                        <hr className="border-white/10" />
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-zinc-300 font-medium">Theme</span>
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="rounded-full p-2 text-white hover:bg-white/10"
                                >
                                    {mounted ? (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />) : <div className="h-5 w-5" />}
                                </button>
                            </div>
                            {user ? (
                                <div className="flex flex-col">
                                    <button 
                                        onClick={() => setIsMobileUserOpen(!isMobileUserOpen)}
                                        className="flex items-center justify-between px-2 py-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white uppercase">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="User" className="h-10 w-10 rounded-xl object-cover" />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-bold text-white">{user.name}</span>
                                                <span className="text-xs text-zinc-500">{user.email}</span>
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${isMobileUserOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <div className={`flex flex-col space-y-1 pl-12 overflow-hidden transition-all duration-300 ease-in-out ${isMobileUserOpen ? "max-h-48 opacity-100 mt-2 mb-2" : "max-h-0 opacity-0"}`}>
                                        <Link
                                            href="/dashboard"
                                            className="block py-3 text-sm font-medium text-zinc-400 hover:text-white"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block py-3 text-sm font-medium text-zinc-400 hover:text-white"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="flex w-full items-center py-3 text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-black"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex w-full items-center justify-center rounded-full border border-white py-3 text-sm font-semibold text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
