import React from 'react';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

const PrivacyPolicy: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto section-padding py-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)] mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Last updated:{' '}
            {new Date(
              config.legal.privacyPolicy.lastUpdated
            ).toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Candor Fiction, we collect information you provide directly to
              us, such as when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Fill out our contact forms</li>
              <li>Subscribe to our newsletter</li>
              <li>Communicate with us via email or phone</li>
              <li>Use our website and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Send you technical notices, updates, and administrative messages
              </li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this privacy policy. We may share your information
              with trusted service providers who assist us in operating our
              website and conducting our business, as long as they agree to keep
              this information confidential.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at:
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

export default PrivacyPolicy;
