import React from 'react';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

const Contact: React.FC = () => {
  try {
    const [formData, setFormData] = React.useState<FormData>({
      name: '',
      email: '',
      service: '',
      message: '',
    });

    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Simulate form submission
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({ name: '', email: '', service: '', message: '' });
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    return (
      <section
        id="contact"
        className="py-20 bg-gray-50"
        data-name="contact"
        data-file="components/Contact.tsx"
      >
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary-color)] mb-6">
              Let's Tell Your Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to bring your vision to life? Get in touch and let's discuss
              how we can help tell your story.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="photography">Commercial Photography</option>
                    <option value="research">
                      Story Research & Development
                    </option>
                    <option value="writing">Creative Story Writing</option>
                    <option value="all">All Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>

                {isSubmitted && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[var(--primary-color)] mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center mt-1">
                      <div className="icon-mail text-xl text-[var(--accent-color)]"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">{config.contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center mt-1">
                      <div className="icon-phone text-xl text-[var(--accent-color)]"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone</h4>
                      <p className="text-gray-600">{config.contact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4">
                  Why Choose Candor Fiction?
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="icon-check text-lg text-[var(--accent-color)] mr-3"></div>
                    Professional quality guaranteed
                  </li>
                  <li className="flex items-center">
                    <div className="icon-check text-lg text-[var(--accent-color)] mr-3"></div>
                    Collaborative approach
                  </li>
                  <li className="flex items-center">
                    <div className="icon-check text-lg text-[var(--accent-color)] mr-3"></div>
                    Timely delivery
                  </li>
                  <li className="flex items-center">
                    <div className="icon-check text-lg text-[var(--accent-color)] mr-3"></div>
                    Competitive pricing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Contact component error:', error);
    return null;
  }
};

export default Contact;
