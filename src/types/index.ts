// Executive
export interface Executive {
  id: string;
  slug: string;
  name: string;
  role: string;
  faculty: string;
  tenureStart: string; // YYYY-MM-DD
  tenureEnd: string; // YYYY-MM-DD
  photoUrl?: string;
  bioMd: string;
  manifestoMd: string;
  projectsMd?: string; // Optional projects section
  contacts: {
    email?: string;
    twitter?: string;
    instagram?: string;
    phone?: string;
  };
}

// News
export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  tags: string[]; // e.g., 'academic', 'welfare', 'events', 'opportunities'
  publishedAt: string; // ISO 8601 string
  coverUrl?: string;
}

// Event
export interface Event {
  id: string;
  slug: string;
  title: string;
  startsAt: string; // ISO 8601 string
  endsAt?: string; // ISO 8601 string
  venue: string;
  descriptionMd: string;
  category: string; // e.g., 'Academic', 'Social', 'Sports'
  rsvpOpen: boolean;
  agendaMd?: string; // Optional agenda section
}

// Complaint
export type ComplaintCategory = 'Welfare' | 'Academics' | 'Fees' | 'Security' | 'Other';
export type ComplaintStatus = 'Queued' | 'In Review' | 'Resolved';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string; // ISO 8601 string
  status: ComplaintStatus;
  timeline: { status: ComplaintStatus; timestamp: string; note?: string }[];
}

// Document (Downloads)
export interface Document {
  id: string;
  title: string;
  url: string; // Link to the document
  tags: string[]; // e.g., 'policy', 'form', 'handbook'
  updatedAt: string; // ISO 8601 string
  fileType: string; // e.g., 'PDF', 'DOCX'
  fileSize: string; // e.g., '2.5 MB'
}

// Opportunity
export interface Opportunity {
  id: string;
  title: string;
  deadline: string; // ISO 8601 string
  link: string; // External link to the opportunity
  sponsor?: string;
  tags: string[]; // e.g., 'scholarship', 'internship', 'job'
  descriptionMd: string;
}

// Student Spotlight (for homepage)
export interface StudentSpotlight {
  id: string;
  name: string;
  achievement: string;
  descriptionMd: string;
  photoUrl?: string;
  link?: string; // Optional link to a full story or profile
}

// Profile
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  updated_at?: string;
}