import Navbar from '@/components/navbar';
import HeroContent from '@/components/HeroContent';
import { MouseIcon } from '@/components/icons';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_bg.webp" 
          alt="Hero Background" 
          fill
          className="object-cover"
        />
      </div>

      {/* Container for content with max-width */}
      <div className="relative z-[1] w-full max-w-desktop mx-auto h-full flex flex-col lg:flex-row items-center lg:justify-between px-8 lg:px-16 py-[204px] lg:py-[300px] gap-16 lg:gap-28">
        {/* Navbar - Positioned absolutely within container */}
        <div className="absolute top-0 lg:top-8 left-0 right-0 z-[0] lg:px-8 2xl:px-0">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="flex justify-center lg:justify-end items-center px-0 lg:px-[130px] w-full mt-[76px] lg:mt-0">
          <HeroContent />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute w-full h-8 left-0 bottom-4 flex justify-center items-center">
          <MouseIcon size={26} className="lg:w-8 lg:h-8 text-primary animate-bounce-y" />
        </div>
      </div>
    </section>
  );
}

