import { News } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const news = {
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
    } as News;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      console.error("Supabase error deleting news:", error);
      throw new Error(error.message);
    }
  },
};