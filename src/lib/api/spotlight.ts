import { StudentSpotlight } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const studentSpotlight = {
  getAll: async (): Promise<StudentSpotlight[]> => {
    const { data, error } = await supabase.from('student_spotlight').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Supabase error fetching student spotlight:", error);
      throw new Error(error.message);
    }
    return data.map(item => ({
      ...item,
      descriptionMd: item.description_md,
      photoUrl: item.photo_url,
    })) as StudentSpotlight[];
  },
  getById: async (id: string): Promise<StudentSpotlight | undefined> => {
    const { data, error } = await supabase.from('student_spotlight').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching student spotlight by ID:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return {
      ...data,
      descriptionMd: data.description_md,
      photoUrl: data.photo_url,
    } as StudentSpotlight;
  },
  create: async (spotlight: Omit<StudentSpotlight, 'id' | 'created_at'>): Promise<StudentSpotlight> => {
    const { data, error } = await supabase.from('student_spotlight').insert({
      name: spotlight.name,
      achievement: spotlight.achievement,
      description_md: spotlight.descriptionMd,
      photo_url: spotlight.photoUrl,
      link: spotlight.link,
    }).select().single();
    if (error) {
      console.error("Supabase error creating student spotlight:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return {
      ...data,
      descriptionMd: data.description_md,
      photoUrl: data.photo_url,
    } as StudentSpotlight;
  },
  update: async (id: string, spotlight: Partial<Omit<StudentSpotlight, 'id' | 'created_at'>>): Promise<StudentSpotlight> => {
    const updatePayload: Record<string, any> = {};
    if (spotlight.name !== undefined) updatePayload['name'] = spotlight.name;
    if (spotlight.achievement !== undefined) updatePayload['achievement'] = spotlight.achievement;
    if (spotlight.descriptionMd !== undefined) updatePayload['description_md'] = spotlight.descriptionMd;
    if (spotlight.photoUrl !== undefined) updatePayload['photo_url'] = spotlight.photoUrl;
    if (spotlight.link !== undefined) updatePayload['link'] = spotlight.link;

    const { data, error } = await supabase.from('student_spotlight').update(updatePayload).eq('id', id).select().single();
    if (error) {
      console.error("Supabase error updating student spotlight:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return {
      ...data,
      descriptionMd: data.description_md,
      photoUrl: data.photo_url,
    } as StudentSpotlight;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('student_spotlight').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting student spotlight:", error);
      throw new Error(error.message);
    }
  },
};