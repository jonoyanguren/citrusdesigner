export type Locale = "en" | "es";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface CTAButton {
  text: LocalizedText;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "text";
}

export interface HeroSection {
  type: "hero";
  badge?: LocalizedText;
  title: LocalizedText;
  subtitle?: LocalizedText;
  text?: LocalizedText;
  cta?: CTAButton;
  backgroundImage?: string | null;
  backgroundColor?: string;
}

export interface PainpointItem {
  text: LocalizedText;
  icon?: string;
}

export interface PainpointsSection {
  type: "painpoints";
  title: LocalizedText;
  items: PainpointItem[];
}

export interface InfoItem {
  text: LocalizedText;
  subtext?: LocalizedText;
  icon?: string;
}

export interface InfoSection {
  type: "info";
  title: LocalizedText;
  items: InfoItem[];
  image?: string | null;
  imagePosition?: "left" | "right";
}

export interface BenefitItem {
  text: LocalizedText;
}

export interface BenefitsSection {
  type: "benefits";
  title: LocalizedText;
  items: BenefitItem[];
  backgroundImage?: string;
}

export interface ExampleSection {
  type: "example";
  title: LocalizedText;
  offer?: LocalizedText;
  image?: string;
  cardWhite: {
    title: LocalizedText;
    items: LocalizedText[];
  };
  cardOrange: {
    title: LocalizedText;
    items: LocalizedText[];
  };
  yellowMessage?: LocalizedText;
}

export interface CTASection {
  type: "cta";
  title: LocalizedText;
  subtitle?: LocalizedText;
  cta: CTAButton;
  items: LocalizedText[];
}

export type LandingSection =
  | HeroSection
  | PainpointsSection
  | InfoSection
  | BenefitsSection
  | ExampleSection
  | CTASection;

export interface LandingPageData {
  slug: string;
  meta: {
    title: LocalizedText;
    description: LocalizedText;
  };
  sections: LandingSection[];
}
