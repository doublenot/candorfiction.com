import React from 'react';

const Hero: React.FC = () => {
  try {
    return (
      <section
        id="home"
        className="hero-gradient text-white pt-20"
        data-name="hero"
        data-file="components/Hero.tsx"
      >
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                It's All About the
                <span className="text-gradient block">Story</span>
              </h1>

              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                Professional commercial photography, story research &
                development, and creative writing services that bring your
                vision to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById('services')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="btn-primary text-lg"
                >
                  Explore Services
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('contact')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="btn-secondary text-lg"
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516996087931-5ae405802f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Creative storytelling and photography"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white text-[var(--text-dark)] p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[var(--accent-color)] rounded-lg flex items-center justify-center">
                    <div className="icon-camera text-xl text-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Professional</h3>
                    <p className="text-sm text-gray-600">Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
};

export default Hero;
