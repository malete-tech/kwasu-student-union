import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const events = {
  getAll: async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select('*').order('starts_at', { ascending: true });
    if (error) {
      console.error("Supabase error fetching events:", error);
      throw new Error(error.message);
    }
    return data.map(item => ({
      ...item,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      descriptionMd: item.description_md,
      rsvpOpen: item.rsvp_open,
      rsvpLink: item.rsvp_link,
      agendaMd: item.agenda_md,
    })) as Event[];
  },
  getUpcoming: async (count: number): Promise<Event[]> => {
    const { data, error } = await supabase.from('events')
      .select('*')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(count);
    if (error) {
      console.error("Supabase error fetching upcoming events:", error);
      throw new Error(error.message);
    }
    return data.map(item => ({
      ...item,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      descriptionMd: item.description_md,
      rsvpOpen: item.rsvp_open,
      rsvpLink: item.rsvp_link,
      agendaMd: item.agenda_md,
    })) as Event[];
  },
  getBySlug: async (slug: string): Promise<Event | undefined> => {
    const { data, error } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle();
    if (error) {
      console.error("Supabase error fetching event by slug:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return {
      ...data,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
      descriptionMd: data.description_md,
      rsvpOpen: data.rsvp_open,
      rsvpLink: data.rsvp_link,
      agendaMd: data.agenda_md,
    } as Event;
  },
  create: async (event: Omit<Event, 'id' | 'created_at'>): Promise<Event> => {
    const { data, error } = await supabase.from('events').insert({
      title: event.title,
      slug: event.slug,
      starts_at: event.startsAt,
      ends_at: event.endsAt,
      venue: event.venue,
      description_md: event.descriptionMd,
      category: event.category,
      rsvp_open: event.rsvpOpen,
      rsvp_link: event.rsvpLink,
      agenda_md: event.agendaMd,
    }).select();

    if (error) {
      console.error("Supabase error creating event:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Failed to create event. You might not have the required permissions.");
    }

    const item = data[0];
    return {
      ...item,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      descriptionMd: item.description_md,
      rsvpOpen: item.rsvp_open,
      rsvpLink: item.rsvp_link,
      agendaMd: item.agenda_md,
    } as Event;
  },
  update: async (id: string, event: Partial<Omit<Event, 'id' | 'created_at'>>): Promise<Event> => {
    const updatePayload: Record<string, any> = {};
    if (event.title !== undefined) updatePayload['title'] = event.title;
    if (event.slug !== undefined) updatePayload['slug'] = event.slug;
    if (event.startsAt !== undefined) updatePayload['starts_at'] = event.startsAt;
    if (event.endsAt !== undefined) updatePayload['ends_at'] = event.endsAt;
    if (event.venue !== undefined) updatePayload['venue'] = event.venue;
    if (event.descriptionMd !== undefined) updatePayload['description_md'] = event.descriptionMd;
    if (event.category !== undefined) updatePayload['category'] = event.category;
    if (event.rsvpOpen !== undefined) updatePayload['rsvp_open'] = event.rsvpOpen;
    if (event.rsvpLink !== undefined) updatePayload['rsvp_link'] = event.rsvpLink;
    if (event.agendaMd !== undefined) updatePayload['agenda_md'] = event.agendaMd;

    const { data, error } = await supabase.from('events').update(updatePayload).eq('id', id).select();

    if (error) {
      console.error("Supabase error updating event:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Failed to update event. The event might not exist, or you lack the required 'admin' role permissions.");
    }

    const item = data[0];
    return {
      ...item,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      descriptionMd: item.description_md,
      rsvpOpen: item.rsvp_open,
      rsvpLink: item.rsvp_link,
      agendaMd: item.agenda_md,
    } as Event;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting event:", error);
      throw new Error(error.message);
    }
  },
};