"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Initialize state with current values including scroll position
    const initializeState = () => {
      setScrollY(window.scrollY);
      setViewportHeight(window.innerHeight);
      setDocumentHeight(document.body.scrollHeight);
      setIsInitialized(true);
    };

    // Handle resize to update heights
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(document.body.scrollHeight);
    };

    // Initialize on first render
    initializeState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Only calculate styles after initialization
  if (!isInitialized) {
    return <div className="min-h-screen"></div>; // Simple loading state
  }

  // Calculate opacity based on scroll position
  const backgroundOpacity = viewportHeight ? Math.max(0.05, 1 - (scrollY / (viewportHeight * 2.5)) * 0.95) : 1;

  // Calculate date text scale based on scroll position
  const dateScale = Math.min(1.5, 1 + (scrollY / (viewportHeight * 1.5)) * 0.8);

  // Calculate card opacity based on scroll position (appears after scrolling past title)
  const scrollProgress = documentHeight ? scrollY / (documentHeight - viewportHeight) : 0;
  const cardVisibilityThreshold = 1.2; // Show cards after scrolling much further down the page
  const cardOpacity = Math.min(1, Math.max(0, (scrollY / viewportHeight - cardVisibilityThreshold) * 2)) || 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image src="/prague_full_tall.png" alt="Prague" fill className="object-cover" priority sizes="100vw" />
      </div>

      {/* New background that fades as you scroll */}
      <div
        className="absolute inset-0 w-full h-full z-40"
        style={{
          opacity: backgroundOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <Image src="/assets/background.png" alt="Background" fill className="object-cover" priority sizes="100vw" />
      </div>

      {/* Title overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className="text-xl md:text-2xl mb-2 opacity-80 text-gray-800"
          style={{
            position: "relative",
            top: "-400px",
          }}
        >
          ethereum on tour
        </div>
        <div className="text-7xl md:text-9xl font-bold text-gray-900">prague</div>
        <div
          className="text-xl md:text-2xl mt-9 opacity-80 text-gray-800"
          style={{
            transform: `scale(${dateScale})`,
            transition: "transform 0.1s ease-out",
            marginTop: "200px",
          }}
        >
          May 27-31
        </div>
      </div>

      {/* Floating Airship that subtly floats away as you scroll */}
      <div
        className="absolute z-50 w-64 lg:w-80"
        style={{
          position: "fixed",
          top: `${130 - scrollY * 0.1}px`,
          right: `${80 - scrollY * 0.2}px`,
          transform: `scaleX(-1) scale(${Math.max(0.85, 1 - scrollY * 0.0003)})`,
          opacity: Math.max(0, 1 - scrollY * 0.001),
          transition: "transform 0.2s ease-out, opacity 0.3s ease-out, top 0.2s ease-out, right 0.2s ease-out",
        }}
      >
        <Image
          src="/assets/airship-2.png"
          alt="Airship"
          width={400}
          height={400}
          className="w-full"
          sizes="(max-width: 768px) 30vw, 20vw"
        />
      </div>

      {/* Tour Information Card */}
      <div
        className="fixed z-60 w-11/12 max-w-3xl rounded-xl p-8 shadow-2xl"
        style={{
          opacity: cardOpacity,
          visibility: cardOpacity > 0.05 ? "visible" : "hidden",
          transition: "opacity 0.3s ease-out",
          backgroundColor: "rgba(245, 245, 245, 0.95)",
          bottom: viewportHeight < 700 ? "5px" : "60px", // Lower position on small screens
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Learn how to build on Ethereum</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Beginner</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Tinkering with Solidity</li>
              <li>Staking App</li>
              <li>Token Vendor</li>
              <li>DEX</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Moderate</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Lending</li>
              <li>Oracles</li>
              <li>Prediction Markets</li>
              <li>Stablecoins</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Hard</h3>
            <ul className="space-y-2 text-gray-700">
              <li>CTF</li>
              <li>Game?</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hosted by BuidlGuidl Card */}
      <a
        href="https://buidlguidl.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-90 w-300px max-w-xs rounded-lg p-3 shadow-md text-center cursor-pointer hover:shadow-xl transition-all"
        style={{
          opacity: cardOpacity,
          visibility: cardOpacity > 0.05 ? "visible" : "hidden",
          transition: "opacity 0.3s ease-out, box-shadow 0.3s ease",
          backgroundColor: "rgba(245, 245, 245, 0.95)",
          pointerEvents: cardOpacity > 0.05 ? "auto" : "none",
          bottom: viewportHeight < 700 ? "calc(320px + 15px)" : "6px", // Ensure BuidlGuidl card appears below main card
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="text-gray-700 hover:text-gray-900 font-medium flex items-center justify-center gap-1">
          hosted by
          <svg
            fill="none"
            height="20"
            viewBox="0 0 31 28"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
          >
            <g fill="#000000">
              <path d="m12.4281 16.7412h-11.514526v10.7741h11.514526z"></path>
              <path d="m30.4196 16.7412h-11.5145v10.7741h11.5145z"></path>
              <path d="m23.223 10.9949h-15.47259v11.1333h15.47259z"></path>
              <path d="m5.59135 10.9949h-4.677776v11.1333h4.677776z"></path>
              <path d="m30.4199 10.9949h-4.6778v11.1333h4.6778z"></path>
              <path d="m29.6995 5.96693v-5.387096h-12.2341v5.387096z"></path>
              <path d="m18.9048.579834h-6.4769v10.415066h6.4769z"></path>
            </g>
          </svg>
          buidlguidl
        </div>
      </a>

      {/* Add some content to enable scrolling */}
      <div className="h-[300vh]"></div>
    </div>
  );
}
