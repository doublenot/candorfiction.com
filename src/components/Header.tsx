import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
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
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm"
      data-name="header"
      data-file="components/Header.tsx"
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <h1
              className="logo cursor-pointer"
              onClick={() =>
                isHomePage ? scrollToSection('home') : navigate('/')
              }
            >
              <span className="text-2xl font-bold text-[var(--primary-color)]">
                {config.company.name}
              </span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              Contact
            </button>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="icon-menu text-xl text-[var(--primary-color)]"></div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-[var(--text-dark)] hover:text-[var(--accent-color)] transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-primary w-fit"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
