"use client";
import { memo, useState, useEffect, useCallback } from 'react';
import { contentData } from '@/data/information-data';
import ContentHeader from './ContentHeader';

const COOKIE_KEY = 'nr-cookie-consent';

type ConsentValue = 'all' | 'essential' | null;

function getStoredConsent(): ConsentValue {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(COOKIE_KEY);
  if (v === 'all' || v === 'essential') return v;
  return null;
}

const CookieSettings = () => {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  const handleChange = useCallback((value: 'all' | 'essential') => {
    setConsent(value);
    localStorage.setItem(COOKIE_KEY, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  return (
    <>
      <style>{`
        .cookie-settings-card {
          margin-top: 2rem;
          padding: 1.75rem 2rem;
          border-radius: 14px;
          background: var(--surface-card, #0f0f0f);
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          position: relative;
          overflow: hidden;
        }
        .cookie-settings-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #EB1143 20%, #EB1143 80%, transparent 100%);
          opacity: 0.5;
        }
        .cookie-settings-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--content-primary);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
        }
        .cookie-settings-title i { color: #EB1143; font-size: 1.1rem; }
        .cookie-settings-desc {
          font-size: 0.88rem;
          color: var(--content-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .cookie-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          background: var(--surface-secondary, rgb(10,10,10));
          margin-bottom: 0.75rem;
          transition: border-color 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .cookie-option:hover {
          border-color: rgba(235,17,67,0.3);
        }
        .cookie-option.active {
          border-color: rgba(235,17,67,0.5);
          background: rgba(235,17,67,0.04);
        }
        .cookie-option-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .cookie-option-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--content-primary);
        }
        .cookie-option-sub {
          font-size: 0.78rem;
          color: var(--content-muted);
          line-height: 1.5;
        }
        .cookie-toggle {
          width: 44px;
          height: 24px;
          border-radius: 999px;
          background: var(--hover-bg, rgba(255,255,255,0.05));
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          position: relative;
          flex-shrink: 0;
          transition: background 0.25s ease, border-color 0.25s ease;
          cursor: pointer;
        }
        .cookie-toggle.on {
          background: #EB1143;
          border-color: #EB1143;
        }
        .cookie-toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .cookie-toggle.on::after {
          transform: translateX(20px);
        }
        .cookie-saved-msg {
          margin-top: 1rem;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          background: rgba(235,17,67,0.08);
          border: 1px solid rgba(235,17,67,0.2);
          font-size: 0.8rem;
          font-weight: 500;
          color: #EB1143;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: cookieSettingsFadeIn 0.3s ease;
        }
        @keyframes cookieSettingsFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cookie-essential-badge {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--content-faint);
          background: var(--hover-bg);
          border: 1px solid var(--border-color);
          padding: 2px 8px;
          border-radius: 4px;
          flex-shrink: 0;
        }
      `}</style>
      <div className="cookie-settings-card">
        <div className="cookie-settings-title">
          <i className="bi bi-gear" />
          Cookie Preferences
        </div>
        <p className="cookie-settings-desc">
          Manage how cookies are used on this site. Essential cookies are always active to keep
          the site functional. You can toggle analytics cookies below. Changes are saved instantly.
        </p>

        {/* Essential cookies — always on */}
        <div className="cookie-option active" style={{ cursor: 'default' }}>
          <div className="cookie-option-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="cookie-option-label">Essential Cookies</span>
              <span className="cookie-essential-badge">Always On</span>
            </div>
            <span className="cookie-option-sub">
              Required for core site functionality — navigation, authentication, and security. Cannot be disabled.
            </span>
          </div>
          <div className="cookie-toggle on" style={{ opacity: 0.6, pointerEvents: 'none' }} />
        </div>

        {/* Analytics cookies — toggleable */}
        <div
          className={`cookie-option${consent === 'all' ? ' active' : ''}`}
          onClick={() => handleChange(consent === 'all' ? 'essential' : 'all')}
        >
          <div className="cookie-option-info">
            <span className="cookie-option-label">Analytics &amp; Performance</span>
            <span className="cookie-option-sub">
              Helps us understand how visitors interact with the site so we can improve the experience.
              Includes traffic analysis and content personalization.
            </span>
          </div>
          <div className={`cookie-toggle${consent === 'all' ? ' on' : ''}`} />
        </div>

        {saved && (
          <div className="cookie-saved-msg">
            <i className="bi bi-check-circle-fill" />
            Preferences saved successfully.
          </div>
        )}
      </div>
    </>
  );
};

interface PrivacyProps {
  isTransitioning?: boolean;
}

const privacyContent = contentData.privacy;

const Privacy = memo(({ isTransitioning = false }: PrivacyProps) => {
  return (
    <div className="px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div>
          <ContentHeader
            icon={privacyContent.icon}
            title={privacyContent.title}
            isTransitioning={isTransitioning}
          />
        </div>

        <div className="space-y-6 sm:space-y-8">
          {privacyContent.sections.map((section, index) => (
            <div key={index}>
              <div className="space-y-3 sm:space-y-4">
                {section.heading && (
                  <h3
                    className="text-xl sm:text-2xl lg:text-3xl font-semibold"
                    style={{ color: 'var(--content-primary)' }}
                  >
                    {section.heading}
                  </h3>
                )}

                <div className="space-y-3 sm:space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base sm:text-lg lg:text-xl leading-relaxed"
                      style={{ color: 'var(--content-muted)' }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Inject Cookie Preferences right after Cookie Usage */}
                {section.heading === 'Cookie Usage' && <CookieSettings />}

                {index < privacyContent.sections.length - 1 && (
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mt-6 sm:mt-8" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm sm:text-base text-center" style={{ color: 'var(--content-muted)' }}>
            Last updated: January 2026 • For questions or concerns, please contact our legal team
          </p>
        </div>
      </div>
    </div>
  );
});

Privacy.displayName = 'Privacy';

export default Privacy;