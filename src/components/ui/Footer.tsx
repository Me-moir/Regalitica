"use client";
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import styles from '@/styles/ui.module.css';

const logoImage = '/assets/Logo.png';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const links = footer.querySelectorAll('[data-glow]');
      links.forEach((link) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (link as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (link as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    footer.addEventListener('mousemove', handleMouseMove);
    return () => footer.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sections = [
    {
      title: 'Information',
      links: ['About', 'Organization', 'Vision', 'Ventures', 'Approach']
    },
    {
      title: 'Reach Out',
      links: ['Contact', 'Support', 'Feedback', 'Report bug']
    },
    {
      title: 'Tools',
      links: ["The Fool's Sandbox", "Attributions", "Resources"]
    },
    {
      title: 'Official Affiliates',
      links: ['Partners', 'Sponsors', 'Licenses']
    },
    {
      title: 'Community',
      links: ['Contribute', 'Build With Us', 'Become a Fool', 'The Sandbox Program']
    },
    {
      title: 'Legal',
      links: ['Acceptable Use Policy', 'Terms and Conditions', 'Privacy Policy', 'Cookie Policy', 'Disclaimer']
    }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative overflow-hidden mt-20 z-70"
      style={{
        background: 'linear-gradient(to bottom, rgb(10, 10, 10) 0%, rgb(5, 5, 5) 50%, rgb(0, 0, 0) 100%)',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3 sm:space-y-4">
              <h4 
                className="text-sm sm:text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href="#" 
                      data-glow
                      className="relative inline-block text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-300 group"
                      style={{
                        '--mouse-x': '50%',
                        '--mouse-y': '50%',
                      } as React.CSSProperties}
                    >
                      <span className="relative z-10">{link}</span>
                      <span 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: 'radial-gradient(80px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 166, 0.15), transparent 70%)',
                          filter: 'blur(8px)'
                        }}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider with gradient */}
        <div className="mb-12 sm:mb-16">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Logo and Tagline Section */}
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          {/* Logo with glow effect */}
          <div className="relative group">
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(0, 255, 166, 0.2), rgba(236, 72, 153, 0.2), transparent 70%)',
              }}
            />
            <Image 
              src={logoImage} 
              alt="Regalitica" 
              width={256} 
              height={64} 
              className="h-12 sm:h-16 w-auto relative z-10 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Title with gradient */}
          <h3 
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 166, 0.9), rgba(59, 130, 246, 0.9), rgba(236, 72, 153, 0.9))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            NOUMENA GROUP
          </h3>
          
          {/* Tagline */}
          <div className="text-gray-400 text-sm sm:text-base space-y-1">
            <p className="transition-colors duration-300 hover:text-gray-300">Beyond perception.</p>
            <p className="transition-colors duration-300 hover:text-gray-300">Beyond form.</p>
            <p 
              className="font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Beyond everything.
            </p>
          </div>
          
          {/* Divider Line with gradient */}
          <div className="w-48 sm:w-64 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Social Media Icons (Optional - add if needed) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {['bi-twitter-x', 'bi-github', 'bi-discord', 'bi-linkedin'].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="relative group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #050505 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 255, 166, 0.3), rgba(59, 130, 246, 0.2), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                />
                <i className={`bi ${icon} text-gray-400 group-hover:text-white transition-colors duration-300`}></i>
              </a>
            ))}
          </div>
          
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-500 pt-4">
            © 2026 The Fool Prime Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;