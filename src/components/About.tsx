import React from 'react';

interface Value {
  icon: string;
  title: string;
  description: string;
}

const About: React.FC = () => {
  try {
    const values: Value[] = [
      {
        icon: 'heart',
        title: 'Passion',
        description: 'We are passionate about storytelling in all its forms',
      },
      {
        icon: 'eye',
        title: 'Vision',
        description: 'Clear vision drives every project we undertake',
      },
      {
        icon: 'users',
        title: 'Collaboration',
        description: 'Working together to bring your stories to life',
      },
      {
        icon: 'star',
        title: 'Excellence',
        description: 'Committed to delivering exceptional quality',
      },
    ];

    return (
      <section
        id="about"
        className="py-20 bg-white"
        data-name="about"
        data-file="components/About.tsx"
      >
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)] mb-6">
                About Candor Fiction
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At Candor Fiction, we believe that every brand, every product,
                and every idea has a unique story waiting to be told. Our
                mission is to uncover, develop, and bring these stories to life
                through professional photography, meticulous research, and
                compelling writing.
              </p>

              <p className="text-lg text-gray-600 mb-8">
                Whether you're looking to capture the perfect shot, develop a
                narrative for your next project, or need expert writing for
                books or screenplays, our team combines creativity with
                technical expertise to deliver results that exceed expectations.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="btn-primary"
              >
                Work With Us
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-gray-50 card-hover"
                  >
                    <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <div
                        className={`icon-${value.icon} text-xl text-[var(--accent-color)]`}
                      ></div>
                    </div>
                    <h3 className="font-semibold text-[var(--primary-color)] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--primary-color)] text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">
                  It's All About the Story
                </h3>
                <p className="text-white/90">
                  Every project begins with understanding your unique story. We
                  take the time to listen, research, and craft narratives that
                  resonate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
};

export default About;
