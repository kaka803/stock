"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GeneratedAssets() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);

  useGSAP(() => {
    // 1. Text Stagger Reveal (Hero Style)
    const textLines = textRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(textLines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out", // Clean Hero-style ease
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%", 
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Video Fade Up
    gsap.fromTo(videoRef.current,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: videoRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black text-white py-24 text-center overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Label */}
        <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-400">
                Generated Assets <Sparkles className="w-3 h-3" />
            </div>
        </div>

        {/* Heading & Subheading */}
        <div ref={textRef} className="mx-auto max-w-4xl mb-12">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 anta-regular">
             <div className="overflow-hidden"><span className="line-inner block">Transform any concept into a</span></div>
             <div className="overflow-hidden"><span className="line-inner block">custom index you can actually invest in.</span></div>
          </h2>
          <div className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
             <div className="overflow-hidden"><span className="line-inner block">Got an investment idea? Just share it our AI analyzes</span></div>
             <div className="overflow-hidden"><span className="line-inner block">thousands of assets using multiple factors and creates a</span></div>
             <div className="overflow-hidden"><span className="line-inner block">custom index from any prompt you give.</span></div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-16">
            <Link href="#" className="inline-block rounded-full border border-white px-8 py-3 text-sm font-semibold transition-colors hover:bg-white hover:text-black">
                Learn more
            </Link>
        </div>

        {/* Video Container */}
        <div ref={videoRef} className="relative w-full max-w-7xl mx-auto aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg border border-zinc-800 shadow-2xl">
             <video
                className="w-full h-full object-cover opacity-90"
                autoPlay
                loop
                muted
                playsInline
             >
                <source src="/tradvideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
             </video>
            
            {/* Overlay to fade bottom/blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}
