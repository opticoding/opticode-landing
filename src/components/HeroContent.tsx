'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedText from '@/components/AnimatedText';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center lg:items-start gap-4 w-full max-w-[440px] lg:max-w-[495px]">
      {/* Company Name / Brand */}
      <h1 className="font-audiowide font-normal text-[40px] leading-[45px] sm:text-[46px] sm:leading-[51px] lg:text-[56px] lg:leading-[60px] text-center lg:text-left text-white-trans -ml-0.5">
        <AnimatedText>{t.hero.companyName}</AnimatedText>
      </h1>

      <div className="flex flex-col gap-8 sm:gap-12 items-center lg:items-start w-full">
        <p className="font-urbanist font-bold text-lg lg:text-2xl text-center lg:text-left text-white-trans flex flex-col sm:flex-row sm:gap-2 leading-tight sm:leading-6 lg:leading-8">
          <span>
            <AnimatedText>{t.hero.taglinePart1}</AnimatedText> &
          </span>
          <AnimatedText>{t.hero.taglinePart2}</AnimatedText>
        </p>

        <p className="font-urbanist font-medium text-base leading-6 lg:text-lg lg:leading-7 text-center lg:text-left text-white/85 block rounded-2xl p-4 backdrop-blur-[15px]" style={{ background: 'linear-gradient(-90deg, rgba(40, 0, 49, 0.5) 0%, rgba(0, 23, 41, 0.5) 100%)' }}>
          <AnimatedText>{t.hero.intro}</AnimatedText>
          {' '}
          <span className="font-semibold text-[#cb5be3]">
            <AnimatedText>{t.hero.highlight}</AnimatedText>
          </span>
          {' '}
          <AnimatedText>{t.hero.introEnd}</AnimatedText>
        </p>

        {/* Location tag */}
        <div className="font-urbanist font-medium text-sm lg:text-base text-center lg:text-left text-subtitle/80 flex flex-col lg:flex-row items-center lg:items-start gap-2">
          <svg className="w-6 h-6 lg:w-5 lg:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <AnimatedText>{t.hero.locationBase}</AnimatedText>
            <span className="hidden sm:inline text-2xl leading-none">•</span>
            <AnimatedText>{t.hero.locationAvailability}</AnimatedText>
          </div>
        </div>
      </div>
    </div>
  );
}