import React from 'react';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

const TermsAndConditions: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto section-padding py-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)] mb-8">
          Terms & Conditions
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Last updated:{' '}
            {new Date(
              config.legal.termsAndConditions.lastUpdated
            ).toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Candor Fiction's website and services, you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Services Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Candor Fiction provides professional creative services including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Commercial photography services</li>
              <li>Story research and development</li>
              <li>Creative writing for books and screenplays</li>
              <li>Content strategy and narrative design</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content, materials, and intellectual property rights in our
              services remain the property of Candor Fiction unless otherwise
              agreed upon in writing. Clients receive usage rights as specified
              in individual service agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Payment Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Payment terms are specified in individual service agreements.
              Generally, a deposit is required to begin work, with final payment
              due upon completion and delivery of services. Late payments may
              incur additional fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Candor Fiction shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of or in connection
              with our services. Our total liability shall not exceed the amount
              paid for the specific service in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Either party may terminate services with appropriate notice as
              specified in individual service agreements. Termination does not
              affect payment obligations for work completed prior to
              termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions regarding these terms and conditions, please contact
              us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Email: {config.contact.email}
                <br />
                Phone: {config.contact.phone}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
