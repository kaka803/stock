"use client";

import React from "react";

export default function VideoHero() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <video
                id="test-video"
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/tradvideo2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
        </div>
    );
}
