'use client';

import { GlobeIcon, SmartphoneIcon, BoxIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedText from '@/components/AnimatedText';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionId } from '@/constants/constants';

export default function ServicesSection() {
  const { t } = useLanguage();
  const { elementRef: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
    resetScrollDistance: 500,
  });
  const isMobile = useIsMobile();
  
  // Individual scroll animations for each card (only used on mobile)
  const card0Ref = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    resetScrollDistance: 5000,
  });
  const card1Ref = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    resetScrollDistance: 5000,
  });
  const card2Ref = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    resetScrollDistance: 5000,
  });

  const cardRefs = [card0Ref, card1Ref, card2Ref];

  const baseServices = [
    {
      icon: GlobeIcon,
      iconColor: '#DC38FF',
      borderColor: 'rgba(220, 56, 255, 0.25)',
      iconBg: 'rgba(220, 56, 255, 0.2)',
    },
    {
      icon: SmartphoneIcon,
      iconColor: '#2A4BDB',
      borderColor: 'rgba(42, 75, 219, 0.25)',
      iconBg: 'rgba(42, 75, 219, 0.2)',
    },
    {
      icon: BoxIcon,
      iconColor: '#1898FF',
      borderColor: 'rgba(24, 152, 255, 0.25)',
      iconBg: 'rgba(24, 152, 255, 0.2)',
    },
  ];

  const services = baseServices.map((base, index) => ({
    ...base,
    ...t.services.items[index],
  }));

  return (
    <section 
      id={SectionId.SERVICES}
      ref={sectionRef}
      className="w-full flex flex-col justify-center items-center py-24 lg:pt-[150px] lg:pb-[160px] px-8 2xl:px-0 gap-16"
      style={{
        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), linear-gradient(139.48deg, #051F33 0%, #B000D5 100%)'
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[386px] sm:max-w-[500px] lg:max-w-none">
        <h2 className="font-audiowide text-[30px] leading-[28px] sm:text-[40px] sm:leading-[45px] lg:text-5xl lg:leading-9 text-center text-white-trans">
          <AnimatedText>{t.services.header}</AnimatedText>
        </h2>
        <p className="font-urbanist font-medium text-base leading-6 lg:text-xl text-center text-subtitle">
          <AnimatedText>{t.services.subheader}</AnimatedText>
        </p>
      </div>

      {/* Service Cards */}
      <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-8 w-full max-w-[386px] lg:max-w-desktop mx-auto">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          const cardRef = cardRefs[index];
          
          // Determine animation based on card position and screen size
          let transformValue = 'translateX(0)';
          let cardVisible = isVisible;
          
          // On mobile, use individual card visibility
          if (isMobile) {
            cardVisible = cardRef.isVisible;
            transformValue = cardVisible ? 'translateY(0)' : 'translateY(200px)';
          } else {
            // Desktop: use section visibility with horizontal transforms
            if (index === 0) {
              // Left card: slide from left
              transformValue = isVisible ? 'translateX(0)' : 'translateX(-500px)';
            } else if (index === 2) {
              // Right card: slide from right
              transformValue = isVisible ? 'translateX(0)' : 'translateX(500px)';
            } else {
              // Middle card: no transform
              transformValue = 'translateX(0)';
            }
          }
          
          return (
            <div
              key={index}
              ref={cardRef.elementRef}
              className="flex flex-col items-center p-4 lg:p-8 gap-4 rounded-2xl w-full lg:flex-1"
              style={{
                border: `1px solid ${service.borderColor}`,
                opacity: cardVisible ? 1 : 0,
                transform: transformValue,
                transition: isMobile
                  ? 'opacity 1000ms ease-in-out, transform 700ms ease-out'
                  : index === 1
                    ? 'opacity 1000ms ease-in-out'
                    : 'opacity 1000ms ease-in-out, transform 700ms ease-out',
              }}
            >
              {/* Icon */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-12 h-12">
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: service.iconBg,
                      left: 'calc(50% - 23px)',
                      top: 'calc(50% - 23px)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent size={28} style={{ color: service.iconColor }} />
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="font-urbanist font-bold text-2xl leading-7 text-center"
                  style={{ color: service.iconColor }}
                >
                  <AnimatedText>{service.title}</AnimatedText>
                </h3>
              </div>

              {/* Description */}
              <p className="font-urbanist font-medium text-base leading-6 text-center text-subtitle w-full max-w-[350px]">
                {(() => {
                  const parts = service.description.split(new RegExp(`(${service.highlightedWord})`, 'gi'));
                  return parts.map((part, index) => 
                    part.toLowerCase() === service.highlightedWord.toLowerCase() ? (
                      <span key={index} style={{ color: '#ffffff', fontWeight: 700 }}>
                        <AnimatedText>{part}</AnimatedText>
                      </span>
                    ) : (
                      <AnimatedText key={index}>{part}</AnimatedText>
                    )
                  );
                })()}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
