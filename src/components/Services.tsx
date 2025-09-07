import React from 'react';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const Services: React.FC = () => {
  try {
    const services: Service[] = [
      {
        icon: 'camera',
        title: 'Commercial Photography',
        description:
          'Professional photography services that capture the essence of your brand and tell your story through powerful imagery.',
        features: [
          'Product Photography',
          'Brand Photography',
          'Corporate Headshots',
          'Event Coverage',
        ],
      },
      {
        icon: 'search',
        title: 'Story Research & Development',
        description:
          'Comprehensive research and development services to create compelling narratives for your projects.',
        features: [
          'Market Research',
          'Character Development',
          'Plot Structure',
          'Narrative Design',
        ],
      },
      {
        icon: 'pen-tool',
        title: 'Creative Story Writing',
        description:
          'Expert writing services for books and feature film scripts that engage audiences and bring stories to life.',
        features: [
          'Book Writing',
          'Script Writing',
          'Story Editing',
          'Content Strategy',
        ],
      },
    ];

    return (
      <section
        id="services"
        className="py-20 bg-gray-50"
        data-name="services"
        data-file="components/Services.tsx"
      >
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)] mb-6">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in three core areas that work together to create
              compelling stories across multiple mediums and platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 card-hover">
                <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-xl flex items-center justify-center mb-6">
                  <div
                    className={`icon-${service.icon} text-2xl text-[var(--accent-color)]`}
                  ></div>
                </div>

                <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className="icon-check text-lg text-[var(--accent-color)] mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Services component error:', error);
    return null;
  }
};

export default Services;
