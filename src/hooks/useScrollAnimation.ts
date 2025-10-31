import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  resetScrollDistance?: number;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.2, resetScrollDistance = 500 } = options;
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationScrollYRef = useRef(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer to detect when element enters view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
            animationScrollYRef.current = window.scrollY;
          }
        });
      },
      {
        threshold,
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated, threshold]);

  // Track scroll position and reset if scrolling back up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = animationScrollYRef.current - currentScrollY;
      
      // Reset animation if scrolled back up the specified distance
      if (hasAnimated && scrollDelta >= resetScrollDistance) {
        setIsVisible(false);
        setHasAnimated(false);
        animationScrollYRef.current = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated, resetScrollDistance]);

  return { elementRef: elementRef as RefObject<T>, isVisible };
}

