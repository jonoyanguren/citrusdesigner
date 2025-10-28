'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface FacebookPixelProps {
  pixelId: string;
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ha dado su consentimiento
    const consent = localStorage.getItem('cookie-consent');
    setHasConsent(consent === 'true');

    // Escuchar eventos de cambio de consentimiento
    const handleConsentChange = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'true');
    };

    window.addEventListener('cookie-consent-change', handleConsentChange);
    return () => window.removeEventListener('cookie-consent-change', handleConsentChange);
  }, []);

  if (!hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Hook para rastrear eventos personalizados
export function useFacebookPixel() {
  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, data);
    }
  };

  const trackCustomEvent = (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', eventName, data);
    }
  };

  return { trackEvent, trackCustomEvent };
}