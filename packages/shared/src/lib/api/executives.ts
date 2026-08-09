import { Executive, PastExecutive } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { sortExecutivesByHierarchy } from "../hierarchy";

export const executives = {
  getAll: async (councilType?: Executive['councilType']): Promise<Executive[]> => {
    let query = supabase.from('executives')
      .select('*')
      .order('display_order', { ascending: true })
      .order('tenure_start', { ascending: false });
    
    if (councilType) {
      query = query.eq('council_type', councilType);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase error fetching executives:", error);
      throw new Error(error.message);
    }
    const formatted = data.map(item => ({
      ...item,
      tenureStart: item.tenure_start,
      tenureEnd: item.tenure_end,
      photoUrl: item.photo_url,
      projectsMd: item.projects_md,
      displayOrder: item.display_order,
      councilType: item.council_type,
    })) as Executive[];

    return sortExecutivesByHierarchy(formatted);
  },
  getBySlug: async (slug: string): Promise<Executive | undefined> => {
    // 1. Check active executives table first
    const { data, error } = await supabase.from('executives').select('*').eq('slug', slug).maybeSingle();
    if (error) {
      console.error("Supabase error fetching executive by slug:", error);
      throw new Error(error.message);
    }
    if (data) {
      return {
        ...data,
        tenureStart: data.tenure_start,
        tenureEnd: data.tenure_end,
        photoUrl: data.photo_url,
        projectsMd: data.projects_md,
        displayOrder: data.display_order,
        councilType: data.council_type,
      } as Executive;
    }

    // 2. Check past_executives table if not found in active executives
    const { data: pastData, error: pastError } = await supabase
      .from('past_executives')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (pastError) {
      console.error("Supabase error fetching past executive by slug:", pastError);
      throw new Error(pastError.message);
    }

    if (pastData) {
      return {
        id: pastData.id,
        slug: pastData.slug,
        name: pastData.name,
        role: pastData.role,
        faculty: pastData.faculty,
        tenureStart: pastData.tenure_start,
        tenureEnd: pastData.tenure_end,
        photoUrl: pastData.photo_url,
        projectsMd: pastData.projects_md,
        contacts: pastData.contacts || {},
        displayOrder: 999,
        councilType: pastData.council_type as Executive['councilType'],
        academicSession: pastData.academic_session,
        isPast: true,
      } as Executive & { academicSession?: string; isPast?: boolean };
    }

    return undefined;
  },
  create: async (executive: Omit<Executive, 'id' | 'created_at' | 'displayOrder'> & { displayOrder?: number }): Promise<Executive> => {
    const { data: maxOrderData } = await supabase
        .from('executives')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();

    const newDisplayOrder = (maxOrderData?.display_order || 0) + 1;

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
      council_type: executive.councilType,
    }).select().single();

    if (error) {
      console.error("Supabase error creating executive:", error);
      throw new Error(error.message);
    }

    return {
      ...data,
      tenureStart: data.tenure_start,
      tenureEnd: data.tenure_end,
      photoUrl: data.photo_url,
      projectsMd: data.projects_md,
      displayOrder: data.display_order,
      councilType: data.council_type,
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
    if (executive.councilType !== undefined) updatePayload['council_type'] = executive.councilType;

    const { data, error } = await supabase
      .from('executives')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase error updating executive:", error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Failed to update executive profile. The record may no longer exist or you lack update permissions.");
    }

    return {
      ...data,
      tenureStart: data.tenure_start,
      tenureEnd: data.tenure_end,
      photoUrl: data.photo_url,
      projectsMd: data.projects_md,
      displayOrder: data.display_order,
      councilType: data.council_type,
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

  // Past Executives API Methods
  getPast: async (councilType?: Executive['councilType'], academicSession?: string): Promise<PastExecutive[]> => {
    let query = supabase.from('past_executives')
      .select('*')
      .order('transitioned_at', { ascending: false });

    if (councilType) {
      query = query.eq('council_type', councilType);
    }
    if (academicSession) {
      query = query.eq('academic_session', academicSession);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase error fetching past executives:", error);
      throw new Error(error.message);
    }
    const formatted = (data || []).map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      role: item.role,
      faculty: item.faculty,
      tenureStart: item.tenure_start,
      tenureEnd: item.tenure_end,
      photoUrl: item.photo_url,
      projectsMd: item.projects_md,
      contacts: item.contacts || {},
      councilType: item.council_type as Executive['councilType'],
      academicSession: item.academic_session,
      transitionedAt: item.transitioned_at,
    })) as PastExecutive[];

    return sortExecutivesByHierarchy(formatted);
  },

  getPastSessions: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('past_executives')
      .select('academic_session');

    if (error) {
      console.error("Supabase error fetching past executive sessions:", error);
      return [];
    }

    const sessionsSet = new Set<string>();
    (data || []).forEach(row => {
      if (row.academic_session) sessionsSet.add(row.academic_session);
    });

    return Array.from(sessionsSet).sort().reverse();
  },

  initiatePowerTransition: async (params: {
    academicSession: string;
    councilType?: Executive['councilType'] | 'All';
  }): Promise<{ count: number }> => {
    const { academicSession, councilType = 'All' } = params;

    // 1. Fetch target active executives
    let query = supabase.from('executives').select('*');
    if (councilType !== 'All') {
      query = query.eq('council_type', councilType);
    }

    const { data: targetExecs, error: fetchError } = await query;
    if (fetchError) {
      console.error("Error fetching active executives for transition:", fetchError);
      throw new Error(fetchError.message);
    }

    if (!targetExecs || targetExecs.length === 0) {
      return { count: 0 };
    }

    // 2. Prepare past executives payload
    const pastRecordsPayload = targetExecs.map(exec => ({
      slug: exec.slug,
      name: exec.name,
      role: exec.role,
      faculty: exec.faculty,
      tenure_start: exec.tenure_start,
      tenure_end: exec.tenure_end,
      photo_url: exec.photo_url,
      projects_md: exec.projects_md,
      contacts: exec.contacts || {},
      council_type: exec.council_type,
      academic_session: academicSession,
    }));

    // 3. Insert into past_executives
    const { error: insertError } = await supabase
      .from('past_executives')
      .insert(pastRecordsPayload);

    if (insertError) {
      console.error("Error inserting into past_executives:", insertError);
      throw new Error(insertError.message);
    }

    // 4. Delete transferred records from executives table
    const idsToDelete = targetExecs.map(exec => exec.id);
    const { error: deleteError } = await supabase
      .from('executives')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      console.error("Error clearing transitioned executives from active table:", deleteError);
      throw new Error(deleteError.message);
    }

    return { count: targetExecs.length };
  },

  deletePast: async (id: string): Promise<void> => {
    const { error } = await supabase.from('past_executives').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting past executive record:", error);
      throw new Error(error.message);
    }
  },

  restorePastToActive: async (id: string): Promise<Executive> => {
    // Fetch past executive record
    const { data: pastExec, error: fetchError } = await supabase
      .from('past_executives')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !pastExec) {
      throw new Error("Past executive record not found.");
    }

    // Create in active executives table
    const activeExec = await executives.create({
      name: pastExec.name,
      slug: pastExec.slug,
      role: pastExec.role,
      faculty: pastExec.faculty,
      tenureStart: pastExec.tenure_start,
      tenureEnd: pastExec.tenure_end,
      photoUrl: pastExec.photo_url,
      projectsMd: pastExec.projects_md,
      contacts: pastExec.contacts || {},
      councilType: pastExec.council_type as Executive['councilType'],
    });

    // Remove from past executives
    await executives.deletePast(id);

    return activeExec;
  },
};