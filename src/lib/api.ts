import {
  Executive,
  News,
  Event,
  Document,
  Opportunity,
  StudentSpotlight,
  Complaint,
  ComplaintStatus,
  ComplaintTimelineEntry,
} from "@/types";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

// Removed unused SIMULATED_DELAY and simulateAsync function

// Helper function to convert DB snake_case to frontend camelCase for complaints
const mapComplaintFromDb = (item: any): Complaint => ({
  id: item.id,
  category: item.category,
  title: item.title,
  description: item.description,
  contactEmail: item.contact_email,
  contactPhone: item.contact_phone,
  isAnonymous: item.is_anonymous,
  status: item.status,
  createdAt: item.created_at,
  userId: item.user_id, // Include user_id for admin view
  timeline: item.complaint_timeline ? item.complaint_timeline.map(mapTimelineFromDb) : [],
});

// Helper function to convert DB snake_case to frontend camelCase for timeline
const mapTimelineFromDb = (item: any): ComplaintTimelineEntry => ({
  id: item.id,
  complaintId: item.complaint_id,
  status: item.status,
  note: item.note,
  timestamp: item.timestamp,
});


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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
    getById: async (id: string): Promise<Document | undefined> => {
      const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') {
        console.error("Supabase error fetching document by ID:", error);
        throw new Error(error.message);
      }
      if (!data) return undefined;
      return {
        ...data,
        updatedAt: data.updated_at,
        fileType: data.file_type,
        fileSize: data.file_size,
      } as Document;
    },
    create: async (document: Omit<Document, 'id' | 'updatedAt'>): Promise<Document> => {
      const { data, error } = await supabase.from('documents').insert({
        title: document.title,
        url: document.url,
        tags: document.tags,
        file_type: document.fileType,
        file_size: document.fileSize,
      }).select().single();
      if (error) {
        console.error("Supabase error creating document:", error);
        throw new Error(error.message);
        // @ts-ignore
      }
      return {
        ...data,
        updatedAt: data.updated_at,
        fileType: data.file_type,
        fileSize: data.file_size,
      } as Document;
    },
    update: async (id: string, document: Partial<Omit<Document, 'id' | 'updatedAt'>>): Promise<Document> => {
      const updatePayload: Record<string, any> = {};
      if (document.title !== undefined) updatePayload['title'] = document.title;
      if (document.url !== undefined) updatePayload['url'] = document.url;
      if (document.tags !== undefined) updatePayload['tags'] = document.tags;
      if (document.fileType !== undefined) updatePayload['file_type'] = document.fileType;
      if (document.fileSize !== undefined) updatePayload['file_size'] = document.fileSize;
      updatePayload['updated_at'] = new Date().toISOString(); // Update timestamp on modification

      const { data, error } = await supabase.from('documents').update(updatePayload).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating document:", error);
        throw new Error(error.message);
        // @ts-ignore
      }
      return {
        ...data,
        updatedAt: data.updated_at,
        fileType: data.file_type,
        fileSize: data.file_size,
      } as Document;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) {
        console.error("Supabase error deleting document:", error);
        throw new Error(error.message);
      }
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
  },
  complaints: {
    submit: async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'timeline' | 'userId'> & { userId?: string }): Promise<Complaint> => {
      const { data, error } = await supabase.from('complaints').insert({
        user_id: complaint.userId,
        category: complaint.category,
        title: complaint.title,
        description: complaint.description,
        contact_email: complaint.contactEmail,
        contact_phone: complaint.contactPhone,
        is_anonymous: complaint.isAnonymous,
      }).select().single();

      if (error) {
        console.error("Supabase error submitting complaint:", error);
        throw new Error(error.message);
        // @ts-ignore
      }
      return mapComplaintFromDb(data);
    },
    getAll: async (): Promise<Complaint[]> => {
      // Admin function: fetch all complaints and their timelines
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
      // User/Admin function: fetch a single complaint with its timeline
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
      // 1. Update the status in the complaints table
      const { data: complaintData, error: updateError } = await supabase.from('complaints')
        .update({ status: newStatus })
        .eq('id', complaintId)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase error updating complaint status:", updateError);
        throw new Error(updateError.message);
      }

      // 2. Insert a new entry into the timeline table
      const { error: timelineError } = await supabase.from('complaint_timeline')
        .insert({
          complaint_id: complaintId,
          status: newStatus,
          note: note,
        });

      if (timelineError) {
        console.error("Supabase error inserting timeline entry:", timelineError);
        // Note: We proceed even if timeline fails, as status update succeeded.
      }

      // 3. Fetch the full updated complaint with timeline (optional, but good for consistency)
      const updatedComplaint = await api.complaints.getById(complaintId);
      if (!updatedComplaint) throw new Error("Failed to retrieve updated complaint.");

      return updatedComplaint;
    },
  },
  search: {
    searchAll: async (term: string): Promise<{ news: News[], events: Event[], opportunities: Opportunity[] }> => {
      const searchPattern = `%${term.toLowerCase()}%`;

      // 1. Search News (title, excerpt)
      const newsPromise = supabase.from('news')
        .select('*')
        .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern}`)
        .order('published_at', { ascending: false });

      // 2. Search Events (title, description_md, venue, category)
      const eventsPromise = supabase.from('events')
        .select('*')
        .or(`title.ilike.${searchPattern},description_md.ilike.${searchPattern},venue.ilike.${searchPattern},category.ilike.${searchPattern}`)
        .order('starts_at', { ascending: true });

      // 3. Search Opportunities (title, description_md, sponsor)
      const opportunitiesPromise = supabase.from('opportunities')
        .select('*')
        .or(`title.ilike.${searchPattern},description_md.ilike.${searchPattern},sponsor.ilike.${searchPattern}`)
        .order('deadline', { ascending: true });

      const [newsResult, eventsResult, opportunitiesResult] = await Promise.all([
        newsPromise,
        eventsPromise,
        opportunitiesPromise,
      ]);

      if (newsResult.error) {
        console.error("Supabase error searching news:", newsResult.error);
        throw new Error(newsResult.error.message);
      }
      if (eventsResult.error) {
        console.error("Supabase error searching events:", eventsResult.error);
        throw new Error(eventsResult.error.message);
      }
      if (opportunitiesResult.error) {
        console.error("Supabase error searching opportunities:", opportunitiesResult.error);
        throw new Error(opportunitiesResult.error.message);
      }

      const news = newsResult.data.map(item => ({
        ...item,
        bodyMd: item.body_md,
        publishedAt: item.published_at,
      })) as News[];

      const events = eventsResult.data.map(item => ({
        ...item,
        startsAt: item.starts_at,
        endsAt: item.ends_at,
        descriptionMd: item.description_md,
        rsvpOpen: item.rsvp_open,
        rsvpLink: item.rsvp_link,
        agendaMd: item.agenda_md,
      })) as Event[];

      const opportunities = opportunitiesResult.data.map(item => ({
        ...item,
        descriptionMd: item.description_md,
      })) as Opportunity[];

      return { news, events, opportunities };
    },
  },
};