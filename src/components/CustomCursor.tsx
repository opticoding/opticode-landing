'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsTouch } from '@/hooks/useIsTouch';

export default function CustomCursor() {
  const isTouch = useIsTouch();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Don't set up event listeners on touch devices
    if (isTouch) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      
      // Check if we're hovering over interactive element
      requestAnimationFrame(() => {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target) {
          const interactiveElement = (target as HTMLElement).closest('.cursor-interactive');
          setIsHovering(!!interactiveElement);
        }
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, isTouch]);

  // Don't render cursor on touch devices
  if (isTouch) {
    return null;
  }

  return (
    <>
      {/* Outer glow orb */}
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{
          x: mousePosition.x - 24, // -24 is half of h-12 (48px)
          y: mousePosition.y - 24,
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
        animate={{
          scale: 1,
          opacity: isVisible ? 0.3 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        <div
          className="h-12 w-12 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(10px)',
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* Inner bright orb */}
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{
          x: mousePosition.x - 8, // -8 is half of h-4 (16px)
          y: mousePosition.y - 8,
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
        animate={{
          scale: isHovering ? 0.5 : 0.8,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 20,
          mass: 0.05,
        }}
      >
        <div
          className="h-4 w-4 rounded-full"
          style={{
            background: 'rgb(245, 251, 255)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
            filter: isHovering ? 'blur(1px)' : 'blur(2px)',
            willChange: 'transform',
          }}
        />
      </motion.div>
    </>
  );
}

