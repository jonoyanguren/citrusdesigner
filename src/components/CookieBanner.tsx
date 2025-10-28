'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import CookieConsent from 'react-cookie-consent';

export default function CookieBanner() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('cookies.banner');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    // Disparar evento personalizado para que otros componentes sepan
    window.dispatchEvent(new Event('cookie-consent-change'));

    // Recargar la página para cargar los scripts de tracking
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    window.dispatchEvent(new Event('cookie-consent-change'));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('accept')}
      declineButtonText={t('decline')}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="citrus-cookie-consent"
      style={{
        background: '#1a1a1a',
        padding: '20px',
        alignItems: 'center',
      }}
      buttonStyle={{
        background: '#84cc16',
        color: '#000',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        padding: '12px 24px',
        border: 'none',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#fff',
        fontSize: '14px',
        border: '1px solid #666',
        borderRadius: '8px',
        padding: '12px 24px',
        cursor: 'pointer',
      }}
      expires={365}
    >
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-white text-lg">
          {t('title')}
        </span>
        <span className="text-gray-300 text-sm">
          {t('message')}
          {' '}
          <a
            href="/cookie-policy"
            className="underline hover:text-lime-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('moreInfo')}
          </a>
        </span>
      </div>
    </CookieConsent>
  );
}