import { Complaint, ComplaintTimelineEntry } from "@/types";

// Helper function to convert DB snake_case to frontend camelCase for complaints
export const mapComplaintFromDb = (item: any): Complaint => ({
  id: item.id,
  category: item.category,
  title: item.title,
  description: item.description,
  contactEmail: item.contact_email,
  contactPhone: item.contact_phone,
  isAnonymous: item.is_anonymous,
  status: item.status,
  createdAt: item.created_at,
  userId: item.user_id, // Include user_id for admin view
  timeline: item.complaint_timeline ? item.complaint_timeline.map(mapTimelineFromDb) : [],
});

// Helper function to convert DB snake_case to frontend camelCase for timeline
export const mapTimelineFromDb = (item: any): ComplaintTimelineEntry => ({
  id: item.id,
  complaintId: item.complaint_id,
  status: item.status,
  note: item.note,
  timestamp: item.timestamp,
});