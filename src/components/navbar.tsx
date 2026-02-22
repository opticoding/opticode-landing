'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { SectionId } from '@/constants/constants';

export default function Navbar() {
  const { t, toggleLanguage, language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <nav className="flex flex-row justify-between items-center px-4 lg:px-4 h-[76px] bg-black/60 backdrop-blur-sm shadow-[0px_4px_10px_rgba(0,0,0,0.2)] lg:rounded-[32px] max-w-full">
        {/* Logo */}
        <div className="flex items-center w-auto lg:w-[234px]">
          <Image 
            src="/opticode_logo_square.png" 
            alt="OptiCode Logo"
            width={34}
            height={34}
            className="xs:hidden"
          />
          <Image 
            src="/opticode_logo_darkmode.svg" 
            alt="OptiCode Logo" 
            width={234}
            height={44}
            className="hidden xs:block w-[160px] h-[30px] sm:w-[180px] sm:h-[34px] lg:w-[234px] lg:h-[44px]"
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

        {/* Right side: language toggle + contact + hamburger */}
        <div className="flex flex-row justify-end items-center gap-2 lg:gap-4 w-auto lg:w-[234px]">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="cursor-interactive flex items-center justify-center gap-1 px-2 py-1 rounded-md sm:hover:bg-white/10 transition-colors duration-200"
            aria-label="Toggle language"
          >
            <Image 
              src="/gb.svg" 
              alt="English" 
              width={16}
              height={16}
              className={`h-5 w-auto transition-opacity duration-200 ${language === 'sv' ? 'opacity-30' : 'opacity-100'}`}
            />
            <Image 
              src="/se.svg" 
              alt="Swedish" 
              width={16}
              height={16}
              className={`h-5 w-auto transition-opacity duration-200 ${language === 'en' ? 'opacity-30' : 'opacity-100'}`}
            />
          </button>
          
          {/* Contact button - hidden on mobile, shown on desktop */}
          <Button 
            variant="secondary"
            size="lg"
            className="hidden lg:flex w-[110px] h-12 text-base"
            onClick={() => scrollToSection(SectionId.CONTACT)}
          >
            <AnimatedText>{t.navbar.contact}</AnimatedText>
          </Button>

          {/* Hamburger button - visible on mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-interactive lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col gap-[5px] w-5">
              <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl mx-1 p-4 flex flex-col gap-1">
          <button
            onClick={() => scrollToSection(SectionId.SERVICES)}
            tabIndex={isMobileMenuOpen ? 0 : -1}
            className="cursor-interactive font-urbanist font-semibold text-lg text-white/90 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-left transition-colors duration-200"
          >
            {t.navbar.services}
          </button>
          <button
            onClick={() => scrollToSection(SectionId.ABOUT)}
            tabIndex={isMobileMenuOpen ? 0 : -1}
            className="cursor-interactive font-urbanist font-semibold text-lg text-white/90 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 text-left transition-colors duration-200"
          >
            {t.navbar.about}
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => scrollToSection(SectionId.CONTACT)}
            tabIndex={isMobileMenuOpen ? 0 : -1}
            className="cursor-interactive font-urbanist font-bold text-lg text-secondary hover:text-secondary/80 hover:bg-white/5 rounded-xl px-4 py-3 text-left transition-colors duration-200"
          >
            {t.navbar.contact}
          </button>
        </div>
      </div>
    </div>
  );
}

