"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Zap } from "lucide-react";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const { user } = useAuth();
    const containerRef = useRef(null);
    const tiltRef = useRef(null);
    const heroImageRef = useRef(null);
    const badge1Ref = useRef(null);
    const badge2Ref = useRef(null);
    const headingRef = useRef(null);
    const testimonialRef = useRef(null);

    useGSAP(() => {
        // --- 3D Tilt Effect ---
        const handleMouseMove = (e) => {
            if (!tiltRef.current) return;
            const rect = tiltRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            const rotateX = (mouseY / rect.height) * -60; // Max rotation 15deg
            const rotateY = (mouseX / rect.width) * 60;

            gsap.to(heroImageRef.current, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
                transformStyle: "preserve-3d"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(heroImageRef.current, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        const tiltElement = tiltRef.current;
        if(tiltElement) {
            tiltElement.addEventListener("mousemove", handleMouseMove);
            tiltElement.addEventListener("mouseleave", handleMouseLeave);
        }


        // --- Floating Badges Animation ---
        gsap.to(badge1Ref.current, {
            y: -15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(badge2Ref.current, {
            y: 15,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });


        // --- Staggered Text Reveal (Main Heading) ---
        const splitLines = headingRef.current.querySelectorAll(".line-inner");
        gsap.fromTo(splitLines, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                stagger: 0.15,
                ease: "power3.out", // "Professional" ease
                delay: 0.2
            }
        );

        // CTA Button Reveal
        gsap.fromTo(".cta-button",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.8, ease: "power2.out" }
        );


        // --- Testimonial ScrollTrigger Animation ---
        const testimonialLines = testimonialRef.current.querySelectorAll(".line-inner");
        
        // Stars Animation
        gsap.fromTo(testimonialRef.current.querySelector(".stars-container"),
           { opacity: 0, y: 20 },
           { 
               opacity: 1, 
               y: 0, 
               duration: 0.8, 
               scrollTrigger: {
                   trigger: testimonialRef.current,
                   start: "top 85%",
                   toggleActions: "play none none reverse"
               }
           }
        );

        // Text Stagger Animation
        gsap.fromTo(testimonialLines,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: testimonialRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse" 
                }
            }
        );
        
        // Cleanup listener
        return () => {
             if(tiltElement) {
                tiltElement.removeEventListener("mousemove", handleMouseMove);
                tiltElement.removeEventListener("mouseleave", handleMouseLeave);
            }
        };

    }, { scope: containerRef }); // Scope GSAP to this container

    return (
        <section ref={containerRef} className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 dark:bg-black transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">

                    {/* Left: Image Canvas with GSAP 3D Tilt */}
                    <div ref={tiltRef} className="relative max-md:mt-10 perspective-1000 cursor-pointer">
                        <div ref={heroImageRef} className="relative w-[600px] max-w-full">
                            <Image
                                src="/hero-img.png"
                                alt="Trading App Interface"
                                width={600}
                                height={600}
                                className="h-auto w-full object-contain drop-shadow-2xl"
                                priority
                            />
                            
                            {/* Floating Badge 1 */}
                            <div 
                                ref={badge1Ref}
                                className="absolute -left-8 top-1/4 hidden rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm lg:block dark:bg-zinc-900/90 dark:shadow-none"
                                style={{ transform: "translateZ(40px)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Security</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Top-Tier</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge 2 */}
                            <div 
                                ref={badge2Ref}
                                className="absolute bottom-1/4 -right-8 hidden rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm lg:block dark:bg-zinc-900/90 dark:shadow-none"
                                style={{ transform: "translateZ(60px)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Speed</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Instant</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"></div>
                                <span className="flex items-center gap-1"><ShieldCheck size={16} /> Multi-asset investing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"></div>
                                <span className="flex items-center gap-1"><Zap size={16} /> AI-powered analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"></div>
                                <span className="flex items-center gap-1"><Star size={16} /> Trusted by millions</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Text Content with GSAP Stagger */}
                    <div className="flex flex-col items-start text-left">
                        <h1 
                            ref={headingRef}
                            className="anta-regular text-3xl font-bold leading-[1.1] tracking-tight text-black sm:text-4xl xl:text-6xl dark:text-white"
                        >
                            <div className="overflow-hidden"><div className="line-inner block">For people who treat</div></div>
                            <div className="overflow-hidden"><div className="line-inner block">investing as a discipline,</div></div>
                            <div className="overflow-hidden"><div className="line-inner block ">not a gamble.</div></div>
                        </h1>

                        <div className="mt-10 cta-button opacity-0">
                            {user ? (
                                <Link href="/stocks">
                                    <button 
                                        className="rounded-full bg-black px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-zinc-800 hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    >
                                        Go to Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/signup">
                                    <button 
                                        className="rounded-full bg-black px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-zinc-800 hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    >
                                        Get Started
                                    </button>
                                </Link>
                            )}
                        </div>
                        
                    </div>
                </div>

                {/* Bottom Testimonial Section with ScrollTrigger */}
                <div 
                    ref={testimonialRef}
                    className="mt-24 flex flex-col items-center justify-center text-center"
                >
                    <div className="flex gap-1 text-black mb-4 stars-container opacity-0 dark:text-white">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={20} fill="currentColor" stroke="none" />
                        ))}
                    </div>
                    <h2 className="anta-regular max-w-4xl text-2xl font-medium leading-relaxed text-zinc-900 sm:text-4xl dark:text-zinc-100">
                        <div className="overflow-hidden"><span className="line-inner block">Logo stands out for its super-easy interface</span></div>
                        <div className="overflow-hidden"><span className="line-inner block">and strong range of investments—and for options</span></div>
                        <div className="overflow-hidden"><span className="line-inner block">traders, the PFOF rebate program is a</span></div>
                        <div className="overflow-hidden"><span className="line-inner block">game-changer that really turns heads.</span></div>
                    </h2>
                </div>
            </div>
        </section>
    );
}
