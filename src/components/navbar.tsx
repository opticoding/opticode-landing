'use client';

import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { SectionId } from '@/constants/constants';

export default function Navbar() {
  const { t, toggleLanguage, language } = useLanguage();

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="flex flex-row justify-between items-center px-4 lg:px-4 h-[76px] bg-black/60 backdrop-blur-sm shadow-[0px_4px_10px_rgba(0,0,0,0.2)] lg:rounded-[32px] max-w-full">
      {/* Logo */}
      <div className="flex items-center w-auto lg:w-[234px]">
        {/* Square logo - visible below xs */}
        <Image 
          src="/opticode_logo_square.png" 
          alt="OptiCode Logo"
          width={34}
          height={34}
          className="xs:hidden"
        />
        {/* Regular logo - visible at xs and above */}
        <Image 
          src="/opticode_logo_darkmode.svg" 
          alt="OptiCode Logo" 
          width={180}
          height={34}
          className="hidden xs:block lg:w-[234px] lg:h-[44px]"
        />
      </div>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden lg:flex flex-row justify-center items-center gap-8 mx-auto">
        <button 
          onClick={() => scrollToSection(SectionId.SERVICES)}
          className="cursor-interactive font-urbanist font-semibold text-xl leading-7 text-white flex items-center text-center hover:text-secondary transition-colors duration-200"
        >
          <AnimatedText>{t.navbar.services}</AnimatedText>
        </button>
        <button 
          onClick={() => scrollToSection(SectionId.ABOUT)}
          className="cursor-interactive font-urbanist font-semibold text-xl leading-7 text-white flex items-center text-center hover:text-secondary transition-colors duration-200"
        >
          <AnimatedText>{t.navbar.about}</AnimatedText>
        </button>
      </div>

      {/* Contact Button with Language Toggle */}
      <div className="flex flex-row justify-end items-center gap-2 lg:gap-4 w-auto lg:w-[234px]">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="cursor-interactive flex items-center justify-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
          aria-label="Toggle language"
        >
          <Image 
            src="/gb.svg" 
            alt="English" 
            width={16}
            height={16}
            className={`h-4 w-auto transition-opacity duration-200 ${language === 'sv' ? 'opacity-30' : 'opacity-100'}`}
          />
          <Image 
            src="/se.svg" 
            alt="Swedish" 
            width={16}
            height={16}
            className={`h-4 w-auto transition-opacity duration-200 ${language === 'en' ? 'opacity-30' : 'opacity-100'}`}
          />
        </button>
        
        <Button 
          variant="secondary"
          size="lg"
          className="w-[106px] lg:w-[110px] h-10 lg:h-12 text-base"
          onClick={() => scrollToSection(SectionId.CONTACT)}
        >
          <AnimatedText>{t.navbar.contact}</AnimatedText>
        </Button>
      </div>
    </nav>
  );
}

