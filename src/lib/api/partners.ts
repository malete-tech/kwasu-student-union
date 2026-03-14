import { Partner } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const partners = {
  getAll: async (): Promise<Partner[]> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('tier', { ascending: false }) // Premium first
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Supabase error fetching partners:", error);
      throw new Error(error.message);
    }
    
    return data.map(item => ({
      ...item,
      logoUrl: item.logo_url,
      websiteUrl: item.website_url,
      isVerified: item.is_verified,
      createdAt: item.created_at,
    })) as Partner[];
  },

  getById: async (id: string): Promise<Partner | undefined> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase error fetching partner by ID:", error);
      throw new Error(error.message);
    }
    
    if (!data) return undefined;
    
    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      createdAt: data.created_at,
    } as Partner;
  },

  create: async (partner: Omit<Partner, 'id' | 'createdAt'>): Promise<Partner> => {
    const { data, error } = await supabase
      .from('partners')
      .insert({
        name: partner.name,
        logo_url: partner.logoUrl,
        description: partner.description,
        website_url: partner.websiteUrl,
        category: partner.category,
        is_verified: partner.isVerified,
        tier: partner.tier,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating partner:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      createdAt: data.created_at,
    } as Partner;
  },

  update: async (id: string, partner: Partial<Omit<Partner, 'id' | 'createdAt'>>): Promise<Partner> => {
    const updatePayload: Record<string, any> = {};
    if (partner.name !== undefined) updatePayload['name'] = partner.name;
    if (partner.logoUrl !== undefined) updatePayload['logo_url'] = partner.logoUrl;
    if (partner.description !== undefined) updatePayload['description'] = partner.description;
    if (partner.websiteUrl !== undefined) updatePayload['website_url'] = partner.websiteUrl;
    if (partner.category !== undefined) updatePayload['category'] = partner.category;
    if (partner.isVerified !== undefined) updatePayload['is_verified'] = partner.isVerified;
    if (partner.tier !== undefined) updatePayload['tier'] = partner.tier;

    const { data, error } = await supabase
      .from('partners')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating partner:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      createdAt: data.created_at,
    } as Partner;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting partner:", error);
      throw new Error(error.message);
    }
  },
};