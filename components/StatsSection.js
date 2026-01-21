"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
    { name: "Apple Inc.", symbol: "AAPL", price: "182.45", change: "+1.25%", isPositive: true },
    { name: "Tesla, Inc.", symbol: "TSLA", price: "245.80", change: "-0.45%", isPositive: false },
    { name: "NVIDIA Corp.", symbol: "NVDA", price: "880.32", change: "+3.12%", isPositive: true },
    { name: "Microsoft", symbol: "MSFT", price: "410.15", change: "+0.85%", isPositive: true },
];

export default function StatsSection() {
    return (
        <section className="border-t border-white/5 bg-black/50 py-12 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.symbol}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all hover:border-white/20 hover:bg-zinc-800/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-white">{stat.symbol}</p>
                                    <p className="text-xs text-zinc-500">{stat.name}</p>
                                </div>
                                <div
                                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${stat.isPositive
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : "bg-red-500/10 text-red-500"
                                        }`}
                                >
                                    {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-white">${stat.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
