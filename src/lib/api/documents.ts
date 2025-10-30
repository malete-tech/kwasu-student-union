import { Document } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const documents = {
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
};