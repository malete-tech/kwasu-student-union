import { Opportunity } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const opportunities = {
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
};