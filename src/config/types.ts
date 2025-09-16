export interface MenuItem {
  label: string;
  target: string;
  type: 'scroll' | 'route';
  isPrimary?: boolean;
}

export interface NavigationConfig {
  menuItems: MenuItem[];
}

export interface SocialMediaLink {
  icon: string;
  href: string;
  label: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  copyrightYear: number;
  foundedYear: number;
}

export interface LegalInfo {
  privacyPolicy: {
    lastUpdated: string;
  };
  termsAndConditions: {
    lastUpdated: string;
  };
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  id?: string;
}

export interface InstagramConfig {
  enabled: boolean;
  username: string;
  maxImages: number;
  refreshInterval: number;
}

export interface GalleryConfig {
  instagram: InstagramConfig;
  fallbackImages: GalleryImage[];
}

export interface SiteConfig {
  navigation: NavigationConfig;
  contact: ContactInfo;
  socialMedia: SocialMediaLink[];
  company: CompanyInfo;
  legal: LegalInfo;
  gallery: GalleryConfig;
}
