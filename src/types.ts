export interface Business {
  id: string;
  name: string;
  category: string;
  owner: string;
  description: string;
  email: string;
  phone: string;
  isTextEnabled: boolean;
  isABCClubMember?: boolean;
  website: string;
  logo?: string;
  timestamp: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  image: string;
  order?: number;
}

export interface AppEvent {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  host: string;
  hostEmail: string;
  hostPhone: string;
  startTime: string;
  endTime: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  businessName: string;
  category: string;
  description: string;
  phone: string;
  isTextEnabled: boolean;
  website: string;
  logo?: string;
  includeInDirectory: boolean;
  joinClub: boolean;
}

export interface MembershipApplication extends ContactFormData {
  id?: string;
  timestamp: string;
}

export interface CommunityFeature {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  announcement: string;
  aboutTitle: string;
  aboutContent: string;
  communityTitle: string;
  communityContent: string;
  eventsTitle: string;
  eventsContent: string;
  clubTitle: string;
  clubContent: string;
  clubImage?: string;
  communityFeatures?: CommunityFeature[];
  footerContent: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  updatedAt: string;
}
