'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedText from '@/components/AnimatedText';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center lg:items-start gap-8 w-full max-w-[386px] lg:max-w-[434px]">
      {/* Headline */}
      <h1 className="font-audiowide font-normal text-[40px] leading-[45px] sm:text-[46px] sm:leading-[51px] lg:text-[56px] lg:leading-[60px] text-center lg:text-left text-white-trans">
        <AnimatedText>{t.hero.headline}</AnimatedText>
      </h1>

      {/* Description */}
      <p className="font-urbanist font-medium text-base leading-6 lg:text-xl lg:leading-7 text-center lg:text-left text-subtitle">
        <AnimatedText>{t.hero.description}</AnimatedText>
        {' '}
        <span className="font-bold text-primary">
          <AnimatedText>{t.hero.descriptionHighlight}</AnimatedText>
        </span>
        <AnimatedText>{t.hero.descriptionEnd}</AnimatedText>
      </p>
    </div>
  );
}

