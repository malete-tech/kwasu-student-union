import {
  Executive,
  News,
  Event,
  Document,
  Opportunity,
  StudentSpotlight,
  Complaint,
} from "@/types";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

const SIMULATED_DELAY = 500; // milliseconds

const simulateAsync = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, SIMULATED_DELAY);
  });
};

export const api = {
  news: {
    getAll: async (): Promise<News[]> => {
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      if (error) {
        console.error("Supabase error fetching news:", error);
        throw new Error(error.message);
      }
      // Convert snake_case from DB to camelCase for frontend type
      return data.map(item => ({
        ...item,
        bodyMd: item.body_md,
        publishedAt: item.published_at,
        // coverUrl: item.cover_url, // Removed
      })) as News[];
    },
    getLatest: async (count: number): Promise<News[]> => {
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false }).limit(count);
      if (error) {
        console.error("Supabase error fetching latest news:", error);
        throw new Error(error.message);
      }
      // Convert snake_case from DB to camelCase for frontend type
      return data.map(item => ({
        ...item,
        bodyMd: item.body_md,
        publishedAt: item.published_at,
        // coverUrl: item.cover_url, // Removed
      })) as News[];
    },
    getBySlug: async (slug: string): Promise<News | undefined> => {
      const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Supabase error fetching news by slug:", error);
        throw new Error(error.message);
      }
      if (!data) return undefined;
      // Convert snake_case from DB to camelCase for frontend type
      return {
        ...data,
        bodyMd: data.body_md,
        publishedAt: data.published_at,
        // coverUrl: data.cover_url, // Removed
      } as News;
    },
    create: async (news: Omit<News, 'id' | 'created_at'>): Promise<News> => {
      // Explicitly construct payload with snake_case keys for Supabase insert
      const { data, error } = await supabase.from('news').insert({
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        body_md: news.bodyMd, // Map frontend bodyMd to database body_md
        tags: news.tags,
        published_at: news.publishedAt, // Map frontend publishedAt to database published_at
        // cover_url: news.coverUrl, // Removed
      }).select().single();
      if (error) {
        console.error("Supabase error creating news:", error);
        throw new Error(error.message);
      }
      // Convert returned snake_case data back to camelCase for frontend type
      return {
        ...data,
        bodyMd: data.body_md,
        publishedAt: data.published_at,
        // coverUrl: data.cover_url, // Removed
      } as News;
    },
    update: async (id: string, news: Partial<Omit<News, 'id' | 'created_at'>>): Promise<News> => {
      // Explicitly construct payload with snake_case keys for Supabase update
      const updatePayload: Record<string, any> = {};
      if (news.title !== undefined) updatePayload['title'] = news.title;
      if (news.slug !== undefined) updatePayload['slug'] = news.slug;
      if (news.excerpt !== undefined) updatePayload['excerpt'] = news.excerpt;
      if (news.bodyMd !== undefined) updatePayload['body_md'] = news.bodyMd;
      if (news.tags !== undefined) updatePayload['tags'] = news.tags;
      if (news.publishedAt !== undefined) updatePayload['published_at'] = news.publishedAt;
      // if (news.coverUrl !== undefined) updatePayload['cover_url'] = news.coverUrl; // Removed

      const { data, error } = await supabase.from('news').update(updatePayload).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating news:", error);
        throw new Error(error.message);
      }
      // Convert returned snake_case data back to camelCase for frontend type
      return {
        ...data,
        bodyMd: data.body_md,
        publishedAt: data.published_at,
        // coverUrl: data.cover_url, // Removed
      } as News;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) {
        console.error("Supabase error deleting news:", error);
        throw new Error(error.message);
      }
    },
  },
  executives: {
    getAll: async (): Promise<Executive[]> => {
      const { data, error } = await supabase.from('executives').select('*').order('tenure_start', { ascending: false });
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
        // bioMd: item.bio_md, // Removed
        // manifestoMd: item.manifesto_md, // Removed
        projectsMd: item.projects_md,
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
        // bioMd: data.bio_md, // Removed
        // manifestoMd: data.manifesto_md, // Removed
        projectsMd: data.projects_md,
      } as Executive;
    },
    create: async (executive: Omit<Executive, 'id' | 'created_at'>): Promise<Executive> => {
      // Explicitly construct payload with snake_case keys for Supabase insert
      const { data, error } = await supabase.from('executives').insert({
        name: executive.name,
        slug: executive.slug,
        role: executive.role,
        faculty: executive.faculty,
        tenure_start: executive.tenureStart,
        tenure_end: executive.tenureEnd,
        photo_url: executive.photoUrl,
        // bio_md: executive.bioMd, // Removed
        // manifesto_md: executive.manifestoMd, // Removed
        projects_md: executive.projectsMd,
        contacts: executive.contacts,
      }).select().single();
      if (error) {
        console.error("Supabase error creating executive:", error);
        throw new Error(error.message);
      }
      // Convert returned snake_case data back to camelCase for frontend type
      return {
        ...data,
        tenureStart: data.tenure_start,
        tenureEnd: data.tenure_end,
        photoUrl: data.photo_url,
        // bioMd: data.bio_md, // Removed
        // manifestoMd: data.manifesto_md, // Removed
        projectsMd: data.projects_md,
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
      // if (executive.bioMd !== undefined) updatePayload['bio_md'] = executive.bioMd; // Removed
      // if (executive.manifestoMd !== undefined) updatePayload['manifesto_md'] = executive.manifestoMd; // Removed
      if (executive.projectsMd !== undefined) updatePayload['projects_md'] = executive.projectsMd;
      if (executive.contacts !== undefined) updatePayload['contacts'] = executive.contacts;

      const { data, error } = await supabase.from('executives').update(updatePayload).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating executive:", error);
        throw new Error(error.message);
      }
      // Convert returned snake_case data back to camelCase for frontend type
      return {
        ...data,
        tenureStart: data.tenure_start,
        tenureEnd: data.tenure_end,
        photoUrl: data.photo_url,
        // bioMd: data.bio_md, // Removed
        // manifestoMd: data.manifesto_md, // Removed
        projectsMd: data.projects_md,
      } as Executive;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('executives').delete().eq('id', id);
      if (error) {
        console.error("Supabase error deleting executive:", error);
        throw new Error(error.message);
      }
    },
  },
  events: {
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
        rsvpLink: item.rsvp_link, // New: Map rsvp_link
        agendaMd: item.agenda_md,
      })) as Event[];
    },
    getUpcoming: async (count: number): Promise<Event[]> => {
      const { data, error } = await supabase.from('events')
        .select('*')
        .gte('starts_at', new Date().toISOString()) // Only future events
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
        rsvpLink: item.rsvp_link, // New: Map rsvp_link
        agendaMd: item.agenda_md,
      })) as Event[];
    },
    getBySlug: async (slug: string): Promise<Event | undefined> => {
      const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') {
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
        rsvpLink: data.rsvp_link, // New: Map rsvp_link
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
        rsvp_link: event.rsvpLink, // New: Add rsvp_link
        agenda_md: event.agendaMd,
      }).select().single();
      if (error) {
        console.error("Supabase error creating event:", error);
        throw new Error(error.message);
      }
      return {
        ...data,
        startsAt: data.starts_at,
        endsAt: data.ends_at,
        descriptionMd: data.description_md,
        rsvpOpen: data.rsvp_open,
        rsvpLink: data.rsvp_link, // New: Map rsvp_link
        agendaMd: data.agenda_md,
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
      if (event.rsvpLink !== undefined) updatePayload['rsvp_link'] = event.rsvpLink; // New: Add rsvp_link
      if (event.agendaMd !== undefined) updatePayload['agenda_md'] = event.agendaMd;

      const { data, error } = await supabase.from('events').update(updatePayload).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating event:", error);
        throw new Error(error.message);
      }
      return {
        ...data,
        startsAt: data.starts_at,
        endsAt: data.ends_at,
        descriptionMd: data.description_md,
        rsvpOpen: data.rsvp_open,
        rsvpLink: data.rsvp_link, // New: Map rsvp_link
        agendaMd: data.agenda_md,
      } as Event;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) {
        console.error("Supabase error deleting event:", error);
        throw new Error(error.message);
      }
    },
  },
  documents: {
    getAll: async (): Promise<Document[]> => {
      const { data, error } = await supabase.from('documents').select('*').order('updated_at', { ascending: false });
      if (error) {
        console.error("Supabase error fetching documents:", error);
        throw new Error(error.message);
      }
      return data.map(item => ({
        ...item,
        updatedAt: item.updated_at,
        fileType: item.file_type,
        fileSize: item.file_size,
      })) as Document[];
    },
  },
  opportunities: {
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
  },
  studentSpotlight: {
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
  },
  complaints: {
    // This will be handled by localStorage, not static JSON
    submit: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'timeline'>): Promise<Complaint> => {
      return simulateAsync({
        id: `C-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'Queued',
        timeline: [{ status: 'Queued', timestamp: new Date().toISOString(), note: 'Complaint received.' }],
        ...complaint,
      } as Complaint);
    },
    getById: (_id: string): Promise<Complaint | undefined> => {
      // This will fetch from localStorage later
      return simulateAsync(undefined); // Placeholder
    }
  }
};