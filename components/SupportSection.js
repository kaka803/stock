"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Flag } from "lucide-react";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// --- Reusable 3D Tilt Image Component ---
const TiltImage = ({ src, alt, className, children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["0deg", "-0deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-0deg", "0deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
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
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative transform-gpu cursor-pointer ${className}`}
    >
      <div 
        style={{ transform: "translateZ(20px)" }}
        className="w-full h-full relative overflow-hidden rounded-3xl "
      >
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
        />
        {children}
      </div>
    </motion.div>
  );
};

export default function SupportSection() {
  const containerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);

  useGSAP(() => {
    // Section 1: Text Stagger
    const text1Lines = section1Ref.current.querySelectorAll(".line-inner");
    gsap.fromTo(text1Lines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Section 2: Text Stagger
    const text2Lines = section2Ref.current.querySelectorAll(".line-inner");
    gsap.fromTo(text2Lines,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    
    // Icon Stagger Reveal
    const icons = section1Ref.current.querySelectorAll(".icon-box");
        gsap.fromTo(icons,
        { scale: 0.8, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: section1Ref.current,
                start: "top 75%",
            }
        }
    );


  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white text-black py-24 overflow-hidden dark:bg-black dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-32">
        
        {/* Support Team Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image with Tilt */}
            <TiltImage 
                src="/trad.png"
                alt="Support Team Dashboard"
                className="w-full aspect-4/3"
            />

            {/* Content */}
            <div ref={section1Ref}>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-12 anta-regular leading-tight dark:text-white">
                    <div className="overflow-hidden"><span className="line-inner block">We're here to simple support</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">you never to push a sale.</span></div>
                </h2>
                
                {/* Icons Grid */}
                <div className="flex gap-12 mb-10 text-gray-800 dark:text-zinc-200">
                    <div className="flex flex-col items-center gap-2 text-center icon-box">
                         {/* Using a generic Flag or text for US-Based */}
                        <div className="p-3 bg-gray-100 rounded-full dark:bg-zinc-800"><Flag className="w-6 h-6 text-red-500 fill-current" /></div>
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-500">US-Based</span>
                    </div>
                     <div className="flex flex-col items-center gap-2 text-center icon-box">
                         <div className="p-3 bg-gray-100 rounded-full dark:bg-zinc-800"><Check className="w-6 h-6 text-black dark:text-white" /></div>
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-500">Registered</span>
                    </div>
                     <div className="flex flex-col items-center gap-2 text-center icon-box">
                         <div className="p-3 bg-gray-100 rounded-full dark:bg-zinc-800"><Heart className="w-6 h-6 text-red-500 fill-current" /></div>
                        <span className="text-xs font-bold tracking-wider uppercase text-gray-500">Actually Cares</span>
                    </div>
                </div>

                <div className="text-xl text-gray-600 leading-relaxed font-normal dark:text-zinc-400">
                    <div className="overflow-hidden"><span className="line-inner block">Our top-rated support team of financial</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">experts is ready to assist you with everything,</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">from moving your portfolio to navigating</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">your account features.</span></div>
                </div>
            </div>
        </div>

        {/* Account Manager Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content (Order 2 on mobile usually, but keeping simple grid order) */}
            <div ref={section2Ref} className="order-2 lg:order-1">
                 <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-10 anta-regular leading-tight dark:text-white">
                    <div className="overflow-hidden"><span className="line-inner block">Get a personal account manager</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">someone you'll truly know, not</span></div>
                    <div className="overflow-hidden"><span className="line-inner block">just another contact.</span></div>
                </h2>
                
                <ul className="space-y-6 mb-12">
                    <li className="flex items-start gap-4 line-inner">
                        <Check className="w-6 h-6 text-black shrink-0 mt-1 dark:text-white" />
                        <span className="text-lg text-gray-800 dark:text-zinc-300">White-glove, dedicated support</span>
                    </li>
                    <li className="flex items-start gap-4 line-inner">
                        <Check className="w-6 h-6 text-black shrink-0 mt-1 dark:text-white" />
                        <span className="text-lg text-gray-800 dark:text-zinc-300">Exclusive invitations and events</span>
                    </li>
                     <li className="flex items-start gap-4 line-inner">
                        <Check className="w-6 h-6 text-black shrink-0 mt-1 dark:text-white" />
                        <span className="text-lg text-gray-800 dark:text-zinc-300">Available to members with $500K+ account balance</span>
                    </li>
                </ul>
            </div>

             {/* Image with Tilt */}
              <TiltImage 
                src="/trad2.png"
                alt="Account Manager Interaction"
                className="w-full aspect-video lg:aspect-4/3 order-1 lg:order-2"
              >
                  <Link href="/contact" className="inline-block absolute z-20 bottom-4 right-4  rounded-lg bg-black px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-black dark:hover:bg-zinc-200" style={{ transform: "translateZ(40px)" }}>
                    Contact Us
                </Link>
              </TiltImage>
        </div>

      </div>
    </section>
  );
}
