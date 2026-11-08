'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { SectionId } from '@/constants/constants';

// Round the strokes in the shape. A CSS border-radius on these transformed bars
// leaves the end caps painted on iOS Chrome after the icon is toggled a few times.
const menuBar = 'origin-center fill-white [transform-box:fill-box]';

// Touch keeps the tapped control focused. Drop the ring and the gray tap flash below the desktop nav.
const noMobileFocus = 'max-lg:outline-none max-lg:[-webkit-tap-highlight-color:transparent]';

const mobileMenuItemClass = `cursor-interactive ${noMobileFocus} rounded-xl px-4 py-3 text-left font-urbanist text-lg transition-colors duration-200 active:bg-white/5`;

function blurAfterTouch(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === 'touch') event.currentTarget.blur();
}

export default function Navbar() {
  const { t, toggleLanguage, language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setIsMobileMenuOpen(false);
      const active = document.activeElement;
      if (active instanceof HTMLElement && rootRef.current?.contains(active)) active.blur();
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <nav className="isolate relative flex flex-row justify-between items-center px-4 lg:px-4 h-[76px] shadow-[0px_4px_10px_rgba(0,0,0,0.2)] lg:rounded-[32px] max-w-full">
        {/* Blur sits behind the icon. Transformed bars inside backdrop-filter pick up end-cap artifacts on iOS Chrome. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm lg:rounded-[32px]" />
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
          <button
            onClick={() => scrollToSection(SectionId.PROJECTS)}
            className="cursor-interactive font-urbanist font-semibold text-xl leading-7 text-white flex items-center text-center hover:text-secondary transition-colors duration-200"
          >
            <AnimatedText>{t.navbar.projects}</AnimatedText>
          </button>
        </div>

        {/* Right side: language toggle + contact + hamburger */}
        <div className="flex flex-row justify-end items-center gap-2 lg:gap-4 w-auto lg:w-[234px]">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            onPointerUp={blurAfterTouch}
            className={`cursor-interactive ${noMobileFocus} flex items-center justify-center gap-1 px-2 py-1 rounded-md sm:hover:bg-white/10 transition-colors duration-200`}
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
            onPointerUp={blurAfterTouch}
            className={`cursor-interactive ${noMobileFocus} lg:hidden flex items-center justify-center w-10 h-10 rounded-xl active:bg-white/10 transition-colors duration-200`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg viewBox="0 0 20 16" aria-hidden="true" className="h-4 w-5 overflow-visible">
              <rect
                y="0"
                width="20"
                height="2"
                rx="1"
                className={`${menuBar} transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <rect
                y="7"
                width="20"
                height="2"
                rx="1"
                className={`${menuBar} transition-[transform,visibility] duration-300 ${isMobileMenuOpen ? 'invisible scale-x-0' : 'visible'}`}
              />
              <rect
                y="14"
                width="20"
                height="2"
                rx="1"
                className={`${menuBar} transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl mx-1 p-4 flex flex-col gap-1">
            <button
              onClick={() => scrollToSection(SectionId.SERVICES)}
              onPointerUp={blurAfterTouch}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className={`${mobileMenuItemClass} font-semibold text-white/90 active:text-white`}
            >
              {t.navbar.services}
            </button>
            <button
              onClick={() => scrollToSection(SectionId.ABOUT)}
              onPointerUp={blurAfterTouch}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className={`${mobileMenuItemClass} font-semibold text-white/90 active:text-white`}
            >
              {t.navbar.about}
            </button>
            <button
              onClick={() => scrollToSection(SectionId.PROJECTS)}
              onPointerUp={blurAfterTouch}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className={`${mobileMenuItemClass} font-semibold text-white/90 active:text-white`}
            >
              {t.navbar.projects}
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              onClick={() => scrollToSection(SectionId.CONTACT)}
              onPointerUp={blurAfterTouch}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className={`${mobileMenuItemClass} font-bold text-secondary active:text-secondary/80`}
            >
              {t.navbar.contact}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

