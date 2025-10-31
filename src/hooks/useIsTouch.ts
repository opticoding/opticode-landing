import { useState, useEffect } from 'react';

/**
 * Simple hook to detect mobile/tablet devices.
 * Defaults to false (show cursor) and only hides on clear mobile devices.
 */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Simple check: only hide cursor on clear mobile/tablet user agents
    // This prioritizes desktop experience - even touchscreen laptops will show cursor
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsTouch(isMobile);
    }
  }, []);

  return isTouch;
}

