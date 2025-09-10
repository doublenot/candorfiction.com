import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = React.useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page and then scroll to section
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer
      className="bg-[var(--primary-color)] text-white py-16"
      data-name="footer"
      data-file="components/Footer.tsx"
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{config.company.name}</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Professional creative services specializing in commercial
              photography, story research & development, and creative writing.
              It's all about the story.
            </p>
            <div className="flex space-x-4">
              {config.socialMedia.map((social, index) => (
                <a
                  key={index}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <div className={`icon-${social.icon} text-lg`}></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Commercial Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Story Research
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Creative Writing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Script Development
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              &copy; {config.company.copyrightYear} {config.company.name}. All
              rights reserved.
            </p>
            <p className="text-white/60 text-sm mt-4 md:mt-0">
              {config.company.tagline}
            </p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={() =>
              isHomePage
                ? scrollToSection('home')
                : (window.location.href = '/')
            }
            className="fixed bottom-8 right-8 w-12 h-12 bg-[var(--accent-color)] text-white rounded-full shadow-lg hover:bg-[var(--accent-color)]/90 transition-all duration-300 flex items-center justify-center z-40"
            aria-label="Scroll to top"
          >
            <div className="icon-arrow-up text-xl"></div>
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
