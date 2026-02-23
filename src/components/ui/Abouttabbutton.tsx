"use client";
import { memo } from "react";

interface AboutTabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ABOUT_TAB_CSS = `
@keyframes aboutTabOrbit {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

/* ── Wrapper: the 1px gradient ring lives on ::before ── */
.about-tab-border {
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 10.5px;
  padding: 1px;
  position: relative;
  background: transparent;
}

.about-tab-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10.5px;
  background: linear-gradient(90deg,
    rgba(0,255,166,0.0)  0%,
    rgba(0,255,166,0.9) 15%,
    rgba(255,215,0,0.7)  30%,
    rgba(236,72,153,0.7) 45%,
    rgba(147,51,234,0.7) 60%,
    rgba(59,130,246,0.6) 75%,
    rgba(0,255,166,0.0)  90%);
  background-size: 200% 100%;
  animation: aboutTabOrbit 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.about-tab-border:hover::before,
.about-tab-border.abt-active::before {
  opacity: 1;
}

/* ── Inner button: solid opaque bg so gradient only shows in the 1px ring gap ── */
.about-tab-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  border-radius: 9.5px;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: var(--navbar-bg, #0f0f0f);
  color: var(--content-faint, rgba(255,255,255,0.45));
  box-shadow:
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
  transition: color 0.15s ease, background 0.15s ease, box-shadow 0.2s ease;
}

@media (min-width: 640px) {
  .about-tab-btn {
    padding: 0.625rem 2rem;
    font-size: 0.875rem;
  }
}

.about-tab-border:hover .about-tab-btn {
  color: var(--content-primary, rgba(255,255,255,0.92));
  box-shadow:
    0 4px 14px rgba(0,0,0,0.26),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

.about-tab-btn.abt-active {
  color: var(--content-primary, rgba(255,255,255,0.92));
  font-weight: 600;
  background: var(--navbar-bg-active, #1a1a1a);
  box-shadow:
    0 4px 14px rgba(0,0,0,0.26),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

/* Active underline accent */
.about-tab-btn.abt-active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 14px;
  right: 14px;
  height: 1.5px;
  border-radius: 999px;
  background: rgba(0,255,166,0.75);
}

/* Dark mode subtle outline on inactive */
:root.dark .about-tab-border:not(.abt-active) .about-tab-btn {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

/* Light mode overrides */
:root.light .about-tab-btn {
  background: var(--navbar-bg, #f5f5f5);
  color: var(--content-faint, rgba(0,0,0,0.45));
}
:root.light .about-tab-btn.abt-active {
  background: var(--navbar-bg-active, #ebebeb);
  color: var(--content-primary, rgba(0,0,0,0.92));
}
:root.light .about-tab-border:hover .about-tab-btn {
  color: var(--content-primary, rgba(0,0,0,0.92));
}
`;

// Inject styles once at module level to avoid per-instance duplication
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.setAttribute('data-about-tab', '');
  el.textContent = ABOUT_TAB_CSS;
  document.head.appendChild(el);
  stylesInjected = true;
}

const AboutTabButton = memo<AboutTabButtonProps>(({ label, isActive, onClick, onMouseMove }) => {
  injectStyles();

  return (
    <div className={`about-tab-border${isActive ? ' abt-active' : ''}`}>
      <button
        className={`about-tab-btn${isActive ? ' abt-active' : ''}`}
        onClick={onClick}
        onMouseMove={onMouseMove}
      >
        {label}
      </button>
    </div>
  );
});

AboutTabButton.displayName = 'AboutTabButton';

export default AboutTabButton;