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

// Import mock data (keeping for other sections not yet migrated to Supabase)
import eventsData from "@/data/events.json";
import documentsData from "@/data/documents.json";
import opportunitiesData from "@/data/opportunities.json";
import studentSpotlightData from "@/data/student-spotlight.json";

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
      return data as News[];
    },
    getLatest: async (count: number): Promise<News[]> => {
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false }).limit(count);
      if (error) {
        console.error("Supabase error fetching latest news:", error);
        throw new Error(error.message);
      }
      return data as News[];
    },
    getBySlug: async (slug: string): Promise<News | undefined> => {
      const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Supabase error fetching news by slug:", error);
        throw new Error(error.message);
      }
      return data as News | undefined;
    },
    create: async (news: Omit<News, 'id' | 'created_at'>): Promise<News> => {
      const { title, slug, excerpt, bodyMd, tags, publishedAt, coverUrl } = news;
      const { data, error } = await supabase.from('news').insert({
        title,
        slug,
        excerpt,
        body_md: bodyMd,
        tags,
        published_at: publishedAt,
        cover_url: coverUrl,
      }).select().single();
      if (error) {
        console.error("Supabase error creating news:", error);
        throw new Error(error.message);
      }
      return data as News;
    },
    update: async (id: string, news: Partial<Omit<News, 'id' | 'created_at'>>): Promise<News> => {
      const updatePayload: Record<string, any> = { ...news };
      if (updatePayload['bodyMd'] !== undefined) {
        updatePayload['body_md'] = updatePayload['bodyMd'];
        delete updatePayload['bodyMd'];
      }
      if (updatePayload['publishedAt'] !== undefined) {
        updatePayload['published_at'] = updatePayload['publishedAt'];
        delete updatePayload['publishedAt'];
      }
      if (updatePayload['coverUrl'] !== undefined) {
        updatePayload['cover_url'] = updatePayload['coverUrl'];
        delete updatePayload['coverUrl'];
      }

      const { data, error } = await supabase.from('news').update(updatePayload).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating news:", error);
        throw new Error(error.message);
      }
      return data as News;
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
      return data as Executive[];
    },
    getBySlug: async (slug: string): Promise<Executive | undefined> => {
      const { data, error } = await supabase.from('executives').select('*').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Supabase error fetching executive by slug:", error);
        throw new Error(error.message);
      }
      return data as Executive | undefined;
    },
    create: async (executive: Omit<Executive, 'id' | 'created_at'>): Promise<Executive> => {
      const { data, error } = await supabase.from('executives').insert(executive).select().single();
      if (error) {
        console.error("Supabase error creating executive:", error);
        throw new Error(error.message);
      }
      return data as Executive;
    },
    update: async (id: string, executive: Partial<Omit<Executive, 'id' | 'created_at'>>): Promise<Executive> => {
      const { data, error } = await supabase.from('executives').update(executive).eq('id', id).select().single();
      if (error) {
        console.error("Supabase error updating executive:", error);
        throw new Error(error.message);
      }
      return data as Executive;
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
    getAll: (): Promise<Event[]> => simulateAsync(eventsData as Event[]),
    getUpcoming: (count: number): Promise<Event[]> =>
      simulateAsync(
        (eventsData as Event[])
          .filter((event) => new Date(event.startsAt) > new Date())
          .sort(
            (a, b) =>
              new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          )
          .slice(0, count),
      ),
    getBySlug: (slug: string): Promise<Event | undefined> =>
      simulateAsync(
        (eventsData as Event[]).find((item) => item.slug === slug),
      ),
  },
  documents: {
    getAll: (): Promise<Document[]> =>
      simulateAsync(documentsData as Document[]),
  },
  opportunities: {
    getAll: (): Promise<Opportunity[]> =>
      simulateAsync(opportunitiesData as Opportunity[]),
  },
  studentSpotlight: {
    getAll: (): Promise<StudentSpotlight[]> =>
      simulateAsync(studentSpotlightData as StudentSpotlight[]),
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