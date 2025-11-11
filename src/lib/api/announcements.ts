import { supabase } from "@/integrations/supabase/client";

interface GlobalAnnouncement {
  id: string;
  title: string;
  messageMd: string;
  type: 'urgent' | 'celebration' | 'info';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper to map DB snake_case to frontend camelCase
const mapAnnouncementFromDb = (item: any): GlobalAnnouncement => ({
  id: item.id,
  title: item.title,
  messageMd: item.message_md,
  type: item.type,
  isActive: item.is_active,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export const announcements = {
  // Public function: gets the single active announcement
  getActive: async (): Promise<GlobalAnnouncement | undefined> => {
    // We assume there is only one active announcement at a time, or we take the latest one.
    // RLS ensures only active ones are returned to the public.
    const { data, error } = await supabase.from('global_announcements')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching active announcement:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return mapAnnouncementFromDb(data);
  },

  // Admin function: gets all announcements (for management)
  getAll: async (): Promise<GlobalAnnouncement[]> => {
    const { data, error } = await supabase.from('global_announcements')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching all announcements:", error);
      throw new Error(error.message);
    }
    return data.map(mapAnnouncementFromDb);
  },

  // Admin function: creates a new announcement
  create: async (announcement: Omit<GlobalAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): Promise<GlobalAnnouncement> => {
    const { data, error } = await supabase.from('global_announcements').insert({
      title: announcement.title,
      message_md: announcement.messageMd,
      type: announcement.type,
      is_active: announcement.isActive,
    }).select().single();

    if (error) {
      console.error("Supabase error creating announcement:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return mapAnnouncementFromDb(data);
  },

  // Admin function: updates an existing announcement
  update: async (id: string, announcement: Partial<Omit<GlobalAnnouncement, 'id' | 'createdAt'>>): Promise<GlobalAnnouncement> => {
    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (announcement.title !== undefined) updatePayload['title'] = announcement.title;
    if (announcement.messageMd !== undefined) updatePayload['message_md'] = announcement.messageMd;
    if (announcement.type !== undefined) updatePayload['type'] = announcement.type;
    if (announcement.isActive !== undefined) updatePayload['is_active'] = announcement.isActive;

    const { data, error } = await supabase.from('global_announcements')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating announcement:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return mapAnnouncementFromDb(data);
  },
  
  // Admin function: deletes an announcement
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('global_announcements').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting announcement:", error);
      throw new Error(error.message);
    }
  },
};