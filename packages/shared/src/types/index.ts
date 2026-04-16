// Executive
export interface Executive {
  id: string;
  slug: string;
  name: string;
  role: string;
  faculty?: string;
  tenureStart: string;
  tenureEnd: string;
  photoUrl?: string;
  projectsMd?: string;
  contacts: {
    email?: string;
    twitter?: string;
    instagram?: string;
    phone?: string;
    linkedin?: string; // Social link
  };
  displayOrder: number;
  councilType: 'Central' | 'Senate' | 'Judiciary';
}

// News
export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  tags: string[];
  publishedAt: string;
  coverUrl?: string;
}

// Event
export interface Event {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  venue: string;
  descriptionMd: string;
  category: string;
  rsvpOpen: boolean;
  rsvpLink?: string;
  agendaMd?: string;
}

// Complaint
export type ComplaintCategory = 'Welfare' | 'Academics' | 'Fees' | 'Security' | 'Inquiry' | 'Suggestion' | 'Other';
export type ComplaintStatus = 'Queued' | 'In Review' | 'Resolved' | 'Closed';

export interface ComplaintTimelineEntry {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  note?: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  userId?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  contactEmail?: string;
  contactPhone?: string;
  isAnonymous: boolean;
  createdAt: string;
  status: ComplaintStatus;
  timeline: ComplaintTimelineEntry[];
}

// Document (Downloads)
export interface Document {
  id: string;
  title: string;
  url: string;
  tags: string[];
  updatedAt: string;
  fileType: string;
  fileSize: string;
}

// Opportunity
export interface Opportunity {
  id: string;
  title: string;
  deadline: string;
  link: string;
  sponsor?: string;
  tags: string[];
  descriptionMd: string;
}

// Student Spotlight
export interface Spotlight {
  id: string;
  name: string;
  achievement: string;
  descriptionMd: string;
  photoUrl?: string;
  link?: string;
}

// Ad / Partner (Refactored for Ad Management)
export type AdPlacement = 'news_feed' | 'events_feed' | 'opportunities_feed';
export type AdStatus = 'active' | 'paused' | 'expired';

export interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  websiteUrl?: string;
  category: string;
  isVerified: boolean;
  tier: 'basic' | 'premium';
  placements: AdPlacement[];
  status: AdStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

// Profile
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  updated_at?: string;
  role?: string;
}