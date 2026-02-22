'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import HeroContent from '@/components/HeroContent';
import { MouseIcon } from '@/components/icons';
import Image from 'next/image';

export default function HeroSection() {
  const [showMouseIcon, setShowMouseIcon] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowMouseIcon(scrollY < 64);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden lg:min-h-0">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_bg.webp" 
          alt="Hero Background" 
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Container for content with max-width */}
      <div className="relative z-[1] w-full max-w-desktop mx-auto px-4 sm:px-8 lg:px-16 lg:py-[300px] py-8 xs:py-24">
        {/* Navbar - Positioned absolutely within container */}
        <div className="absolute top-0 lg:top-8 left-0 right-0 z-[10] lg:px-8 2xl:px-0">
          <Navbar />
        </div>

        {/* Hero Content Wrapper */}
        <div className="flex flex-col lg:block items-center w-full mt-[calc(76px+2rem)] lg:mt-0">
          {/* Hero Content */}
          <div className="flex justify-center lg:justify-end items-center px-0 lg:px-[120px] w-full">
            <HeroContent />
          </div>

          {/* Scroll Indicator - mobile only (inline, below content) */}
          <div className={`lg:hidden w-full flex justify-center items-center mt-12 mb-4 transition-opacity duration-300 ${showMouseIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <MouseIcon size={26} className="text-primary animate-bounce-y" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator - desktop only, anchored to bottom of section */}
      <div className={`hidden lg:flex absolute bottom-6 left-0 right-0 z-[2] justify-center transition-opacity duration-300 ${showMouseIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <MouseIcon size={28} className="text-primary animate-bounce-y" />
      </div>
    </section>
  );
}

