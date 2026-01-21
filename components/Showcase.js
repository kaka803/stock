"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Showcase() {
  const investments = [
    "Stocks",
    "Bonds",
    "Treasuries",
    "Options",
    "Crypto",
    "ETFs",
  ];

  const accounts = [
    { name: "Bonds Account", badge: "5.0% YIELD" },
    { name: "High-Yield Cash Account", badge: "3.2% APY*" },
    { name: "Treasury Account", badge: null },
    { name: "Direct Indexing", badge: null },
    { name: "IRAs", badge: "1% match" },
    { name: "Investment Plans", badge: null },
  ];

  // 3D Tilt Logic
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="bg-white pb-24 overflow-hidden dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        
        {/* 3D Dashboard Container */}
        <div 
            style={{ perspective: "1200px" }} 
            className="flex justify-center mb-20 relative"
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative z-10 w-full max-w-7xl cursor-pointer"
                
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                

                {/* Main Image Card */}
                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden p-2 transform-gpu dark:bg-zinc-900/50 dark:border-zinc-700/50">
                    <Image
                        src="/showcase1.png"
                        alt="Stock Trading Dashboard"
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain rounded-xl shadow-inner"
                        priority
                    />
                    
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-linear-to-tr from-white/40 via-transparent to-transparent opacity-50 pointer-events-none rounded-2xl" />
                </div>
            </motion.div>
        </div>

        {/* Investment Tags */}
        <div className="flex flex-col items-center gap-8 font-sans">
            {/* Top Row: Clean Glass Pills */}
            <div 
                
                className="flex flex-wrap justify-center items-center gap-3"
            >
                {investments.map((item, index) => (
                    <span 
                        key={item} 
                        className="px-5 py-2 rounded-full border border-gray-200 bg-gray-50/50 text-gray-600 font-medium text-sm hover:border-gray-400 hover:scale-105 transition-all duration-300 cursor-default shadow-sm backdrop-blur-sm dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                    >
                        {item}
                    </span>
                ))}
            </div>

            {/* Bottom Row: Feature Cards */}
            <div 
               
                className="flex flex-wrap justify-center items-center gap-4 max-w-5xl"
            >
                 {accounts.map((account) => (
                    <div 
                        key={account.name} 
                        className="group flex items-center gap-3 px-6 py-3 rounded-xl border border-transparent bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 dark:bg-zinc-900 dark:hover:border-blue-900"
                    >
                         <span className="font-semibold text-gray-800 text-xl dark:text-white">{account.name}</span>
                         {account.badge && (
                             <span className="bg-linear-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/30">
                                 {account.badge}
                             </span>
                         )}
                    </div>
                 ))}
            </div>
        </div>
      </div>
    </section>
  );
}
