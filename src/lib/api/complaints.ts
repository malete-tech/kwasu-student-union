import { Complaint, ComplaintStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { mapComplaintFromDb } from "./helpers";

export const complaints = {
  submit: async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'timeline' | 'userId'> & { userId?: string | null }): Promise<Complaint> => {
    const { data, error } = await supabase.from('complaints').insert({
      user_id: complaint.userId,
      category: complaint.category,
      title: complaint.title,
      description: complaint.description,
      contact_email: complaint.contactEmail,
      contact_phone: complaint.contactPhone,
      is_anonymous: complaint.isAnonymous,
    }).select().single();

    if (error) {
      console.error("Supabase error submitting complaint:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return mapComplaintFromDb(data);
  },
  getAll: async (): Promise<Complaint[]> => {
    // Admin function: fetch all complaints and their timelines
    const { data, error } = await supabase.from('complaints')
      .select(`
        *,
        complaint_timeline (
          id,
          status,
          note,
          timestamp
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching all complaints:", error);
      throw new Error(error.message);
    }
    return data.map(mapComplaintFromDb);
  },
  getById: async (id: string): Promise<Complaint | undefined> => {
    // User/Admin function: fetch a single complaint with its timeline
    const { data, error } = await supabase.from('complaints')
      .select(`
        *,
        complaint_timeline (
          id,
          status,
          note,
          timestamp
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching complaint by ID:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return mapComplaintFromDb(data);
  },
  updateStatus: async (complaintId: string, newStatus: ComplaintStatus, note?: string): Promise<Complaint> => {
    // 1. Update the status in the complaints table
    const { data: _complaintData, error: updateError } = await supabase.from('complaints')
      .update({ status: newStatus })
      .eq('id', complaintId)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase error updating complaint status:", updateError);
      throw new Error(updateError.message);
    }

    // 2. Insert a new entry into the timeline table
    const { error: timelineError } = await supabase.from('complaint_timeline')
      .insert({
        complaint_id: complaintId,
        status: newStatus,
        note: note,
      });

    if (timelineError) {
      console.error("Supabase error inserting timeline entry:", timelineError);
      // Note: We proceed even if timeline fails, as status update succeeded.
    }

    // 3. Fetch the full updated complaint with timeline (optional, but good for consistency)
    const updatedComplaint = await complaints.getById(complaintId);
    if (!updatedComplaint) throw new Error("Failed to retrieve updated complaint.");

    return updatedComplaint;
  },
};