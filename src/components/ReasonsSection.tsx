'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedText from '@/components/AnimatedText';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionId } from '@/constants/constants';
import Image from 'next/image';
import { ClockIcon, ZapIcon, TargetIcon } from '@/components/icons';

const featureIcons = [
  { Icon: ClockIcon, color: '#DC38FF', bg: 'rgba(220, 56, 255, 0.15)' },
  { Icon: ZapIcon, color: '#1898FF', bg: 'rgba(24, 152, 255, 0.15)' },
  { Icon: TargetIcon, color: '#47adff', bg: 'rgba(71, 173, 255, 0.15)' },
];

export default function ReasonsSection() {
  const { t } = useLanguage();
  const { elementRef: contentRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    resetScrollDistance: 500,
  });
  const isMobile = useIsMobile();

  return (
    <section 
      id={SectionId.ABOUT}
      className="relative w-full flex flex-col justify-center items-center py-24 lg:pt-[120px] lg:pb-[140px] xl:pt-[140px] xl:pb-[160px] 3xl:pt-[160px] 3xl:pb-[180px] 4xl:pt-[180px] 4xl:pb-[200px] 5xl:pt-[200px] 5xl:pb-[220px] px-8 lg:px-20 gap-[42px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/neon_bg.jpg" 
          alt="Neon Background" 
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Header */}
      <div className="relative z-[1] flex flex-col items-center gap-4 w-full lg:max-w-fit lg:px-8 lg:py-2 lg:rounded-2xl lg:backdrop-blur-[5px] lg:bg-[linear-gradient(90deg,rgba(40,0,49,0.5)_0%,rgba(0,23,41,0.5)_100%)]">
        <h2 className="font-audiowide font-normal text-[30px] sm:text-[40px] leading-[36px] sm:leading-[45px] text-center bg-gradient-to-r from-[rgba(220,56,255,0.9)] to-[rgba(24,152,255,0.9)] bg-clip-text text-transparent">
          <AnimatedText>{t.reasons.header}</AnimatedText>
        </h2>
      </div>

      {/* Content Container */}
      <div 
        ref={contentRef}
        className="relative z-[1] flex flex-col lg:flex-row justify-center items-center p-8 lg:p-12 gap-12 lg:gap-[100px] w-full max-w-[386px] lg:max-w-[1280px] rounded-2xl backdrop-blur-[15px]" 
        style={{
          background: 'linear-gradient(90deg, rgba(40, 0, 49, 0.5) 0%, rgba(0, 23, 41, 0.5) 100%)',
          opacity: isVisible ? 1 : 0,
          transform: isMobile 
            ? 'none' // Mobile: fade only, no transform
            : (isVisible ? 'translateY(0)' : 'translateY(100px)'), // Desktop: fade + transform
          transition: isMobile
            ? 'opacity 1000ms ease-in-out' // Mobile: fade only
            : 'opacity 1000ms ease-in-out, transform 700ms ease-out', // Desktop: fade + transform
        }}
      >
        {t.reasons.features.map((feature, index) => {
          const { Icon, color, bg } = featureIcons[index];
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-4 w-full lg:w-[310px]"
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon size={28} style={{ color }} />
              </div>

              {/* Title */}
              <h3 className="font-urbanist font-bold text-2xl leading-7 text-center text-white-trans">
                <AnimatedText>{feature.title}</AnimatedText>
              </h3>

              {/* Description */}
              <p className="font-urbanist font-medium text-base leading-6 text-center text-subtitle w-full">
                <AnimatedText>{feature.description}</AnimatedText>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

