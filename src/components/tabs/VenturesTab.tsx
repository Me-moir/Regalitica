"use client";

const VenturesTab = () => {
  const features = [
    { icon: '🚀', title: 'AI & Machine Learning', desc: 'Building intelligent systems that learn and adapt to solve complex problems.' },
    { icon: '🔗', title: 'Blockchain & Web3', desc: 'Decentralized solutions for a more transparent and equitable digital future.' },
    { icon: '🌱', title: 'Sustainable Tech', desc: 'Green technologies driving positive environmental impact at scale.' },
    { icon: '🏥', title: 'Healthcare Innovation', desc: 'Revolutionizing patient care through technology and data-driven insights.' },
    { icon: '📚', title: 'EdTech Solutions', desc: 'Making quality education accessible to everyone, everywhere.' },
    { icon: '⚡', title: 'Clean Energy', desc: 'Accelerating the transition to renewable and sustainable energy sources.' },
  ];

  return (
    <section className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            Our Ventures
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bold ideas, relentless execution. We build the future, one venture at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-green-500">
            Explore All Ventures
          </button>
        </div>
      </div>
    </section>
  );
};

export default VenturesTab;
