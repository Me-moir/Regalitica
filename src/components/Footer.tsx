"use client";
import Image from 'next/image';
const logoImage = '/assets/Logo.png';

const Footer = () => {
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
      links: ['The Fool’s Sandbox', 'Attributions', 'Resources']
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
    <footer className="relative bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 mt-20 z-70">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-base font-semibold mb-4 text-white">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo and Tagline Section */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
              <Image 
                src={logoImage} 
                alt="Regalitica" 
                width={256} 
                height={64} 
                className="h-16 w-auto mb-4"
              />
            
            {/* Title */}
            <h3 className="text-2xl font-bold mb-4 text-red-500">
              The Fool Prime Group
            </h3>
            
            {/* Tagline */}
            <div className="text-gray-400 text-sm mb-6 space-y-1">
              <p>Fools with nothing.</p>
              <p>Become anything.</p>
              <p className="font-semibold text-gray-300">Aspire Everything.</p>
            </div>
            
            {/* Divider Line */}
            <div className="w-64 h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6"></div>
            
            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © 2026 The Fool Prime Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;