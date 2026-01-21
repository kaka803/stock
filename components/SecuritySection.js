"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function SecuritySection() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    // 1. Looping Glow Animation
    gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 2. Header Reveal
    const headerLines = headerRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(headerLines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 3. Grid Reveal
    const items = gridRef.current.children;
    gsap.fromTo(items,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#020C1F] text-white py-24 overflow-hidden">
        {/* Glow Effect */}
        <div 
            ref={glowRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[radial-gradient(circle_at_center,#0055FF_0%,transparent_70%)] opacity-40 blur-[100px] pointer-events-none"
        />

       <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="mb-24 text-center">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 anta-regular leading-tight">
                <div className="overflow-hidden"><span className="line-inner block">Built with security at its core.</span></div>
                <div className="overflow-hidden"><span className="line-inner block">Open and transparent by intention.</span></div>
            </h2>
        </div>

        {/* Separator */}
        <hr className="border-white/20 mb-16 opacity-50" />

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            
            <SecurityItem 
                title="Regulated in the US"
                description="Brokerage services for US-listed, registered securities are offered through Public Investing, Inc., a registered broker-dealer and FINRA/SIPC member."
                subtext="FINRA"
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />
             <SecurityItem 
                title="Insurance coverage"
                description="SIPC protects the cash and securities in your portfolio up to $500,000. FDIC provides up to $5 million in protection for your High-Yield Cash Account."
                subtext="FINRA"
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />
             <SecurityItem 
                title="Financial-grade security"
                description="We secure your data on Public with AES 256-bit encryption and the latest TLS protocols, ensuring your information stays protected at all times."
                subtext="FINRA"
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />
             <SecurityItem 
                linkText="Learn more"
                linkHref="/help-center"
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />
             <SecurityItem 
                title="Fee transparency"
                description="Our straightforward fee structure can help you understand exactly what things cost—and what our incentives are as a business."
                 linkText="Learn more"
                linkHref="/help-center"
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />
             <SecurityItem 
                title="99.994% uptime"
                description="Our reliable platform achieves 99.994% uptime, keeping you connected to the markets whenever you need, so you never miss an opportunity to invest."
                icon={<Shield className="w-6 h-6 text-blue-400 mb-4" />}
            />

        </div>
         
         {/* Bottom Separator */}
         <hr className="border-white/20 mt-16 opacity-50" />

       </div>
    </section>
  );
}

function SecurityItem({ title, description, subtext, linkText, linkHref, icon }) {
    return (
        <div className="flex flex-col h-full group">
            {/* Icon (Added for creativity/visual anchor) */}
            <div className="transform transition-transform duration-500 group-hover:scale-110 origin-left">
                {icon}
            </div>
            
            <h3 className="text-2xl font-normal mb-4 group-hover:text-blue-300 transition-colors">{title}</h3>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-6 flex-1 group-hover:text-white transition-colors">
                {description}
            </p>
            <div className="mt-auto">
                 {subtext && (
                     <span className="text-lg font-bold tracking-widest uppercase text-white/90">{subtext}</span>
                 )}
                 {linkText && linkHref && (
                     <Link href={linkHref} className="text-sm font-medium hover:text-blue-300 flex items-center gap-1 transition-colors group-hover:translate-x-1">
                         {linkText} &rarr;
                     </Link>
                 )}
            </div>
        </div>
    )
}
