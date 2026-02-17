"use client";
import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="nav-button relative rounded-full font-medium tracking-wide transition-all duration-300 hover:scale-105"
      style={{
        padding: '7px 12px',
        fontSize: '0.875rem',
        color: 'var(--content-faint)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'} text-sm`}></i>
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;