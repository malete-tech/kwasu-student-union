import { Executive } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const executives = {
  getAll: async (councilType?: Executive['councilType']): Promise<Executive[]> => {
    let query = supabase.from('executives')
      .select('*')
      .order('display_order', { ascending: true }) // Primary sort by manual order
      .order('tenure_start', { ascending: false }); // Secondary sort by tenure start
    
    if (councilType) {
      query = query.eq('council_type', councilType);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase error fetching executives:", error);
      throw new Error(error.message);
    }
    // Convert snake_case from DB to camelCase for frontend type
    return data.map(item => ({
      ...item,
      tenureStart: item.tenure_start,
      tenureEnd: item.tenure_end,
      photoUrl: item.photo_url,
      projectsMd: item.projects_md,
      displayOrder: item.display_order,
      councilType: item.council_type, // Include new field
    })) as Executive[];
  },
  getBySlug: async (slug: string): Promise<Executive | undefined> => {
    const { data, error } = await supabase.from('executives').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Supabase error fetching executive by slug:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    // Convert snake_case from DB to camelCase for frontend type
    return {
      ...data,
      tenureStart: data.tenure_start,
      tenureEnd: data.tenure_end,
      photoUrl: data.photo_url,
      projectsMd: data.projects_md,
      displayOrder: data.display_order,
      councilType: data.council_type, // Include new field
    } as Executive;
  },
  create: async (executive: Omit<Executive, 'id' | 'created_at' | 'displayOrder'> & { displayOrder?: number }): Promise<Executive> => {
    // Calculate the next highest display order
    const { data: maxOrderData } = await supabase
        .from('executives')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single();

    const newDisplayOrder = (maxOrderData?.display_order || 0) + 1;

    // Explicitly construct payload with snake_case keys for Supabase insert
    const { data, error } = await supabase.from('executives').insert({
      name: executive.name,
      slug: executive.slug,
      role: executive.role,
      faculty: executive.faculty,
      tenure_start: executive.tenureStart,
      tenure_end: executive.tenureEnd,
      photo_url: executive.photoUrl,
      projects_md: executive.projectsMd,
      contacts: executive.contacts,
      display_order: newDisplayOrder,
      council_type: executive.councilType, // Include new field
    }).select().single();
    if (error) {
      console.error("Supabase error creating executive:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    // Convert returned snake_case data back to camelCase for frontend type
    return {
      ...data,
      tenureStart: data.tenure_start,
      tenureEnd: data.tenure_end,
      photoUrl: data.photo_url,
      projectsMd: data.projects_md,
      displayOrder: data.display_order,
      councilType: data.council_type, // Include new field
    } as Executive;
  },
  update: async (id: string, executive: Partial<Omit<Executive, 'id' | 'created_at'>>): Promise<Executive> => {
    const updatePayload: Record<string, any> = {};
    if (executive.name !== undefined) updatePayload['name'] = executive.name;
    if (executive.slug !== undefined) updatePayload['slug'] = executive.slug;
    if (executive.role !== undefined) updatePayload['role'] = executive.role;
    if (executive.faculty !== undefined) updatePayload['faculty'] = executive.faculty;
    if (executive.tenureStart !== undefined) updatePayload['tenure_start'] = executive.tenureStart;
    if (executive.tenureEnd !== undefined) updatePayload['tenure_end'] = executive.tenureEnd;
    if (executive.photoUrl !== undefined) updatePayload['photo_url'] = executive.photoUrl;
    if (executive.projectsMd !== undefined) updatePayload['projects_md'] = executive.projectsMd;
    if (executive.contacts !== undefined) updatePayload['contacts'] = executive.contacts;
    if (executive.councilType !== undefined) updatePayload['council_type'] = executive.councilType; // Include new field

    const { data, error } = await supabase.from('executives').update(updatePayload).eq('id', id).select().single();
    if (error) {
      console.error("Supabase error updating executive:", error);
      throw new Error(error.message);
      // @ts-ignore
    }
    // Convert returned snake_case data back to camelCase for frontend type
    return {
      ...data,
      tenureStart: data.tenure_start,
      tenureEnd: data.tenure_end,
      photoUrl: data.photo_url,
      projectsMd: data.projects_md,
      displayOrder: data.display_order,
      councilType: data.council_type, // Include new field
    } as Executive;
  },
  reorder: async (id: string, newOrder: number): Promise<void> => {
    const { error } = await supabase.from('executives')
      .update({ display_order: newOrder })
      .eq('id', id);
    
    if (error) {
      console.error("Supabase error reordering executive:", error);
      throw new Error(error.message);
    }
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('executives').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting executive:", error);
      throw new Error(error.message);
    }
  },
};