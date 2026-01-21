"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection() {
  const containerRef = useRef(null);
  const rightTextRef = useRef(null);
  const bonusSectionRef = useRef(null);

  useGSAP(() => {
    // 1. Right Text Stagger (Modified for Clean Line Reveal)
    const rightLines = rightTextRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(rightLines,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: rightTextRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // 2. Bonus Text Stagger (Line Reveal)
    const bonusLines = bonusSectionRef.current.querySelectorAll(".line-inner");
    gsap.fromTo(bonusLines,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bonusSectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-black text-white pt-16 px-0 lg:px-0 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className=" ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 px-6">
          
          {/* Left Side: Car Image (Static) */}
          <div className="relative h-64 lg:h-80 w-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20">
             <Image 
                src="/f1.png" 
                alt="Aston Martin F1 Car" 
                fill 
                className="object-cover" 
             />
          </div>

          {/* Right Side: Text */}
          <div ref={rightTextRef} className="text-center lg:text-left space-y-6">
            <div className="text-sm font-medium text-blue-400 uppercase tracking-wide">
                <div className="overflow-hidden"><span className="line-inner block">Inverters Logo</span></div>
            </div>
            <h2 className="text-3xl anta-regular lg:text-4xl font-bold leading-tight">
              <div className="overflow-hidden"><span className="line-inner block">Logo is a proud official partner of the</span></div>
              <div className="overflow-hidden"><span className="line-inner block">Aston Martin Aramco F1® Team.</span></div>
            </h2>
            <div className="text-gray-400 text-sm lg:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              <div className="overflow-hidden"><span className="line-inner block">Logo members can enjoy special,</span></div>
              <div className="overflow-hidden"><span className="line-inner block">members-only race experiences.</span></div>
            </div>
          </div>
        </div>

        {/* Bonus Text Section */}
        <div ref={bonusSectionRef} className="text-center px-6 mb-12">
            <h3 className="text-2xl anta-regular lg:text-4xl font-semibold mb-6 leading-tight">
                <div className="overflow-hidden"><span className="line-inner block">Receive a 1% bonus when</span></div>
                <div className="overflow-hidden"><span className="line-inner block">you move your funds.</span></div>
            </h3>
            <Link href="/signup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105">
                    Sign up
                </button>
            </Link>
        </div>

        {/* Bottom Devices Image (Static) */}
        <div className="relative w-full max-w-[100vw] mx-auto mt-8">
            <div className="relative w-full rounded-t-[3rem] overflow-hidden bg-gradient-to-b from-transparent to-blue-950/30 pb-0 ">
                 <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full transform translate-y-4">
                     <Image 
                        src="/card.png" 
                        alt="Platform Dashboard" 
                        fill 
                        className="object-contain object-bottom"
                    />
                </div>
            </div>
             {/* Bottom Glow */}
             <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-blue-600/40 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
