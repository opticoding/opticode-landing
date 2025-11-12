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
      setShowMouseIcon(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-screen lg:min-h-0">
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
      <div className="relative z-[1] w-full max-w-desktop mx-auto flex flex-col lg:flex-row items-center lg:justify-between px-8 lg:px-16 min-h-screen lg:min-h-0 lg:py-[300px] gap-8 xs:gap-16 lg:gap-28">
        {/* Navbar - Positioned absolutely within container */}
        <div className="absolute top-0 lg:top-8 left-0 right-0 z-[0] lg:px-8 2xl:px-0">
          <Navbar />
        </div>

        {/* Hero Content - Centered accounting for navbar (76px) and mouse icon space (16px + icon height + half gap) */}
        <div className="flex justify-center lg:justify-end items-center px-0 lg:px-[130px] w-full mt-[calc(76px+2rem)] mb-[calc(16px+2rem+1rem)] lg:mt-0 lg:mb-0 flex-1 lg:flex-initial">
          <HeroContent />
        </div>

        {/* Scroll Indicator - 16px from bottom with gap above, same on all screens */}
        <div className={`absolute w-full left-0 bottom-4 flex justify-center items-center min-h-[2rem] transition-opacity duration-300 ${showMouseIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <MouseIcon size={26} className="lg:w-8 lg:h-8 text-primary animate-bounce-y" />
        </div>
      </div>
    </section>
  );
}

