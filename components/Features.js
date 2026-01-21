"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Spotlight Card Component (Clean & Futuristic) ---
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 dark:bg-zinc-900 dark:border-zinc-800 ${className}`}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.08), transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};


export default function Features() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    
    // 1. Title Staggered Reveal
    const headingLines = headingRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(headingLines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Subtitle Fade
    gsap.fromTo(".subtitle-text",
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: 0.2, // Wait for title
            ease: "power2.out",
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top 80%",
            }
        }
    );

    // 3. Grid Items Cascade
    const cards = gridRef.current.children;
    gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white py-20 max-md:py-0 overflow-hidden dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 ref={headingRef} className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-6 anta-regular dark:text-white">
            <div className="overflow-hidden"><span className="line-inner block">Five clever features that</span></div>
            <div className="overflow-hidden"><span className="line-inner block">true nerds will adore.</span></div>
          </h2>
          <p className="subtitle-text text-xl text-gray-600 font-normal opacity-0 dark:text-zinc-400">
            Explore even more features right in the app.
          </p>
        </div>

        {/* Feature Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1: Highlights */}
          <SpotlightCard className="flex flex-col opacity-0"> 
            <div className="flex flex-col p-8 items-center text-center h-full">
                <div className="mb-6">
                <h3 className="text-2xl font-medium text-gray-900 mb-3 dark:text-white">Highlights</h3>
                <p className="text-gray-500 leading-relaxed dark:text-zinc-400">
                    Get clear insights into why a stock's price moves with AI-powered
                    summaries, conveniently displayed directly on its performance chart.
                </p>
                <div className="mt-4 flex justify-center">
                    <a href="#" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 transition dark:text-white dark:hover:text-gray-300">
                        Learn more <span className="ml-1">→</span>
                    </a>
                </div>
                </div>
                <div className="relative w-full flex items-center justify-center mt-auto">
                    <Image
                        src="/pic.png"
                        alt="Highlights stock chart"
                        width={550}
                        height={412}
                        className="h-64 w-auto object-contain drop-shadow-sm rounded-md"
                    />
                </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Revenue Center */}
          <SpotlightCard className="flex flex-col opacity-0">
             <div className="flex flex-col p-8 items-center text-center h-full">
                <div className="mb-6">
                <h3 className="text-2xl font-medium text-gray-900 mb-3 dark:text-white">Revenue Center</h3>
                <p className="text-gray-500 leading-relaxed dark:text-zinc-400">
                    See a detailed monthly report of all your income-generating assets,
                    along with a projection of how much you could earn over the coming year.
                </p>
                <div className="mt-4 flex justify-center">
                    <a href="#" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 transition dark:text-white dark:hover:text-gray-300">
                        Learn more <span className="ml-1">→</span>
                    </a>
                </div>
                </div>
                <div className="relative w-full flex items-center justify-center mt-auto">
                <Image
                    src="/pic (1).png"
                    alt="Revenue center bar chart"
                    width={500}
                    height={505}
                    className="h-64 w-auto object-contain drop-shadow-sm rounded-md"
                />
                </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Direct Indexing (Full Width) */}
          <SpotlightCard className="md:col-span-2 opacity-0">
             <div className="flex flex-col md:flex-row p-8 md:p-12 items-center text-center md:text-left h-full gap-8">
                 <div className="max-w-xl">
                    <h3 className="text-2xl font-medium text-gray-900 mb-3 dark:text-white">Direct Indexing</h3>
                    <p className="text-gray-500 leading-relaxed dark:text-zinc-400">
                    With Public's direct indexing, you can use tax-loss harvesting to your benefit.
                    Pick from over 100 customizable indices and start investing with just $1,000.
                    </p>
                    <div className="mt-4 flex justify-center md:justify-start">
                    <a href="#" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 transition dark:text-white dark:hover:text-gray-300">
                        Learn more <span className="ml-1">→</span>
                    </a>
                    </div>
                </div>
                <div className="relative w-full flex items-center justify-center">
                    <Image
                        src="/Rectangle 11.png"
                        alt="Direct indexing comparison chart"
                        width={800}
                        height={450}
                        className="h-auto w-full max-h-80 object-contain drop-shadow-sm rounded-md"
                    />
                </div>
            </div>
          </SpotlightCard>

          {/* Card 4: Earn Hub */}
          <SpotlightCard className="flex flex-col opacity-0">
             <div className="flex flex-col p-8 items-center text-center h-full">
                <div className="mb-6">
                <h3 className="text-2xl font-medium text-gray-900 mb-3 dark:text-white">Earn Hub</h3>
                <p className="text-gray-500 leading-relaxed dark:text-zinc-400">
                    Get AI-powered earnings summaries, key company metrics, investor decks, and even the full earnings call audio everything available right inside Public.
                </p>
                <div className="mt-4 flex justify-center">
                    <a href="#" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 transition dark:text-white dark:hover:text-gray-300">
                        Learn more <span className="ml-1">→</span>
                    </a>
                </div>
                </div>
                <div className="relative w-full flex items-center justify-center mt-auto">
                <Image
                    src="/pic (2).png"
                    alt="Highlights stock chart"
                    width={550}
                    height={412}
                    className="h-64 w-auto object-contain drop-shadow-sm rounded-md"
                />
                </div>
            </div>
          </SpotlightCard>

          {/* Card 5: Queue */}
          <SpotlightCard className="flex flex-col opacity-0">
            <div className="flex flex-col p-8 items-center text-center h-full">
                <div className="mb-6">
                <h3 className="text-2xl font-medium text-gray-900 mb-3 dark:text-white">Queue</h3>
                <p className="text-gray-500 leading-relaxed dark:text-zinc-400">
                    Manage all your stock and options trades from one spot, tweak them in real time with live pricing, and execute multiple orders at once.
                </p>
                <div className="mt-4 flex justify-center">
                    <a href="#" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 transition dark:text-white dark:hover:text-gray-300">
                        Learn more <span className="ml-1">→</span>
                    </a>
                </div>
                </div>
                <div className="relative w-full flex items-center justify-center mt-auto">
                <Image
                    src="/pic (3).png"
                    alt="Revenue center bar chart"
                    width={500}
                    height={505}
                    className="h-64 w-auto object-contain drop-shadow-sm rounded-md"
                />
                </div>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
