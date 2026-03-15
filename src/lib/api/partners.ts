import { Partner } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const partners = {
  getAll: async (): Promise<Partner[]> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching ads:", error);
      throw new Error(error.message);
    }
    
    return data.map(item => ({
      ...item,
      logoUrl: item.logo_url,
      websiteUrl: item.website_url,
      isVerified: item.is_verified,
      startDate: item.start_date,
      endDate: item.end_date,
      createdAt: item.created_at,
      placements: item.placements || [],
    })) as Partner[];
  },

  getByPlacement: async (placement: Partner['placements'][number]): Promise<Partner[]> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .contains('placements', [placement]) // Filter for ads containing this placement
      .eq('status', 'active')
      .order('tier', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching ads by placement:", error);
      throw new Error(error.message);
    }
    
    return data.map(item => ({
      ...item,
      logoUrl: item.logo_url,
      websiteUrl: item.website_url,
      isVerified: item.is_verified,
      startDate: item.start_date,
      endDate: item.end_date,
      createdAt: item.created_at,
      placements: item.placements || [],
    })) as Partner[];
  },

  getById: async (id: string): Promise<Partner | undefined> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase error fetching ad by ID:", error);
      throw new Error(error.message);
    }
    
    if (!data) return undefined;
    
    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      placements: data.placements || [],
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
        placements: partner.placements,
        status: partner.status,
        start_date: partner.startDate,
        end_date: partner.endDate,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating ad:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      placements: data.placements || [],
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
    if (partner.placements !== undefined) updatePayload['placements'] = partner.placements;
    if (partner.status !== undefined) updatePayload['status'] = partner.status;
    if (partner.startDate !== undefined) updatePayload['start_date'] = partner.startDate;
    if (partner.endDate !== undefined) updatePayload['end_date'] = partner.endDate;

    const { data, error } = await supabase
      .from('partners')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating ad:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      isVerified: data.is_verified,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      placements: data.placements || [],
    } as Partner;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting ad:", error);
      throw new Error(error.message);
    }
  },
};