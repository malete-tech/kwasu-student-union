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
      // Convert snake_case from DB to camelCase for frontend type
      return data.map(item => ({
        ...item,
        bodyMd: item.body_md,
        publishedAt: item.published_at,
        coverUrl: item.cover_url,
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
        coverUrl: item.cover_url,
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
        coverUrl: data.cover_url,
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
        cover_url: news.coverUrl, // Map frontend coverUrl to database cover_url
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
        coverUrl: data.cover_url,
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
      if (news.coverUrl !== undefined) updatePayload['cover_url'] = news.coverUrl;

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
        coverUrl: data.cover_url,
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