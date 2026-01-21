"use client";

import Image from "next/image";
import { TrendingUp, FileText, MessageSquare } from "lucide-react";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InvestmentFeatures() {
  const containerRef = useRef(null);
  const topSectionRef = useRef(null);
  const bottomTextRef = useRef(null);
  const featuresListRef = useRef(null);

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5 text-black dark:text-white" />,
      text: "Learn exactly why a stock is trading up or down.",
    },
    {
      icon: <FileText className="w-5 h-5 text-black dark:text-white" />,
      text: "Get an AI-generated recap of any earnings call.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-black dark:text-white" />,
      text: "Ask any question about any stock you care about.",
    },
  ];

  useGSAP(() => {
     // 1. Top Section Animation (Lines Reveal)
     const topLines = topSectionRef.current.querySelectorAll(".line-inner");
     gsap.fromTo(topLines,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out", // Clean Hero-style ease
            scrollTrigger: {
                trigger: topSectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
     );

     // 2. Bottom Left Heading & Desc (Lines Reveal)
     const bottomLines = bottomTextRef.current.querySelectorAll(".line-inner");
     gsap.fromTo(bottomLines,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bottomTextRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
     );

     // 3. Features List Stagger (Clean Slide Up, No Bounce)
     const featureItems = featuresListRef.current.children;
     gsap.fromTo(featureItems,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out", // Smooth & Clean
            scrollTrigger: {
                trigger: featuresListRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
     );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white py-24 text-center md:text-left overflow-hidden dark:bg-black transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Section */}
        <div ref={topSectionRef} className="mx-auto max-w-3xl text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-6 anta-regular leading-tight dark:text-white">
            <div className="overflow-hidden"><span className="line-inner block">Access instant buying power</span></div>
            <div className="overflow-hidden"><span className="line-inner block">of up to $250,000.</span></div>
          </h2>
          <div className="text-xl text-gray-600 font-normal leading-relaxed dark:text-zinc-400">
            <div className="overflow-hidden"><span className="line-inner block">Seize every investment opportunity</span></div>
            <div className="overflow-hidden"><span className="line-inner block">by trading instantly, without</span></div>
            <div className="overflow-hidden"><span className="line-inner block">waiting for your funds to clear.</span></div>
          </div>
        </div>

        {/* Bottom Section: AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div ref={bottomTextRef} className="flex flex-col justify-center">
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-6 anta-regular leading-tight dark:text-white">
              <div className="overflow-hidden"><span className="line-inner block">Use AI to guide and optimize</span></div>
              <div className="overflow-hidden"><span className="line-inner block">your investment choices.</span></div>
            </h3>
            <div className="text-lg text-gray-600 mb-10 leading-relaxed dark:text-zinc-400">
              <div className="overflow-hidden"><span className="line-inner block">AI isn't just a tool on Public it's built</span></div>
              <div className="overflow-hidden"><span className="line-inner block">into the whole experience, giving you</span></div>
              <div className="overflow-hidden"><span className="line-inner block">real-time alerts and actionable</span></div>
              <div className="overflow-hidden"><span className="line-inner block">investing insights.</span></div>
            </div>

            <div ref={featuresListRef} className="space-y-6">
              {features.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 bg-gray-100 p-2 rounded-lg dark:bg-zinc-800">{item.icon}</div>
                  <p className="text-lg text-gray-800 font-medium pt-1 dark:text-zinc-200">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image (Untouched) */}
          <div className="relative w-full flex justify-center md:justify-end">
            <Image
              src="/1.png"
              alt="AI Investment Guidance on Phone"
              width={300} 
              height={450} 
              className="w-[300px] h-auto object-contain rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
