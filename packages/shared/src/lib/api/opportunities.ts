import { Opportunity } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const opportunities = {
  getAll: async (): Promise<Opportunity[]> => {
    const { data, error } = await supabase.from('opportunities').select('*').order('deadline', { ascending: true });
    if (error) {
      console.error("Supabase error fetching opportunities:", error);
      throw new Error(error.message);
    }
    return data.map(item => ({
      ...item,
      descriptionMd: item.description_md,
    })) as Opportunity[];
  },
  getById: async (id: string): Promise<Opportunity | undefined> => {
    const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching opportunity by ID:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return {
      ...data,
      descriptionMd: data.description_md,
    } as Opportunity;
  },
  create: async (opportunity: Omit<Opportunity, 'id' | 'created_at'>): Promise<Opportunity> => {
    const { data, error } = await supabase.from('opportunities').insert({
      title: opportunity.title,
      deadline: opportunity.deadline,
      link: opportunity.link,
      sponsor: opportunity.sponsor,
      tags: opportunity.tags,
      description_md: opportunity.descriptionMd,
    }).select().single();
    if (error) {
      console.error("Supabase error creating opportunity:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return {
      ...data,
      descriptionMd: data.description_md,
    } as Opportunity;
  },
  update: async (id: string, opportunity: Partial<Omit<Opportunity, 'id' | 'created_at'>>): Promise<Opportunity> => {
    const updatePayload: Record<string, any> = {};
    if (opportunity.title !== undefined) updatePayload['title'] = opportunity.title;
    if (opportunity.deadline !== undefined) updatePayload['deadline'] = opportunity.deadline;
    if (opportunity.link !== undefined) updatePayload['link'] = opportunity.link;
    if (opportunity.sponsor !== undefined) updatePayload['sponsor'] = opportunity.sponsor;
    if (opportunity.tags !== undefined) updatePayload['tags'] = opportunity.tags;
    if (opportunity.descriptionMd !== undefined) updatePayload['description_md'] = opportunity.descriptionMd;

    const { data, error } = await supabase.from('opportunities').update(updatePayload).eq('id', id).select().single();
    if (error) {
      console.error("Supabase error updating opportunity:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    return {
      ...data,
      descriptionMd: data.description_md,
    } as Opportunity;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting opportunity:", error);
      throw new Error(error.message);
    }
  },
};