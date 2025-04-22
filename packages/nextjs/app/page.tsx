"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial viewport height
    setViewportHeight(window.innerHeight);

    // Handle resize to update viewport height
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate opacity based on scroll position
  const backgroundOpacity = viewportHeight ? Math.max(0.05, 1 - (scrollY / viewportHeight) * 0.95) : 1;

  // Calculate date text scale based on scroll position
  const dateScale = Math.min(1.5, 1 + (scrollY / (viewportHeight * 1.5)) * 0.8);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image src="/prague_full_tall.png" alt="Prague" fill className="object-cover" priority sizes="100vw" />
      </div>

      {/* New background that fades as you scroll */}
      <div
        className="absolute inset-0 w-full h-full z-30"
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

      {/* Floating Airship that moves down as you scroll */}
      <div
        className="absolute z-20 w-64 lg:w-80"
        style={{
          position: "fixed",
          top: `${190 + scrollY * 0.5}px`,
          right: `${180 - scrollY * 0.04}px`,
          transform: `scaleX(-1) scale(${Math.max(0.8, 1 - scrollY * 0.0001)})`,
          transition: "transform 0.1s ease-out",
          opacity: scrollY > viewportHeight * 2.5 ? 0 : 1,
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

      {/* Add some content to enable scrolling */}
      <div className="h-[300vh]"></div>
    </div>
  );
}
