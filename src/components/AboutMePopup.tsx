'use client';

import React, { useEffect, useState } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { useLanguage } from '@/contexts/LanguageContext';

interface AboutMePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutMePopup({ isOpen, onClose }: AboutMePopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Store original padding and overflow values
      const originalPaddingRight = document.body.style.paddingRight;
      const originalOverflow = document.body.style.overflow;
      
      // Apply padding to compensate for scrollbar removal
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      // Trigger fade-in animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      
      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      
      {/* Popup */}
      <div
        className={`relative w-full max-w-md my-auto rounded-2xl bg-gradient-to-br from-[#42114d] to-[#072e4d] p-[1px] shadow-2xl transform transition-all duration-500 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner content with background */}
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#2B0B32] to-[#020202] p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white-trans/10 transition-colors text-white/70 hover:text-white"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              {/* Name */}
              <h3 className="font-audiowide text-2xl lg:text-3xl text-white text-center">
                {t.aboutMe.title}
              </h3>
              <p className="font-urbanist font-normal text-base text-center text-subtitle">
                {t.aboutMe.subtitle}
              </p>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-white-border" />

            {/* About Info */}
            <div className="flex flex-col gap-4 w-full items-center">
              <div className="flex flex-col gap-2 items-center text-center">
                <p className="font-urbanist font-normal text-sm text-subtitle leading-relaxed">
                  <AnimatedText>
                    {t.aboutMe.bio1}
                  </AnimatedText>
                </p>
                <p className="font-urbanist font-normal text-sm text-subtitle leading-relaxed mt-2">
                  <AnimatedText>
                    {t.aboutMe.bio2}
                  </AnimatedText>
                </p>
                <p className="font-urbanist font-normal text-sm text-subtitle leading-relaxed mt-2">
                  <AnimatedText>
                    {t.aboutMe.bio3}
                  </AnimatedText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

