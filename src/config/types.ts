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

export interface SiteConfig {
  contact: ContactInfo;
  socialMedia: SocialMediaLink[];
  company: CompanyInfo;
  legal: LegalInfo;
}
