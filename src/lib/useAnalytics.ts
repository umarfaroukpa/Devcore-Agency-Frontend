'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-YOUR_GA_ID', {
        page_path: pathname,
      });
    }
    
    // Optional: Log to console for development
    console.log(`Page view: ${pathname}`);
  }, [pathname]);

  const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', eventName, eventParams);
      }
      
      // Custom event logging (can be sent to your backend)
      console.log('Event tracked:', eventName, eventParams);
      
      // Send to your API if needed
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   body: JSON.stringify({ event: eventName, ...eventParams }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
    }
  };

  return { trackEvent };
}