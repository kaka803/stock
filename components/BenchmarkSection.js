"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BenchmarkSection = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(() => {
    // Heading Staggered Reveal
    const headingLines = headingRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(headingLines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="pb-24 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 ref={headingRef} className="anta-regular text-4xl md:text-5xl font-bold text-center mb-16 max-w-4xl mx-auto leading-tight tracking-tight text-black dark:text-white">
          <div className="overflow-hidden"><span className="line-inner block">A fresh benchmark for</span></div>
          <div className="overflow-hidden"><span className="line-inner block">modern, active traders.</span></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- Card 1: Options Rebates --- */}
          <div className="bg-black text-white rounded-2xl p-8 flex flex-col h-full shadow-2xl hover:scale-[1.01] transition-transform duration-300 dark:bg-zinc-900 dark:border dark:border-zinc-800">
            {/* Visual: Rebate Table */}
            <div className="mb-10 mt-2">
              <div className="text-[11px] font-medium tracking-wide w-full">
                {/* Header */}
                <div className="grid grid-cols-[1fr_2fr_1fr] border-b border-gray-800 pb-2 mb-2 text-gray-500 uppercase tracking-widest text-[9px]">
                  <div className="pl-2"></div>
                  <div className="text-center">Rebate</div>
                  <div className="text-right pr-2">Fees</div>
                </div>

                {/* Public Row (Highlighted) */}
                <div className="grid grid-cols-[1fr_2fr_1fr] items-center bg-cyan-900/20 border border-cyan-500/30 rounded py-4 relative mb-3">
                  <div className="pl-4 font-bold text-white flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  </div>
                  <div className="text-center text-cyan-400 font-bold leading-tight">
                    Earn up to $0.18
                     <div className="text-[9px] text-cyan-500/70 font-normal mt-0.5">per contract</div>
                  </div>
                  <div className="text-right pr-4 text-cyan-400 font-mono">$0.00</div>
                </div>

                {/* Competitor Rows */}
                {["Robinhood", "Fidelity", "TD Ameritrade"].map((name, i) => (
                    <div key={name} className="grid grid-cols-[1fr_2fr_1fr] py-3 border-b border-gray-800 text-gray-500 last:border-0 hover:bg-white/5 transition-colors duration-200">
                        <div className="pl-2">{name}</div>
                        <div className="text-center text-red-500/80 font-medium">None</div>
                        <div className="text-right pr-2 font-mono">{i === 0 ? "$0.03" : "$0.65"}</div>
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="anta-regular text-2xl font-semibold mb-3 tracking-wide">Trade options. Get rebates.</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Public is the only investment platform that rewards you for trading options paying rebates of $0.06 to $0.18 per contract.
              </p>
              <Link href="/help-center" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm transition-all">
                Learn more <span className="text-lg">›</span>
              </Link>
            </div>
          </div>

          {/* --- Card 2: Margin Rates --- */}
          <div className="bg-black text-white rounded-2xl p-8 flex flex-col h-full shadow-2xl hover:scale-[1.01] transition-transform duration-300 dark:bg-zinc-900 dark:border dark:border-zinc-800">
             {/* Visual: Bar Chart */}
            <div className="mb-10 mt-6 h-52 flex items-end justify-center px-4 relative">
                 {/* High Rate Label */}
                 <div className="absolute top-0 left-0">
                     <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">Avg Base Rate</div>
                     <div className="text-2xl font-bold text-gray-500">~6.5%</div>
                 </div>

                 {/* Bars Container */}
                 <div className="flex items-end gap-3 md:gap-4">
                     {/* Static Bars */}
                     {[8, 7, 5].map((h, i) => (
                        <div 
                            key={i}
                            style={{ height: `${h * 10}px` }}
                            className="w-8 border border-gray-700 bg-gray-800/50 relative"
                        />
                     ))}
                     
                     {/* Active Public Bar */}
                     <div className="w-12 h-10 relative z-10 -ml-1 bg-linear-to-t from-cyan-600 to-cyan-400 border border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                          {/* Float Label */}
                         <div className="absolute -top-12 -right-8 text-right z-20 whitespace-nowrap">
                             <div className="text-[10px] text-cyan-400 font-bold mb-0.5 uppercase tracking-wider">Lowest rate</div>
                             <div className="text-2xl font-bold text-white">5.65%</div>
                         </div>
                     </div>
                 </div>
            </div>

            <div className="mt-auto">
              <h3 className="anta-regular text-2xl font-semibold mb-3 tracking-wide">Lowest margin rates.</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Boost your buying power with a super-low base margin rate of just 5.65%—the lowest base rate among top brokerages.
              </p>
              <Link href="/help-center" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm transition-all">
                See margin rates <span className="text-lg">›</span>
              </Link>
            </div>
          </div>

          {/* --- Card 3: API --- */}
          <div className="bg-black text-white rounded-2xl p-8 flex flex-col h-full shadow-2xl hover:scale-[1.01] transition-transform duration-300 dark:bg-zinc-900 dark:border dark:border-zinc-800">
             {/* Visual: Code Snippet */}
            <div className="mb-10 mt-2 bg-[#0d0d0d] rounded-xl p-5 border border-gray-800 font-mono text-xs leading-loose relative shadow-inner">
               <div className="flex gap-1.5 opacity-40 mb-4 mt-1">
                   {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-600" />)}
               </div>
               
               <div className="space-y-1 relative text-gray-300">
                   <div>
                       <span className="text-purple-400">await</span> <span className="text-blue-400">client</span>.<span className="text-yellow-300">orders</span>.<span className="text-blue-300">create</span>({`{`}
                   </div>
                   <div className="pl-4">
                       <span className="text-gray-400">symbol</span>: <span className="text-green-400">"SPY"</span>,
                   </div>
                   <div className="pl-4">
                       <span className="text-gray-400">side</span>: <span className="text-green-400">"BUY"</span>,
                   </div>
                   <div className="pl-4">
                       <span className="text-gray-400">qty</span>: <span className="text-orange-400">100</span>,
                   </div>
                   <div>
                       {`})`}
                   </div>
                   <div className="mt-4 text-green-400 flex items-center gap-2">
                       <span>✔</span> Order Executed <span className="text-gray-600 text-[10px] ml-auto">14ms</span>
                   </div>
               </div>
            </div>

             <div className="mt-auto">
              <h3 className="anta-regular text-2xl font-semibold mb-3 tracking-wide">Trade via API.</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Access live market data and automate your trades, all while scoring rebates on your stock and ETF options trades.
              </p>
              <Link href="/help-center" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm transition-all">
                Read the docs <span className="text-lg">›</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BenchmarkSection;
