"use client";

const AffiliatesTab = () => {
  return (
    <section className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            Our Partners
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Together we achieve more. Join forces with innovators who share your vision for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
              Building Tomorrow, Together
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-4 sm:mb-6">
              We partner with visionaries, innovators, and change-makers who aren't afraid to challenge the status quo. Our collaborative approach transforms bold ideas into reality.
            </p>
            <p className="text-base sm:text-lg text-gray-400">
              Join a network of partners who believe in pushing boundaries and creating lasting impact.
            </p>
            <button className="mt-6 sm:mt-8 bg-gray-800/80 text-gray-200 px-6 py-3 rounded-full font-semibold border border-gray-700 hover:border-green-500 transition-all">
              Become a Partner
            </button>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-3xl h-64 sm:h-80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl sm:text-2xl text-gray-400 text-center px-4">Partner Network Visualization</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl h-32 flex items-center justify-center hover:border-green-500/50 transition-all"
            >
              <span className="text-gray-500">Partner {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliatesTab;
