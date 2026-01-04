import { News } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const news = {
  getAll: async (): Promise<News[]> => {
    const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    if (error) {
      console.error("Supabase error fetching news:", error);
      throw new Error(error.message);
    }
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
    return data.map(item => ({
      ...item,
      bodyMd: item.body_md,
      publishedAt: item.published_at,
      coverUrl: item.cover_url,
    })) as News[];
  },
  getById: async (id: string): Promise<News | undefined> => {
    const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching news by ID:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return {
      ...data,
      bodyMd: data.body_md,
      publishedAt: data.published_at,
      coverUrl: data.cover_url,
    } as News;
  },
  getBySlug: async (slug: string): Promise<News | undefined> => {
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching news by slug:", error);
      throw new Error(error.message);
    }
    if (!data) return undefined;
    return {
      ...data,
      bodyMd: data.body_md,
      publishedAt: data.published_at,
      coverUrl: data.cover_url,
    } as News;
  },
  create: async (news: Omit<News, 'id' | 'created_at'>): Promise<News> => {
    const { data, error } = await supabase.from('news').insert({
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt,
      body_md: news.bodyMd,
      tags: news.tags,
      published_at: news.publishedAt,
      cover_url: news.coverUrl,
    }).select().single();
    if (error) {
      console.error("Supabase error creating news:", error);
      throw new Error(error.message);
    }
    return {
      ...data,
      bodyMd: data.body_md,
      publishedAt: data.published_at,
      coverUrl: data.cover_url,
    } as News;
  },
  update: async (id: string, news: Partial<Omit<News, 'id' | 'created_at'>>): Promise<News> => {
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
};