"use client";

const VenturesTab = () => {
  return (
    <section className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-section)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Icon or Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: 'var(--content-primary)' }}>
          Ventures
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--content-muted)' }}>
          Exploring new frontiers and building the future
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ background: 'var(--hover-bg)', border: '1px solid var(--border-color)' }}>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium" style={{ color: 'var(--content-tertiary)' }}>Coming Soon</span>
        </div>

        {/* Additional Info */}
        <p className="mt-12 text-sm max-w-2xl mx-auto" style={{ color: 'var(--content-tertiary)' }}>
          We're currently building something amazing. Check back soon to discover our ventures and initiatives.
        </p>
      </div>
    </section>
  );
};

export default VenturesTab;