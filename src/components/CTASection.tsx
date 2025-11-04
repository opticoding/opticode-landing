'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SectionId } from '@/constants/constants';
import ContactPopup from '@/components/ContactPopup';
import AboutMePopup from '@/components/AboutMePopup';

export default function CTASection() {
  const { t } = useLanguage();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const { elementRef: buttonRef, isVisible } = useScrollAnimation<HTMLButtonElement>({
    threshold: 0.2,
    resetScrollDistance: 500,
  });
  const { elementRef: button2Ref, isVisible: isButton2Visible } = useScrollAnimation<HTMLButtonElement>({
    threshold: 0.2,
    resetScrollDistance: 500,
  });

  return (
    <section 
      id={SectionId.CONTACT}
      className="w-full flex flex-col justify-center items-center py-24 lg:pt-[150px] lg:pb-[150px] px-8 lg:px-0 gap-16 lg:gap-[100px]"
      style={{
        background: 'linear-gradient(183.47deg, #2B0B32 2.94%, #020202 97.22%)',
      }}
    >
      {/* Content */}
      <div className="flex flex-col items-center gap-8 lg:gap-12 w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[688px]">
        {/* Headline */}
        <div className="flex flex-col items-center gap-4 lg:gap-3">
          <h2 className="font-audiowide text-[30px] leading-[28px] sm:text-[40px] sm:leading-[45px] lg:text-5xl lg:leading-12 text-center text-white">
            <AnimatedText>{t.cta.headline}</AnimatedText>
          </h2>
          <p className="font-urbanist font-medium text-base leading-6 lg:text-xl lg:leading-8 text-center text-subtitle">
            <AnimatedText>{t.cta.tagline}</AnimatedText>
          </p>
          <p className="font-urbanist font-medium text-base leading-6 lg:text-xl lg:leading-8 text-center text-subtitle">
            <AnimatedText>{t.cta.tagline2}</AnimatedText>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            ref={button2Ref}
            variant="secondary"
            size="lg"
            className="rounded-xl h-[44px] lg:h-[50px] px-6 w-[170px] lg:w-auto"
            style={{
              opacity: isButton2Visible ? 1 : 0,
              transform: isButton2Visible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'opacity 800ms ease-in-out, transform 700ms ease-out',
            }}
            onClick={() => setIsAboutMeOpen(true)}
          >
            <AnimatedText>{t.cta.button2}</AnimatedText>
          </Button>
          <Button 
            ref={buttonRef}
            variant="secondary"
            size="lg"
            className="rounded-xl h-[44px] lg:h-[50px] px-6 w-[170px] lg:w-auto"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'opacity 800ms ease-in-out, transform 700ms ease-out',
            }}
            onClick={() => setIsPopupOpen(true)}
          >
            <AnimatedText>{t.cta.button1}</AnimatedText>
          </Button>
        </div>
      </div>

      {/* Contact Popup */}
      <ContactPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />

      {/* About Me Popup */}
      <AboutMePopup 
        isOpen={isAboutMeOpen} 
        onClose={() => setIsAboutMeOpen(false)} 
      />
    </section>
  );
}

