"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AccountBenefits() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    // 1. Header Stagger
    const headerLines = headerRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(headerLines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Grid Columns Cascade
    const columns = gridRef.current.children;
    gsap.fromTo(columns,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // 3. CTA Fade Up
    gsap.fromTo(".cta-button",
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.5,
            scrollTrigger: {
                trigger: gridRef.current,
                start: "bottom 95%",
            }
        }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black text-white py-24 border-t border-zinc-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
            <div className="overflow-hidden mb-4">
                 <h3 className="line-inner text-blue-500 font-medium">Account Benefits</h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 anta-regular max-w-3xl mx-auto">
                <div className="overflow-hidden"><span className="line-inner block">As your portfolio grows, your</span></div>
                <div className="overflow-hidden"><span className="line-inner block">experience on Logo grows with it.</span></div>
            </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-800 bg-zinc-950/50">
            
            {/* Core */}
            <div className="group p-8 md:p-10 flex flex-col h-full hover:bg-zinc-900/80 transition-colors duration-300">
                <div className="mb-8">
                    <h4 className="text-xl font-medium text-white mb-2 anta-regular group-hover:text-blue-400 transition-colors">Core</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">$1+</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider border border-zinc-800 px-2 py-0.5 rounded group-hover:border-blue-500/30 group-hover:text-blue-400/70 transition-colors">account value</span>
                    </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                    <FeatureItem text="Multi-asset investing" />
                    <FeatureItem text="Industry-leading yields" />
                    <FeatureItem text="AI-powered analysis" />
                </ul>
            </div>

            {/* Premium */}
             <div className="group p-8 md:p-10 flex flex-col h-full hover:bg-zinc-900/80 transition-colors duration-300">
                <div className="mb-8">
                    <h4 className="text-xl font-medium text-white mb-2 anta-regular group-hover:text-blue-400 transition-colors">Premium</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">$50,000+</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider border border-zinc-800 px-2 py-0.5 rounded group-hover:border-blue-500/30 group-hover:text-blue-400/70 transition-colors">account value</span>
                    </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                     <FeatureItem text="Free extended-hours trading" highlight />
                     <FeatureItem text="Free Investment Plans" highlight />
                     <FeatureItem text="Priority support" highlight />
                </ul>
            </div>

            {/* Concierge */}
             <div className="group p-8 md:p-10 flex flex-col h-full hover:bg-zinc-900/80 transition-colors duration-300">
                <div className="mb-8">
                    <h4 className="text-xl font-medium text-white mb-2 anta-regular group-hover:text-blue-400 transition-colors">Concierge</h4>
                    <div className="flex items-baseline gap-2">
                         <span className="text-3xl font-bold">$100,000+</span> {/* Corrected value logical progression, keeping user layout */}
                        <span className="text-xs text-zinc-500 uppercase tracking-wider border border-zinc-800 px-2 py-0.5 rounded group-hover:border-blue-500/30 group-hover:text-blue-400/70 transition-colors">account value</span>
                    </div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                    <FeatureItem text="White-glove VIP support" highlight />
                    <FeatureItem text="Personalized offers" highlight />
                    <FeatureItem text="Exclusive invites" highlight />
                </ul>
            </div>
        </div>

        {/* CTA */}
         <div className="mt-16 text-center cta-button opacity-0">
            <Link href="/signup" className="inline-block rounded-full bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                Sign up
            </Link>
        </div>

      </div>
    </section>
  );
}

function FeatureItem({ text, highlight = false }) {
    return (
        <li className="flex items-start gap-3 group/item">
            <Check className={`w-4 anta-regular h-4 mt-1 transition-all duration-300 group-hover/item:scale-110 ${highlight ? 'text-blue-500 group-hover/item:text-blue-400' : 'text-zinc-500 group-hover/item:text-zinc-300'}`} />
            <span className="text-sm text-zinc-300 group-hover/item:text-white transition-colors">{text}</span>
        </li>
    )
}
