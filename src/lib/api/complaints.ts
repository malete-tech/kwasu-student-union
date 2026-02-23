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
    }).select(); // Removed .single() to handle potential empty returns from RLS

    if (error) {
      console.error("Supabase error submitting complaint:", error);
      throw new Error(error.message);
    }

    // If RLS prevents us from seeing the row we just created, we return a partial object
    // so the UI doesn't crash, though the ID might be missing.
    if (!data || data.length === 0) {
      return {
        id: 'pending',
        ...complaint,
        status: 'Queued',
        createdAt: new Date().toISOString(),
        timeline: []
      } as Complaint;
    }

    return mapComplaintFromDb(data[0]);
  },
  getAll: async (): Promise<Complaint[]> => {
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
    const { error: updateError } = await supabase.from('complaints')
      .update({ status: newStatus })
      .eq('id', complaintId);

    if (updateError) {
      console.error("Supabase error updating complaint status:", updateError);
      throw new Error(updateError.message);
    }

    const { error: timelineError } = await supabase.from('complaint_timeline')
      .insert({
        complaint_id: complaintId,
        status: newStatus,
        note: note,
      });

    if (timelineError) {
      console.error("Supabase error inserting timeline entry:", timelineError);
    }

    const updatedComplaint = await complaints.getById(complaintId);
    if (!updatedComplaint) throw new Error("Failed to retrieve updated complaint.");

    return updatedComplaint;
  },
};